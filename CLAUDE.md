@AGENTS.md

# Trivia Kicks

World Cup 2026 country trivia game. Next.js App Router + Supabase + Vercel.

## Stack
- Next.js App Router (no pages dir)
- Supabase: Postgres + Realtime
- Inline CSS only — no Tailwind in JSX
- Press Start 2P font (Google Fonts) for all text
- Deployed on Vercel
- No middleware.ts modifications

## Env vars
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_VAPID_PUBLIC_KEY (web push subscribe key, client-side)

Edge function secrets (set on Supabase, not in .env): VAPID_PUBLIC_KEY,
VAPID_PRIVATE_KEY, WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY — used by
send-game-push.

## Key files
- app/page.tsx — home screen (mode select + name entry)
- app/single/page.tsx — single player (10Q, client-side only)
- app/game/[id]/page.tsx — multiplayer game room
- lib/questions.ts — question generation logic
- lib/supabase.ts — supabase client + GameRow type
- lib/matches.ts — MATCHES (group stage) array, getMatchInfo(), getAllMatchPairs(),
  getAllCountryPairs() (all 48-nation pairings, used for true "random")
- lib/knockoutMatches.ts — KNOCKOUT_MATCHES (Round of 32 + Round of 16, real
  results), KNOCKOUT_ROUNDS order, getAllKnockoutPairs()
- lib/countries.ts — COUNTRIES, DIASPORA, ISO_CODES, QUESTION_TYPES, SOURCES
- lib/push.ts — web push subscription helper (client side)
- components/Pitch.tsx — canvas pitch drawing + overlay UI (flags, question, choices, match info)
- components/ScoreBoard.tsx — dot row tracker
- components/FeedbackButton.tsx — floating feedback widget, writes to `feedback` table
- supabase/functions/send-game-push/index.ts — Deno edge function, pushes
  notifications to the opponent on phase change (requires x-webhook-secret
  header; excluded from Next.js TS build)

## Rules
- Sequential pacing — one major feature at a time
- Simple changes directly to main; visual/risky changes on a feature branch
- Never guess — if something is unclear, ask
- Single player gameplay is client-side only, no DB (it fires one
  best-effort RPC call to bump the games-played counter, nothing else)
- Multiplayer uses Supabase Realtime subscription on the games row

## Supabase table: games
id text PK | questions jsonb | player1_name text | player2_name text |
player1_answers jsonb default '[]' | player2_answers jsonb default '[]' |
phase text default 'waiting' | round int default 1 | created_at timestamptz |
player1_uuid text | player2_uuid text

player1_uuid/player2_uuid let a device's game history be queried later; not
the same as the localStorage identity key (see Notes below).

## Supabase table: games_played_counter
Single row (id=1) with a `count bigint`. Incremented via the
`increment_games_played()` RPC (security definer) whenever a single-player
or challenge-mode game is started. Home page reads it to show a combined
"games played" total across both modes.

## Supabase table: question_stats
question_type text PK | correct int default 0 | total int default 0

Per-question-type accuracy, incremented via the `increment_question_stats()`
RPC when a challenge-mode game finishes (app/game/[id]/page.tsx). Read by
both single and challenge mode to show stat context. Max ~17 rows (one per
question type in lib/countries.ts QUESTION_TYPES).

## Supabase table: push_subscriptions
game_id text | slot text ('player1'|'player2') | endpoint text | p256dh text |
auth text | created_at timestamptz — PK (game_id, slot)

Web push subscriptions for challenge-mode opponents, written by
lib/push.ts subscribeToGamePush(). Read by the send-game-push edge function
on phase change; stale subscriptions (404/410 from the push service) are
deleted automatically.

## Supabase table: feedback
id bigint PK identity | message text | page_url text | created_at timestamptz

Free-text feedback submitted via components/FeedbackButton.tsx. Public
insert-only (no read policy needed client-side) — check the Supabase table
directly to read submissions.

## Phase values
waiting → active → sudden_death → finished

## Notes
- MATCHES in lib/matches.ts deduplicates the Spain-Saudi Arabia and
  Uruguay-Cabo Verde fixtures that the original schedule brief listed under
  both Group G and Group H; they live under Group H only.
- Home page match picker (app/page.tsx) is a single-choice toggle: Random
  (any 2 of 48 nations) / Knockout Round dropdown / Group Stage dropdown /
  Pick-two-countries (two dropdowns, duplicate country blocked). Only one is
  "armed" at a time — picking one clears the other three's selections.
  lib/knockoutMatches.ts currently only has Round of 32 + Round of 16 (both
  fully resolved); quarterfinals onward weren't added since they were still
  in progress when the data was pulled — add them once settled.
- Multiplayer player identity (player1 vs player2) is tracked client-side via
  localStorage key `trivia-kicks:<gameId>`, set on create/join.
- PROJECT_BRAINDUMP.md is a standalone project summary meant to be pasted
  into a fresh chat for context — update it alongside this file when making
  notable changes.
