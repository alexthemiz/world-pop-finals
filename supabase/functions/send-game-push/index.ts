import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;

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

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("unauthorized", { status: 401 });
  }

  const { record, old_record } = await req.json() as { record: GameRow; old_record: GameRow };
  if (!record || !old_record || record.phase === old_record.phase) {
    return new Response("no phase change", { status: 200 });
  }

  const subs = await getSubscriptions(record.id);
  const bySlot = (slot: string) => subs.filter((s) => s.slot === slot);
  const url = `/game/${record.id}`;

  if (old_record.phase === "waiting" && record.phase === "active") {
    for (const sub of bySlot("player1")) {
      await sendTo(record.id, sub, { title: "World Pop Finals", body: `${record.player1_name ?? "Someone"}'s opponent joined! Time to play.`, url });
    }
  } else if (record.phase === "sudden_death") {
    for (const sub of subs) {
      await sendTo(record.id, sub, { title: "World Pop Finals", body: "Sudden death! A tiebreaker question was added.", url });
    }
  } else if (record.phase === "finished") {
    for (const sub of subs) {
      await sendTo(record.id, sub, { title: "World Pop Finals", body: "Final result is in — tap to see who won!", url });
    }
  }

  return new Response("ok", { status: 200 });
});
