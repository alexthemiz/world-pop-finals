# Trivia Kicks — Project Brain Dump

Paste this whole file into a fresh Claude Chat (or another assistant) to bring it up to speed. Last updated 2026-06-26.

## What it is
A World Cup 2026 country-trivia web game. Players answer questions about countries
playing in the tournament (population, stats, flags, etc.) in two modes:
- **Single player**: 10 questions, fully client-side, no DB writes except a
  best-effort "games played" counter bump.
- **Challenge mode (multiplayer)**: 5 questions, two players race head-to-head via
  a shareable link, synced through Supabase Realtime.

## Stack
- Next.js App Router (App Router only, no `/pages`), deployed on Vercel
- Supabase: Postgres + Realtime (no auth — identity is per-device via localStorage)
- Inline CSS only — no Tailwind, no CSS modules in JSX
- Press Start 2P (Google Fonts) for all text — retro/arcade look
- TypeScript throughout

## Repo layout (key files)
- `app/page.tsx` — home screen: mode select, name entry, outstanding-challenges list, games-played counter
- `app/single/page.tsx` — single player game (client-only)
- `app/game/[id]/page.tsx` — multiplayer game room (create/join/play/results)
- `app/game/[id]/opengraph-image.tsx` — dynamic OG image showing the matchup for share links
- `lib/questions.ts` — question generation logic
- `lib/supabase.ts` — Supabase client + `GameRow` type
- `lib/matches.ts` — World Cup 2026 `MATCHES` array, `getMatchInfo()`, `getAllMatchPairs()`
- `lib/countries.ts` — `COUNTRIES`, `DIASPORA`, `ISO_CODES`, `QUESTION_TYPES`, `SOURCES` (country stat data used to generate questions)
- `lib/push.ts` — web push subscription helper (client side)
- `lib/sounds.ts` — crowd cheer/boo audio clips for correct/wrong answers
- `lib/uuid.ts` — id generation
- `components/Pitch.tsx` — canvas-drawn pitch background + overlay UI (flags, question, choices, match info)
- `components/ScoreBoard.tsx` — dot-row score tracker (columns aligned regardless of name length)
- `components/QuestionReview.tsx` — post-game review of each question/answer
- `supabase/functions/send-game-push/index.ts` — Deno edge function, sends push notifications to the opponent (requires shared-secret header; excluded from Next.js TS build)

## Database (Supabase Postgres)
**`games` table**: `id text PK`, `questions jsonb`, `player1_name text`, `player2_name text`,
`player1_answers jsonb default '[]'`, `player2_answers jsonb default '[]'`,
`phase text default 'waiting'`, `round int default 1`, `created_at timestamptz`.

Phase lifecycle: `waiting → active → sudden_death → finished`.

**`games_played_counter` table**: single row (`id=1`) with `count bigint`, bumped via
the `increment_games_played()` RPC (security definer). Called from both single-player
and challenge-mode starts. Home page sums it for a combined "games played" stat.

## Identity model
No login. Multiplayer player identity (am I player1 or player2 in this game?) is
tracked client-side via `localStorage` key `trivia-kicks:<gameId>`, set at
create/join time.

## Env vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Working conventions / house rules
- Sequential pacing — ship one major feature at a time, don't batch unrelated changes
- Simple changes go directly to `main`; visual or risky changes get a feature branch
- Never guess on ambiguity — ask
- `middleware.ts` is off-limits (no modifications)
- Design docs for nontrivial features live in `docs/plans/YYYY-MM-DD-<feature>-design.md`,
  with a paired implementation plan `docs/plans/YYYY-MM-DD-<feature>.md`

## Feature history / chronological narrative
Roughly in build order (oldest → newest):
1. Core single-player + challenge mode gameplay, pitch UI, scoreboard
2. Country stats expanded in batches (Batch 1–4): fertility rate, obesity rate,
   happiness score, bird species, firearms rate, tea consumption, public holidays,
   internet speed, renewables, prison rate, homicide rate, tourists, languages,
   precipitation, coffee/cheese/honey consumption, hospital beds, schooling years,
   electricity access, road network, threatened species, protected land, disaster risk
   — all added to `lib/countries.ts` to diversify question pool
2a. Tied-stat questions get skipped (avoid ambiguous "which is higher" with equal values)
3. Single player bumped to 10 questions; challenge mode settled at 5
4. Games-played counter added (combined single+challenge stat on home page)
5. Waiting-for-opponent flow moved to home page, auto-redirects when opponent joins
6. Push notifications for challenge mode: service worker, `lib/push.ts` subscribe
   helper, `send-game-push` edge function, secured with a shared-secret header
   (401s now fail loudly instead of silently if secrets are missing)
7. Real crowd-cheer/crowd-boo audio clips wired in for correct/wrong answers
   (trimmed to ~1-2s, fade in/out added so they don't feel jarringly loud,
   volume lowered + fade lengthened in a later pass)
8. Outstanding challenges (unclaimed + in-progress) surfaced on home page,
   live-updated via Realtime (no manual refresh), with YOUR TURN vs WAITING ON
   OPPONENT labeling
9. Last-selected mode (single/challenge) remembered across visits
10. Scoreboard dot columns aligned regardless of player name length (fix)
11. Real "cancel" added for unclaimed challenge games (previously stuck forever)
12. Since push isn't reliably delivered yet, added a nudge UI prompting the
    waiting player to just text their opponent the link directly
13. Challenge link previews (e.g. when pasted into iMessage/Slack) now show the
    actual matchup in the title + a dynamically generated OG image
14. "Create Another Game" button added on the waiting-for-opponent screen so a
    player isn't stuck waiting with no other option
15. (2026-06-26) Renamed display name "World Pop Finals" → "Trivia Kicks"
    everywhere — UI text, metadata, OG images, push notifications, and the
    localStorage identity key (now `trivia-kicks:<gameId>`). URL/domain
    (world-pop-finals.vercel.app) intentionally left unchanged.

## Known rough edges / open threads
- Push notifications are unreliable (this is *why* the text-opponent nudge exists)
  — not yet fixed at the root, just worked around in UX
- `MATCHES` in `lib/matches.ts` intentionally deduplicates Spain–Saudi Arabia and
  Uruguay–Cabo Verde, which the original schedule brief listed under both Group G
  and Group H; canonically they live under Group H only — don't "fix" this back
- No automated test suite currently (verify changes manually / via `/run` or dev server)

## Where to look for more detail
- `docs/plans/` has full design docs + implementation plans for: player stats,
  expanded country stats, challenge-mode push notifications, text-opponent nudge
- `git log` is the most reliable source of "what actually happened and why" —
  commit messages in this repo are written to explain intent, not just the diff
