# Player Stats & Question Accuracy — Design

**Date:** 2026-06-17

## Goal

Two features:
1. **Personal dashboard on home screen** — W/L/D record + last 5 games, identified by device UUID stored in localStorage
2. **Per-question global accuracy on results page** — "X% of players got this right" next to each question in the review

## Data Layer

### `games` table (existing) — add two columns

| Column | Type | Notes |
|---|---|---|
| `player1_uuid` | text | Set on game create |
| `player2_uuid` | text | Set on game join |

### `question_stats` table (new)

| Column | Type | Notes |
|---|---|---|
| `question_type` | text PK | Matches QUESTION_TYPES keys (e.g. "pop", "area", "fifa", "diaspora") |
| `correct` | int default 0 | Running total of correct answers |
| `total` | int default 0 | Running total of answers submitted |

17 rows max (one per question type). Accuracy = `correct / total`.

## Client Changes

### UUID management (`lib/uuid.ts`)
- `getOrCreateUUID()` — reads `wpf-uuid` from localStorage, creates and saves one if absent

### Game create/join
- `app/page.tsx` — pass `player1_uuid` when inserting game row
- `app/game/[id]/page.tsx` — pass `player2_uuid` when joining

### Question stats update (on game finish)
- In `maybeAdvancePhase`, when writing `phase: "finished"`, also call a Supabase RPC `increment_question_stats(questions, p1_answers, p2_answers)`
- RPC iterates each question, increments `total += 2`, `correct += (p1_correct + p2_correct)`
- Use `INSERT ... ON CONFLICT DO UPDATE` so rows are created automatically

### Home screen (`app/page.tsx`)
- On mount, call `getOrCreateUUID()` then query:
  `select id, player1_name, player2_name, player1_answers, player2_answers, player1_uuid, player2_uuid, questions from games where phase = 'finished' and (player1_uuid = ? or player2_uuid = ?) order by created_at desc limit 5`
- Derive W/L/D and last 5 game rows client-side
- Render below mode toggle: score badge (e.g. `3W · 1L · 1D`) + compact game list

### Results page (`components/QuestionReview.tsx`)
- Accept optional `questionStats: Record<string, { correct: number; total: number }>` prop
- Below each question's explanation, show `(X% correct)` if stats available
- Fetch stats once on results mount in both `app/single/page.tsx` and `app/game/[id]/page.tsx`

## Out of Scope
- Cross-device sync (UUID is device-local by design)
- Pending challenge inbox
- Single player games counted in W/L/D
- Global leaderboard

## Cost
All within Supabase free tier. One new table (17 rows), two new columns on `games`, one RPC function.
