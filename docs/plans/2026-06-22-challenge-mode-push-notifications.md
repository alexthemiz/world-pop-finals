# Challenge Mode Push Notifications Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Notify challenge-mode players (opponent joined, sudden death started, results ready) via real OS-level push notifications, even when their tab/browser is closed, with zero accounts and zero personal data.

**Architecture:** A new `push_subscriptions` table stores anonymous per-device Web Push subscriptions keyed by `(game_id, slot)`. Clients opt in via a "🔔 NOTIFY ME" button that registers a service worker and subscribes to push. A Supabase Database Webhook fires on every `games` row UPDATE, calling a new Edge Function that diffs old vs. new `phase` to detect the 3 events and sends Web Push messages via VAPID keys.

**Tech Stack:** Next.js App Router (client), Supabase Postgres + Database Webhooks + Edge Functions (Deno, `npm:web-push` import), browser `PushManager`/`Notification`/`ServiceWorker` APIs.

**Design reference:** `docs/plans/2026-06-22-challenge-mode-push-notifications-design.md`

---

## Before you start

This codebase has no automated test runner (no jest/vitest configured — verify with `cat package.json`, there's no `test` script). Existing features in this repo are verified with `npx tsc --noEmit` plus manual browser testing, not unit tests. Follow that same pattern here: after each code change, run `npx tsc --noEmit` from `C:\Users\alexm\Documents\trivia-kicks`, and where a step says "test in browser," actually open the app and do it — don't skip it because it's manual.

The Supabase project for this app is **`zmmhuxozhgqjtbpaerzp`** ("alexthemiz's Project"). Use the Supabase MCP tools (`mcp__supabase__apply_migration`, `mcp__supabase__deploy_edge_function`, etc.) for all database/function work — don't hand-roll `psql` commands.

---

### Task 0: Generate VAPID keys

**No files changed — this is a one-time setup step.**

**Step 1: Generate the keypair**

Run:
```bash
npx --yes web-push generate-vapid-keys
```

Expected output: a public key and private key, each a base64url string like:
```
Public Key:
BN4Gv...
Private Key:
6Q1f...
```

**Step 2: Save the public key as a Next.js env var**

Add to `.env.local` (create it if it doesn't exist — it's gitignored):
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<the public key from step 1>
```

Also add the same line to the Vercel project's environment variables (Production + Preview) via the Vercel dashboard or `vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY` — ask the user to confirm this is done if you can't access the Vercel CLI/dashboard yourself.

**Step 3: Save the private key as a Supabase Edge Function secret**

Run (replace `<private key>` with the actual value — never commit it):
```bash
npx supabase secrets set VAPID_PRIVATE_KEY=<private key> --project-ref zmmhuxozhgqjtbpaerzp
```

If the Supabase CLI isn't installed/linked locally, use the `mcp__supabase__*` tools instead — check if there's a secrets-management MCP tool available; if not, ask the user to set it via the Supabase dashboard (Project Settings → Edge Functions → Secrets) and confirm before proceeding to Task 6.

**Step 4: Confirm**

Print (don't commit) both keys somewhere you can reference them for Task 6, then move on. Do NOT add the private key to any file in the repo.

---

### Task 1: `push_subscriptions` table + RLS

**Files:**
- No local files — this is a Supabase migration applied via MCP tool.

**Step 1: Apply the migration**

Use `mcp__supabase__apply_migration` with `project_id: "zmmhuxozhgqjtbpaerzp"`, `name: "add_push_subscriptions"`, and this SQL:

```sql
create table if not exists public.push_subscriptions (
  game_id text not null,
  slot text not null check (slot in ('player1', 'player2')),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  primary key (game_id, slot)
);

alter table public.push_subscriptions enable row level security;

create policy "Anyone can upsert their own subscription"
  on public.push_subscriptions for insert
  with check (true);

create policy "Anyone can update their own subscription"
  on public.push_subscriptions for update
  using (true);
```

Note: no `select` policy is granted to `anon`/`authenticated` — only the Edge Function (using the service role key, which bypasses RLS) can read subscriptions. This is intentional: clients write their own subscription but can never read anyone else's.

**Step 2: Verify**

Use `mcp__supabase__list_tables` with `project_id: "zmmhuxozhgqjtbpaerzp"`, `schemas: ["public"]`, `verbose: true` and confirm `push_subscriptions` appears with `rls_enabled: true` and the 5 expected columns.

**Step 3: Commit**

This is a DB-only change with no local file diff, so there's nothing to `git commit` for this task. Move on.

---

### Task 2: Service worker (`public/sw.js`)

**Files:**
- Create: `public/sw.js`

**Step 1: Write the service worker**

```javascript
self.addEventListener("push", (event) => {
  let data = { title: "World Pop Finals", body: "Something happened in your game.", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {
    // Ignore malformed payloads — fall back to defaults above.
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/file.svg",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
```

**Step 2: Verify it's served**

Run `npm run dev`, then visit `http://localhost:3000/sw.js` in the browser — confirm the raw JS file loads (Next.js serves anything in `public/` at the root path automatically, no config needed).

**Step 3: Commit**

```bash
git add public/sw.js
git commit -m "feat: add service worker for push notifications"
```

---

### Task 3: Client push helper (`lib/push.ts`)

**Files:**
- Create: `lib/push.ts`

**Step 1: Write the helper**

```typescript
import { supabase } from "./supabase";

export type PushSlot = "player1" | "player2";

export function isPushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function subscribeToGamePush(gameId: string, slot: PushSlot): Promise<boolean> {
  if (!isPushSupported()) return false;
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set");
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

  const { error } = await supabase.from("push_subscriptions").upsert({
    game_id: gameId,
    slot,
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  });

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}
```

**Step 2: Verify**

Run `npx tsc --noEmit` from `C:\Users\alexm\Documents\trivia-kicks`. Expected: no errors.

**Step 3: Commit**

```bash
git add lib/push.ts
git commit -m "feat: add client helper for push subscription"
```

---

### Task 4: "NOTIFY ME" button on the waiting screen (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

**Context:** `app/page.tsx` has a "waiting for opponent" block that renders when `waitingGameId` is set (search for `{waitingGameId && (` — it's right after the "VS Friend" block, currently showing "WAITING FOR OPPONENT...", a share link, COPY LINK/SHARE buttons, and CANCEL). Add the notify button there, since this is where the creator (player1) sits waiting for someone to join.

**Step 1: Import the helper and add state**

Near the top, add to the existing imports:
```typescript
import { subscribeToGamePush, isPushSupported } from "@/lib/push";
```

Add state near the other `useState` calls in `HomeContent`:
```typescript
const [notifyState, setNotifyState] = useState<"idle" | "on" | "blocked">("idle");
```

**Step 2: Add the button**

Inside the `{waitingGameId && (...)}` block, right after the `CANCEL` button (but still inside the same wrapping `<div>`), add:

```tsx
{isPushSupported() ? (
  notifyState === "on" ? (
    <div style={{ fontSize: 8, color: "var(--green)" }}>🔔 ON</div>
  ) : notifyState === "blocked" ? (
    <div style={{ fontSize: 8, color: "var(--text-dim)" }}>NOTIFICATIONS BLOCKED</div>
  ) : (
    <button
      onClick={async () => {
        const ok = await subscribeToGamePush(waitingGameId, "player1");
        setNotifyState(ok ? "on" : "blocked");
      }}
      style={{ ...ctaButtonStyle, fontSize: 8, padding: "10px 16px" }}
    >
      🔔 NOTIFY ME WHEN THEY JOIN
    </button>
  )
) : (
  <div style={{ fontSize: 7, color: "var(--text-dim)", maxWidth: 280 }}>
    ADD THIS SITE TO YOUR HOME SCREEN TO ENABLE NOTIFICATIONS
  </div>
)}
```

**Step 3: Verify**

Run `npx tsc --noEmit`. Expected: no errors.

Manual test: run `npm run dev`, create a challenge game, confirm the button renders on the waiting screen. Click it, accept the browser permission prompt, confirm it flips to "🔔 ON". (Full push delivery can't be tested until Task 6/7 are done — for now you're just confirming the subscription gets written. Check via `mcp__supabase__execute_sql` with a `select * from push_subscriptions` query that a row appeared.)

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add notify-me button to challenge mode waiting screen"
```

---

### Task 5: "NOTIFY ME" button in the game room (`app/game/[id]/page.tsx`)

**Files:**
- Modify: `app/game/[id]/page.tsx`

**Context:** This page renders the active game (answering questions) and a separate "finished" results view (search for `if (game.phase === "finished")` or similar — review the file structure first, since both an active-play view and a results view exist). Add the notify button to the **active/sudden_death view** (while the player is mid-game, not on the results screen — by the time you're on results, the game has already finished and notifications are moot for that game).

**Step 1: Read the file fully first**

Read `app/game/[id]/page.tsx` in full before editing — it's long and has several conditional render branches (waiting for slot, join screen, active play, finished). Find exactly where the active-play view's JSX begins (likely where `current` question and answer buttons render) and where a natural place exists to drop a small notify button without disrupting the question UI — e.g., near the top of that view, next to or below the score/round indicator.

**Step 2: Add the import, state, and button**

Add the import:
```typescript
import { subscribeToGamePush, isPushSupported } from "@/lib/push";
```

Add state near the other `useState` calls:
```typescript
const [notifyState, setNotifyState] = useState<"idle" | "on" | "blocked">("idle");
```

Add the button in the active-play view (adapt placement to fit the existing layout you find in Step 1 — keep it small and out of the way of the question/answer flow):

```tsx
{slot && isPushSupported() && (
  notifyState === "on" ? (
    <div style={{ fontSize: 7, color: "var(--green)" }}>🔔 ON</div>
  ) : notifyState === "blocked" ? (
    <div style={{ fontSize: 7, color: "var(--text-dim)" }}>NOTIFICATIONS BLOCKED</div>
  ) : (
    <button
      onClick={async () => {
        const ok = await subscribeToGamePush(id, slot);
        setNotifyState(ok ? "on" : "blocked");
      }}
      style={{ fontSize: 7, background: "transparent", border: "1px solid var(--panel-border)", color: "var(--text-dim)", borderRadius: 4, padding: "6px 10px", cursor: "pointer" }}
    >
      🔔 NOTIFY ME
    </button>
  )
)}
```

Note `id` here is the game id from `useParams<{ id: string }>()` (already in scope — check the top of the file for the exact variable name) and `slot` is the existing `Slot` state (`"player1" | "player2" | null`) already tracked in this component.

**Step 3: Verify**

Run `npx tsc --noEmit`. Expected: no errors.

Manual test: join a challenge game from a second browser/device, confirm the button appears during active play, click it, confirm it flips to "🔔 ON" and a second row appears in `push_subscriptions` for `slot = 'player2'` (or `player1` if you tested from the creator's side instead).

**Step 4: Commit**

```bash
git add "app/game/[id]/page.tsx"
git commit -m "feat: add notify-me button to challenge mode game room"
```

---

### Task 6: Edge Function `send-game-push`

**Files:**
- Create: `supabase/functions/send-game-push/index.ts` (local copy for version control — deployed via MCP tool, not auto-synced, so deploy explicitly in Step 2)

**Context:** Database Webhooks POST a JSON body shaped like `{ type: "UPDATE", table: "games", schema: "public", record: <new row>, old_record: <old row> }` to the function's HTTP endpoint. This function diffs `old_record.phase` vs `record.phase` to determine which of the 3 events fired (joined / sudden_death / finished), looks up subscriber(s) in `push_subscriptions` for that `game_id`, and sends each one a Web Push message.

**Step 1: Write the function**

```typescript
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

webpush.setVapidDetails("mailto:noreply@worldpopfinals.app", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface GameRow {
  id: string;
  phase: string;
  player1_name: string | null;
}

interface Subscription {
  slot: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function getSubscriptions(gameId: string): Promise<Subscription[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/push_subscriptions?game_id=eq.${gameId}&select=slot,endpoint,p256dh,auth`,
    { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

async function deleteSubscription(gameId: string, slot: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?game_id=eq.${gameId}&slot=eq.${slot}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
}

async function sendTo(sub: Subscription, payload: { title: string; body: string; url: string }) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) await deleteSubscription(sub.endpoint, sub.slot);
    else console.error("push send failed", err);
  }
}

Deno.serve(async (req) => {
  const { record, old_record } = await req.json() as { record: GameRow; old_record: GameRow };
  if (!record || !old_record || record.phase === old_record.phase) {
    return new Response("no phase change", { status: 200 });
  }

  const subs = await getSubscriptions(record.id);
  const bySlot = (slot: string) => subs.filter((s) => s.slot === slot);
  const url = `/game/${record.id}`;

  if (old_record.phase === "waiting" && record.phase === "active") {
    for (const sub of bySlot("player1")) {
      await sendTo(sub, { title: "World Pop Finals", body: `${record.player1_name ?? "Someone"}'s opponent joined! Time to play.`, url });
    }
  } else if (record.phase === "sudden_death") {
    for (const sub of subs) {
      await sendTo(sub, { title: "World Pop Finals", body: "Sudden death! A tiebreaker question was added.", url });
    }
  } else if (record.phase === "finished") {
    for (const sub of subs) {
      await sendTo(sub, { title: "World Pop Finals", body: "Final result is in — tap to see who won!", url });
    }
  }

  return new Response("ok", { status: 200 });
});
```

**Important fix before deploying:** the `deleteSubscription` call above is passed `sub.endpoint` where it should be passed `record.id` (the game id) — `deleteSubscription` takes `(gameId, slot)` but the catch block has `sub.endpoint` in the first argument slot by mistake in this draft. Fix it to:
```typescript
if (status === 404 || status === 410) await deleteSubscription(record.id, sub.slot);
```
This requires `record` to be in scope — restructure `sendTo` to accept `gameId` as a parameter:
```typescript
async function sendTo(gameId: string, sub: Subscription, payload: { title: string; body: string; url: string }) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) await deleteSubscription(gameId, sub.slot);
    else console.error("push send failed", err);
  }
}
```
And update all three call sites from `sendTo(sub, {...})` to `sendTo(record.id, sub, {...})`.

**Step 2: Deploy**

Use `mcp__supabase__deploy_edge_function` with `project_id: "zmmhuxozhgqjtbpaerzp"`, function name `send-game-push`, and the file content from Step 1 (corrected).

Set the two additional secrets the function needs (the public VAPID key, for `setVapidDetails` — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected into every Edge Function by Supabase, no need to set those manually):
```bash
npx supabase secrets set VAPID_PUBLIC_KEY=<public key from Task 0> --project-ref zmmhuxozhgqjtbpaerzp
```
(`VAPID_PRIVATE_KEY` was already set in Task 0.)

**Step 3: Verify deployment**

Use `mcp__supabase__get_edge_function` (or `list_edge_functions`) with `project_id: "zmmhuxozhgqjtbpaerzp"` to confirm `send-game-push` is listed and `ACTIVE`.

**Step 4: Commit the local copy**

```bash
git add supabase/functions/send-game-push/index.ts
git commit -m "feat: add send-game-push edge function for challenge mode notifications"
```

---

### Task 7: Database Webhook wiring

**Files:**
- No local files — this is a Supabase dashboard / SQL config step.

**Step 1: Create the webhook**

Database Webhooks aren't exposed via the `mcp__supabase__*` tool set used so far in this project (check `mcp__supabase__list_migrations` / dashboard first to confirm). If there's no MCP tool for it, use `mcp__supabase__execute_sql` to create it via `supabase_functions.http_request` trigger SQL, which is how Database Webhooks are implemented under the hood:

```sql
create trigger send_game_push_on_update
  after update on public.games
  for each row
  execute function supabase_functions.http_request(
    'https://zmmhuxozhgqjtbpaerzp.supabase.co/functions/v1/send-game-push',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}',
    '5000'
  );
```

If `supabase_functions.http_request` isn't available on this project (it requires the `pg_net`/`supabase_functions` extension, which is usually enabled by default on Supabase projects with Edge Functions), check the Supabase dashboard under **Database → Webhooks** instead and create the webhook there manually: table `games`, event `UPDATE`, target the `send-game-push` function URL. Ask the user to do this step via the dashboard if the SQL approach fails, since it's a one-time manual click-through.

**Step 2: Verify**

Use `mcp__supabase__execute_sql` to update a test game row's `phase` directly (e.g. `update games set phase = 'active' where id = '<some test game id>'`) and check the Edge Function logs via `mcp__supabase__get_logs` (service: `edge-function`) to confirm the function was invoked.

**Step 3: No commit needed** — this is server-side config, not a file change.

---

### Task 8: End-to-end manual test

**Files:** none — this is a verification pass.

**Step 1: Desktop → Desktop test**

In two different browsers (or one regular + one incognito window) on a desktop:
1. Browser A: go to the home page, create a challenge game, click "🔔 NOTIFY ME WHEN THEY JOIN", accept the permission prompt.
2. Close or background Browser A's tab entirely.
3. Browser B: open the shared game link, join with a name.
4. Confirm an OS notification appears for Browser A's machine within a few seconds, even with the tab closed.
5. Click the notification — confirm it opens/focuses the game.

**Step 2: Sudden death + finished events**

Play out a game to a tie (or deliberately answer to force one) so sudden death triggers, and confirm both players' subscribed devices get the sudden-death notification, then the finished notification once it resolves.

**Step 3: Mobile test**

Repeat Step 1 with Browser B on an Android Chrome mobile device, confirm the notification arrives with the phone screen off or Chrome in the background. If an iPhone is available, confirm Safari's button shows the "add to home screen" hint (not the notify button) when not installed, and that subscribing works after installing.

**Step 4: Report results**

This is the final task — once all three manual test passes succeed, the feature is complete. If anything fails, use `superpowers:systematic-debugging` before attempting fixes rather than guessing.
