@AGENTS.md

# Trivia Kicks

Year-round country trivia game (evergreen), with archived WC2026, WC2022, and WWC2023 tournament pages. Next.js App Router + Supabase + Vercel.

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

## Routes
- triviakicks.com/ — evergreen main page (searchable dropdowns, any ~169 FIFA nations, tournament cards)
- triviakicks.com/wc2026 — WC2026 tournament picker (all 48 nations, group/knockout dropdowns)
- triviakicks.com/wc2022 — WC2022 (Qatar) tournament picker
- triviakicks.com/wwc2023 — WWC2023 (Australia/NZ) tournament picker
- triviakicks.com/single — single player (10Q, client-side only)
- triviakicks.com/game/[id] — multiplayer game room

## Key files
- app/page.tsx — evergreen home screen (searchable dropdowns + tournament cards + mode select)
- app/wc2026/page.tsx, app/wc2022/page.tsx, app/wwc2023/page.tsx — tournament route wrappers
- app/single/page.tsx — single player (10Q, client-side only)
- app/game/[id]/page.tsx — multiplayer game room
- lib/questions.ts — question generation logic (skips null-valued fields)
- lib/supabase.ts — supabase client + GameRow type
- lib/matches.ts — MATCHES (WC2026 group stage) array, getMatchInfo(), getAllMatchPairs()
- lib/knockoutMatches.ts — KNOCKOUT_MATCHES (WC2026 knockout), KNOCKOUT_ROUNDS, getAllKnockoutPairs()
- lib/countries.ts — COUNTRIES (~169 FIFA nations), DIASPORA, ISO_CODES, QUESTION_TYPES, SOURCES
- lib/tournaments/types.ts — TournamentConfig type
- lib/tournaments/wc2026.ts, wc2022.ts, wwc2023.ts — tournament configs (groups, knockout, nations)
- lib/tournaments/index.ts — TOURNAMENTS list + named exports
- lib/push.ts — web push subscription helper (client side)
- components/TournamentPage.tsx — shared tournament picker UI (parameterized by TournamentConfig)
- components/H2HPanel.tsx — H2H soccer history panel shown on game results screen
- components/HomeDecorations.tsx — FlagTicker + PitchBackground (shared between main and tournament pages)
- components/Pitch.tsx — canvas pitch drawing + overlay UI (flags, question, choices, match info)
- components/ScoreBoard.tsx — dot row tracker
- components/FeedbackButton.tsx — floating feedback widget, writes to `feedback` table
- scripts/import-h2h.ts — one-time Kaggle CSV → country_h2h Supabase import (needs scripts/results.csv)
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

## Supabase table: country_h2h
country_a text | country_b text | a_wins int | b_wins int | draws int |
total_matches int | last_matches jsonb | last_updated timestamptz —
PK (country_a, country_b), always stored alphabetically (a < b).
Populated by scripts/import-h2h.ts from Kaggle international results CSV
(user must download scripts/results.csv first). Read by H2HPanel on the
game results screen. Public read, no public write.

## Phase values
waiting → active → sudden_death → finished

## Notes
- MATCHES in lib/matches.ts deduplicates the Spain-Saudi Arabia and
  Uruguay-Cabo Verde fixtures that the original schedule brief listed under
  both Group G and Group H; they live under Group H only.
- lib/knockoutMatches.ts has all WC2026 rounds fully resolved through the Final
  (Spain 1-0 Argentina AET). Third Place was England 6-4 France.
- Evergreen home page (app/page.tsx) uses searchable input dropdowns over all
  ~169 COUNTRIES (not `<select>`) for type-to-filter behavior. Random button
  picks any two nations. Tournament cards link to the three archive pages.
- CountryStats fields (except pop, area, founded) are `number | null`. Nations
  with thin data have mostly null fields and simply generate fewer questions.
  allQuestionsForMatch skips any question type where either country has null.
- Tournament pages (/wc2026, /wc2022, /wwc2023) share components/TournamentPage.tsx,
  parameterized by a TournamentConfig from lib/tournaments/. Adding future
  tournaments (WC2027W, WC2030) requires a new config file + route only.
- H2H import: download Kaggle "International Football Results" CSV, save as
  scripts/results.csv, run: SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/import-h2h.ts
- Multiplayer player identity (player1 vs player2) is tracked client-side via
  localStorage key `trivia-kicks:<gameId>`, set on create/join.
- PROJECT_BRAINDUMP.md is a standalone project summary meant to be pasted
  into a fresh chat for context — update it alongside this file when making
  notable changes.
