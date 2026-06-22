# Challenge Mode Push Notifications Design
_2026-06-22_

## Goal

Notify challenge-mode players about game events (opponent joined, sudden
death triggered, results ready) even when their tab or browser is closed —
without adding logins, accounts, or any personally identifying data
collection.

## Constraints

- No accounts, no logins, no personal data (names/emails) tied to a device.
- Must work across mixed devices in the same game (e.g. one player on
  desktop Chrome, the other on mobile Safari).
- iOS Safari only supports Web Push if the site has been added to the home
  screen as a PWA — this is a platform limitation we surface with a hint,
  not something we can work around.
- Opt-in only. No auto-prompting, no nagging on repeat denial.

## Events

1. **Opponent joined** (`phase`: `waiting` → `active`) — notify player1.
2. **Sudden death tiebreaker added** (`phase` → `sudden_death`) — notify
   both players.
3. **Results ready** (`phase` → `finished`) — notify both players.

## Data model

New Supabase table, anonymous device tokens only — no names, no accounts:

```sql
create table push_subscriptions (
  game_id text not null,
  slot text not null check (slot in ('player1', 'player2')),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now(),
  primary key (game_id, slot)
);
```

RLS: clients may `insert`/`update` their own row (upsert on opt-in). No
client read access — only the Edge Function (service role) reads
subscriptions, to look up where to send a push for a given `game_id`.

## Client opt-in UI

A small "🔔 NOTIFY ME" button appears in two places:
- The "waiting for opponent" screen (`app/page.tsx`), for the creator.
- The active/sudden-death game room (`app/game/[id]/page.tsx`), for
  whichever slot is set.

On click: register `public/sw.js`, request `Notification` permission,
subscribe via `PushManager.subscribe()` with the public VAPID key, upsert
the subscription row keyed by `(game_id, slot)`. On success, button shows
"🔔 ON". On permission denial, button shows a quiet "blocked" state — no
retry loop.

Feature detection: if `'serviceWorker' in navigator && 'PushManager' in
window` is false (e.g. iOS Safari without home-screen install), the button
is replaced with a one-line hint: "Add this site to your home screen to
enable notifications."

## Delivery

A Supabase Database Webhook on `games` `UPDATE` calls a new Edge Function
(`send-game-push`) with the old and new row. The function:
1. Diffs `phase` (old vs new) to determine which of the 3 events fired.
2. Looks up the relevant subscription(s) for that `game_id` (player1 only
   for "joined"; both for sudden death / finished).
3. Sends a Web Push message via the `web-push` npm package using VAPID
   keys (public key in `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, private key as an
   Edge Function secret only).
4. On a 404/410 response (expired subscription), deletes that row.

## Client-side push receipt

`public/sw.js` handles:
- `push` — parses the JSON payload (`{ title, body, url }`) and shows the
  OS notification.
- `notificationclick` — focuses an existing tab on that game URL, or opens
  a new one.

## Error handling

- No subscription row for a slot → function silently skips (not an error).
- Expired/invalid subscription → deleted on send failure.
- Permission denied client-side → no retry, no re-prompt.

## Testing

- Manual cross-device test: create a game on desktop Chrome, join from a
  second device (Android Chrome and, separately, iOS Safari after
  home-screen install), verify all 3 notification events fire and tapping
  one opens the right game.
- Verify graceful degradation on iOS Safari without home-screen install
  (hint shown, no crash).
- Verify denying permission doesn't break the rest of the waiting/game-room
  flow.
