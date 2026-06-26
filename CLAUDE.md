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

## Key files
- app/page.tsx — home screen (mode select + name entry)
- app/single/page.tsx — single player (10Q, client-side only)
- app/game/[id]/page.tsx — multiplayer game room
- lib/questions.ts — question generation logic
- lib/supabase.ts — supabase client + GameRow type
- lib/matches.ts — MATCHES array, getMatchInfo(), getAllMatchPairs()
- lib/countries.ts — COUNTRIES, DIASPORA, ISO_CODES, QUESTION_TYPES, SOURCES
- components/Pitch.tsx — canvas pitch drawing + overlay UI (flags, question, choices, match info)
- components/ScoreBoard.tsx — dot row tracker

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
phase text default 'waiting' | round int default 1 | created_at timestamptz

## Supabase table: games_played_counter
Single row (id=1) with a `count bigint`. Incremented via the
`increment_games_played()` RPC (security definer) whenever a single-player
or challenge-mode game is started. Home page reads it to show a combined
"games played" total across both modes.

## Phase values
waiting → active → sudden_death → finished

## Notes
- MATCHES in lib/matches.ts deduplicates the Spain-Saudi Arabia and
  Uruguay-Cabo Verde fixtures that the original schedule brief listed under
  both Group G and Group H; they live under Group H only.
- Multiplayer player identity (player1 vs player2) is tracked client-side via
  localStorage key `trivia-kicks:<gameId>`, set on create/join.
