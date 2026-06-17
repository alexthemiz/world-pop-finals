# Player Stats & Question Accuracy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add device-based personal W/L/D history on the home screen and global per-question accuracy percentages on the results page.

**Architecture:** Add two UUID columns to the existing `games` table so we can query a device's game history. Add a `question_stats` table (17 rows max) incremented via a Supabase RPC on game finish. All identity is localStorage-based — no auth required.

**Tech Stack:** Next.js 16 App Router, Supabase (Postgres + RPC), TypeScript, inline CSS only, no new dependencies.

---

### Task 1: Supabase schema — add UUID columns to `games`

**Files:**
- No local files changed; run SQL in Supabase dashboard → SQL Editor

**Step 1: Run migration SQL**

In Supabase SQL Editor, run:

```sql
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS player1_uuid text,
  ADD COLUMN IF NOT EXISTS player2_uuid text;

CREATE INDEX IF NOT EXISTS games_player1_uuid_idx ON games (player1_uuid);
CREATE INDEX IF NOT EXISTS games_player2_uuid_idx ON games (player2_uuid);
```

**Step 2: Verify**

Run:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'games' AND column_name IN ('player1_uuid','player2_uuid');
```
Expected: 2 rows returned.

---

### Task 2: Supabase schema — create `question_stats` table

**Files:**
- No local files; run SQL in Supabase dashboard → SQL Editor

**Step 1: Run migration SQL**

```sql
CREATE TABLE IF NOT EXISTS question_stats (
  question_type text PRIMARY KEY,
  correct       int NOT NULL DEFAULT 0,
  total         int NOT NULL DEFAULT 0
);

ALTER TABLE question_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read question_stats"
  ON question_stats FOR SELECT USING (true);

CREATE POLICY "public update question_stats"
  ON question_stats FOR ALL USING (true);
```

**Step 2: Verify**

```sql
SELECT * FROM question_stats;
```
Expected: 0 rows, no error.

---

### Task 3: Supabase RPC — `increment_question_stats`

**Files:**
- No local files; run SQL in Supabase dashboard → SQL Editor

**Step 1: Create the function**

```sql
CREATE OR REPLACE FUNCTION increment_question_stats(
  p_question_types text[],
  p_correct_flags  boolean[]
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  i int;
BEGIN
  FOR i IN 1 .. array_length(p_question_types, 1) LOOP
    INSERT INTO question_stats (question_type, correct, total)
      VALUES (p_question_types[i], CASE WHEN p_correct_flags[i] THEN 1 ELSE 0 END, 1)
    ON CONFLICT (question_type) DO UPDATE
      SET correct = question_stats.correct + CASE WHEN p_correct_flags[i] THEN 1 ELSE 0 END,
          total   = question_stats.total + 1;
  END LOOP;
END;
$$;
```

The caller will invoke this once per player answer (passing each question_type + whether that player got it right). Two calls per finished game (one for each player).

**Step 2: Verify the function exists**

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'increment_question_stats';
```
Expected: 1 row.

---

### Task 4: Update `GameRow` type and Supabase client

**Files:**
- Modify: `lib/supabase.ts`

**Step 1: Add uuid fields to GameRow**

Open `lib/supabase.ts` and add `player1_uuid` and `player2_uuid` to the `GameRow` interface:

```typescript
export interface GameRow {
  id: string;
  questions: import("./questions").Question[];
  player1_name: string | null;
  player2_name: string | null;
  player1_answers: boolean[];
  player2_answers: boolean[];
  player1_uuid: string | null;
  player2_uuid: string | null;
  phase: string;
  round: number;
  created_at: string;
}
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add lib/supabase.ts
git commit -m "Add player1_uuid/player2_uuid to GameRow type"
```

---

### Task 5: Add `lib/uuid.ts`

**Files:**
- Create: `lib/uuid.ts`

**Step 1: Create the file**

```typescript
const KEY = "wpf-uuid";

export function getOrCreateUUID(): string {
  if (typeof localStorage === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add lib/uuid.ts
git commit -m "Add getOrCreateUUID helper"
```

---

### Task 6: Wire UUID into game create (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Import and use UUID on game create**

At the top of the file, add:
```typescript
import { getOrCreateUUID } from "@/lib/uuid";
```

In `handleCreateGame`, add `player1_uuid` to the insert:
```typescript
const { error: insertError } = await supabase.from("games").insert({
  id,
  questions,
  player1_name: name.trim(),
  player1_uuid: getOrCreateUUID(),
  phase: "waiting",
  round: 1,
});
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Set player1_uuid on game create"
```

---

### Task 7: Wire UUID into game join (`app/game/[id]/page.tsx`)

**Files:**
- Modify: `app/game/[id]/page.tsx`

**Step 1: Import UUID**

```typescript
import { getOrCreateUUID } from "@/lib/uuid";
```

**Step 2: Add uuid to the join update in `handleJoin`**

```typescript
const { data, error } = await supabase
  .from("games")
  .update({ player2_name: joinName.trim(), player2_uuid: getOrCreateUUID(), phase: "active" })
  .eq("id", id)
  .is("player2_name", null)
  .select()
  .single();
```

**Step 3: Type-check + commit**

```bash
npx tsc --noEmit
git add app/game/[id]/page.tsx
git commit -m "Set player2_uuid on game join"
```

---

### Task 8: Call RPC on game finish in `maybeAdvancePhase`

**Files:**
- Modify: `app/game/[id]/page.tsx`

**Step 1: Add a helper to call the RPC for one player's answers**

Add this function inside the component file (above the component):

```typescript
async function recordStats(questions: Question[], answers: boolean[]) {
  const types = questions.map((q) => q.questionType === "diaspora" ? "diaspora" : q.questionText.slice(0, 40));
  // Use a stable key: the questionType field for stat questions, "diaspora" for diaspora
  const qtypes = questions.map((q) =>
    q.questionType === "diaspora" ? "diaspora" : QUESTION_TYPES_MAP[q.questionText] ?? q.questionText.slice(0, 40)
  );
  await supabase.rpc("increment_question_stats", {
    p_question_types: qtypes,
    p_correct_flags: answers,
  });
}
```

Wait — we need a stable key per question. The cleanest approach: use the `questionType` field from `Question` for stat questions (e.g. "pop", "area", "fifa") and "diaspora" for diaspora questions. But `Question` only has `questionType: "stat" | "diaspora"`, not the specific stat name.

**Revised approach:** add a `statKey` field to `Question` in `lib/questions.ts` that stores the QUESTION_TYPES key (e.g. "pop", "area"). For diaspora questions, statKey = "diaspora".

**Step 2: Add `statKey` to `Question` interface in `lib/questions.ts`**

```typescript
export interface Question {
  home: string;
  away: string;
  group: string;
  questionType: "stat" | "diaspora";
  statKey: string;           // e.g. "pop", "area", "fifa", "diaspora"
  questionText: string;
  choiceA: string;
  choiceB: string;
  winner: string;
  explanation: string;
  matchInfo: MatchInfo | null;
}
```

In `makeStatQuestion`, add:
```typescript
statKey: qType.key,   // add .key to each QUESTION_TYPES entry (see Task 8 Step 3)
```

In `makeDiasporaQuestion`, add:
```typescript
statKey: "diaspora",
```

**Step 3: Add `key` field to each entry in `QUESTION_TYPES` in `lib/countries.ts`**

Each entry in `QUESTION_TYPES` needs a `key: string` field matching its identifier. For example:
```typescript
{ key: "pop", question: "WHICH COUNTRY HAS A LARGER POPULATION?", ... }
{ key: "area", question: "WHICH COUNTRY HAS A LARGER LAND AREA?", ... }
// etc. for all 17 types
```

**Step 4: Update `makeStatQuestion` in `lib/questions.ts`**

```typescript
function makeStatQuestion(match: MatchPair, qTypeIndex: number): Question {
  const qType = QUESTION_TYPES[qTypeIndex];
  // ... existing logic ...
  return {
    // ... existing fields ...
    statKey: qType.key,
  };
}
```

**Step 5: Add `recordStats` calls in `maybeAdvancePhase`**

In both places where `phase: "finished"` is written, add stat recording before the Supabase update:

```typescript
// Record stats for both players
await Promise.all([
  supabase.rpc("increment_question_stats", {
    p_question_types: row.questions.map((q) => q.statKey),
    p_correct_flags: row.player1_answers,
  }),
  supabase.rpc("increment_question_stats", {
    p_question_types: row.questions.map((q) => q.statKey),
    p_correct_flags: row.player2_answers,
  }),
]);
await supabase.from("games").update({ phase: "finished" }).eq("id", id).eq("phase", row.phase);
```

**Step 6: Type-check + commit**

```bash
npx tsc --noEmit
git add lib/countries.ts lib/questions.ts app/game/[id]/page.tsx
git commit -m "Track per-question stats via RPC on game finish"
```

---

### Task 9: Personal stats on home screen (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add state and fetch logic**

Inside `HomeContent`, add:

```typescript
const [myGames, setMyGames] = useState<GameRow[]>([]);

useEffect(() => {
  const uuid = getOrCreateUUID();
  if (!uuid) return;
  supabase
    .from("games")
    .select("id, player1_name, player2_name, player1_answers, player2_answers, player1_uuid, player2_uuid")
    .eq("phase", "finished")
    .or(`player1_uuid.eq.${uuid},player2_uuid.eq.${uuid}`)
    .order("created_at", { ascending: false })
    .limit(5)
    .then(({ data }) => { if (data) setMyGames(data as GameRow[]); });
}, []);
```

**Step 2: Derive W/L/D**

```typescript
const uuid = typeof localStorage !== "undefined" ? localStorage.getItem("wpf-uuid") ?? "" : "";
const record = myGames.reduce(
  (acc, g) => {
    const iP1 = g.player1_uuid === uuid;
    const my = iP1 ? g.player1_answers : g.player2_answers;
    const opp = iP1 ? g.player2_answers : g.player1_answers;
    const ms = my.filter(Boolean).length;
    const os = opp.filter(Boolean).length;
    if (ms > os) acc.w++;
    else if (ms < os) acc.l++;
    else acc.d++;
    return acc;
  },
  { w: 0, l: 0, d: 0 }
);
```

**Step 3: Render below mode toggle**

After the mode toggle `</div>` and before the single/challenge conditional blocks, add:

```tsx
{myGames.length > 0 && (
  <div style={{ width: "100%", maxWidth: 340, fontSize: 8, color: "var(--text-dim)" }}>
    <div style={{ color: "var(--gold)", marginBottom: 10, fontSize: 9 }}>
      YOUR RECORD: {record.w}W · {record.l}L · {record.d}D
    </div>
    {myGames.map((g) => {
      const iP1 = g.player1_uuid === uuid;
      const myName = iP1 ? g.player1_name : g.player2_name;
      const oppName = iP1 ? g.player2_name : g.player1_name;
      const my = (iP1 ? g.player1_answers : g.player2_answers).filter(Boolean).length;
      const opp = (iP1 ? g.player2_answers : g.player1_answers).filter(Boolean).length;
      const result = my > opp ? "W" : my < opp ? "L" : "D";
      const color = result === "W" ? "var(--green)" : result === "L" ? "var(--red)" : "var(--text-dim)";
      return (
        <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--panel-border)" }}>
          <span>{myName?.toUpperCase()} vs {oppName?.toUpperCase()}</span>
          <span style={{ color }}>{result} {my}–{opp}</span>
        </div>
      );
    })}
  </div>
)}
```

**Step 4: Type-check + commit**

```bash
npx tsc --noEmit
git add app/page.tsx
git commit -m "Show personal W/L/D record and recent games on home screen"
```

---

### Task 10: Show % correct in QuestionReview

**Files:**
- Modify: `components/QuestionReview.tsx`
- Modify: `app/single/page.tsx`
- Modify: `app/game/[id]/page.tsx`

**Step 1: Add `questionStats` prop to `QuestionReview`**

```typescript
interface Props {
  questions: Question[];
  answers: boolean[];
  questionStats?: Record<string, { correct: number; total: number }>;
}
```

Below each question's explanation line, add:

```tsx
{questionStats && questionStats[q.statKey] && questionStats[q.statKey].total > 0 && (
  <div style={{ fontSize: 7, color: "var(--text-dim)", marginTop: 4 }}>
    {Math.round((questionStats[q.statKey].correct / questionStats[q.statKey].total) * 100)}% of players got this right
  </div>
)}
```

**Step 2: Fetch question_stats in `app/game/[id]/page.tsx`**

Add state:
```typescript
const [questionStats, setQuestionStats] = useState<Record<string, { correct: number; total: number }>>({});
```

Fetch on results render (in the `phase === "finished"` block, or in a useEffect watching phase):
```typescript
useEffect(() => {
  if (game?.phase !== "finished") return;
  supabase.from("question_stats").select("*").then(({ data }) => {
    if (!data) return;
    const map: Record<string, { correct: number; total: number }> = {};
    data.forEach((r) => { map[r.question_type] = { correct: r.correct, total: r.total }; });
    setQuestionStats(map);
  });
}, [game?.phase]);
```

Pass to `<QuestionReview>`:
```tsx
<QuestionReview questions={game.questions} answers={myAnswers} questionStats={questionStats} />
```

**Step 3: Same fetch in `app/single/page.tsx`**

Add the same state + fetch (triggered when `questions` are done and score is shown), pass `questionStats` to `<QuestionReview>`.

**Step 4: Type-check + commit**

```bash
npx tsc --noEmit
git add components/QuestionReview.tsx app/game/[id]/page.tsx app/single/page.tsx
git commit -m "Show global % correct per question in results review"
```

---

### Task 11: Final push

```bash
git push
```

Verify on Vercel that the build passes. Test end-to-end:
1. Play a challenge game to completion — check `question_stats` table in Supabase has rows
2. Reload home screen — W/L/D record and recent game appear
3. Results page — each question shows a percentage
