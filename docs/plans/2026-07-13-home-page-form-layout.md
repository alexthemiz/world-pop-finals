# Home Page Form-Row Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the home page from a centered vertical stack into numbered form-style rows (left label column, right control column), reorder the flow so name entry comes before country picking, rename several labels, group the 3 country-picking options with a CSS bracket, and move the games-played counter to the bottom of the page.

**Architecture:** Two new small helper components (`StepRow`, `Bracket`) defined alongside the existing `FlagTicker`/`PitchBackground` helpers in `app/page.tsx`, plus a restructuring of `HomeContent`'s return JSX to use them. A new CSS class (`.tk-step-row`) added to the existing inline `<style>` block handles the row/stack responsive behavior, following the same mobile-default + `!important` desktop-override pattern already used by `.tk-main`. No new state, no new files.

**Tech Stack:** Next.js App Router, inline CSS (no Tailwind), no automated test suite — verification is manual via the dev server preview.

---

### Task 1: Add `StepRow` and `Bracket` helper components + responsive CSS

**Files:**
- Modify: `app/page.tsx:65` (insert new components after `PitchBackground`, before `function HomeContent()`)
- Modify: `app/page.tsx:302-304` (extend the existing `<style>` media query block)

**Step 1: Add the components**

Insert directly after the closing `}` of `PitchBackground()` (currently ending at line 65), before `function HomeContent() {`:

```tsx
function StepRow({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="tk-step-row" style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <div style={{ width: 150, flexShrink: 0, fontSize: 8, color: "var(--text)", textAlign: "left" }}>
        {number}. {label}
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        {children}
      </div>
    </div>
  );
}

function Bracket({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", paddingLeft: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "absolute", left: 0, top: 4, bottom: 4, borderLeft: "2px solid var(--panel-border)" }} />
      <div style={{ position: "absolute", left: 0, top: 4, width: 8, height: 2, background: "var(--panel-border)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 4, width: 8, height: 2, background: "var(--panel-border)" }} />
      {children}
    </div>
  );
}
```

`StepRow` defaults to a stacked (label-above-content) column — that's the mobile-safe default. The CSS override below switches it to a side-by-side row at wider widths.

**Step 2: Extend the responsive CSS**

In the existing `<style>` block inside `HomeContent`'s JSX (around line 302), change:

```tsx
        @media (min-width: 768px) {
          .tk-main { padding-top: 48px !important; }
        }
```

to:

```tsx
        @media (min-width: 768px) {
          .tk-main { padding-top: 48px !important; }
        }
        @media (min-width: 600px) {
          .tk-step-row { flex-direction: row !important; align-items: flex-start !important; }
        }
```

**Step 3: Verify**

Run `npm run build` — should compile with no errors (the components aren't used anywhere yet, so this just confirms no syntax mistakes).

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add StepRow and Bracket helper components for home page rework"
```

---

### Task 2: Move "GAMES PLAYED" out of the title block

**Files:**
- Modify: `app/page.tsx:328-348` (title block)
- Modify: `app/page.tsx:629` area (just before `<Footer />`)

**Step 1: Remove it from the title block**

Change:
```tsx
            <p style={{ fontSize: 9, color: "var(--text)", marginTop: 10 }}>
              COUNTRY TRIVIA SHOOTOUT
            </p>
            {gamesPlayed !== null && (
              <p style={{ fontSize: 8, color: "var(--gold)", marginTop: 12 }}>
                {gamesPlayed.toLocaleString()} GAMES PLAYED
              </p>
            )}
          </div>
```
to:
```tsx
            <p style={{ fontSize: 9, color: "var(--text)", marginTop: 10 }}>
              COUNTRY TRIVIA SHOOTOUT
            </p>
          </div>
```

**Step 2: Add it back just before the Footer**

Find the end of `main` (the `</main>` closing tag, right before `<Footer />`) and insert:

```tsx
          {gamesPlayed !== null && (
            <p style={{ fontSize: 8, color: "var(--gold)" }}>
              {gamesPlayed.toLocaleString()} GAMES PLAYED
            </p>
          )}
        </main>

        <Footer />
```

(Only the `{gamesPlayed !== null && (...)}` block is new here — `</main>` and `<Footer />` already exist, just add the new block directly above `</main>`.)

**Step 3: Verify**

`npm run build` compiles. In the preview, confirm "GAMES PLAYED" no longer shows under the subtitle and instead appears at the bottom of the page content, above the footer.

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "fix: move games-played counter to bottom of home page"
```

---

### Task 3: Step 1 — "PICK A MODE" as a StepRow, rename to VERSUS

**Files:**
- Modify: `app/page.tsx:350-378` (current mode toggle section)

**Step 1: Make the change**

Replace:
```tsx
          <label style={{ fontSize: 8, color: "var(--text)" }}>1. PICK A MODE</label>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--panel)",
              border: "3px solid var(--panel-border)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {(["vs-friend", "single"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  fontSize: 9,
                  padding: "12px 20px",
                  background: mode === m ? "var(--gold)" : "transparent",
                  color: mode === m ? "#000" : "var(--text-dim)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {m === "single" ? "SINGLE PLAYER" : "CHALLENGE MODE"}
              </button>
            ))}
          </div>
```

with:
```tsx
          <StepRow number={1} label="PICK A MODE">
            <div
              style={{
                display: "flex",
                background: "var(--panel)",
                border: "3px solid var(--panel-border)",
                borderRadius: 6,
                overflow: "hidden",
                width: "fit-content",
              }}
            >
              {(["vs-friend", "single"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  style={{
                    fontSize: 9,
                    padding: "12px 20px",
                    background: mode === m ? "var(--gold)" : "transparent",
                    color: mode === m ? "#000" : "var(--text-dim)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {m === "single" ? "SINGLE PLAYER" : "VERSUS"}
                </button>
              ))}
            </div>
          </StepRow>
```

Only the button label text changed (`"CHALLENGE MODE"` → `"VERSUS"`) — the `mode` state values (`"vs-friend"` / `"single"`) are unchanged, so no other code needs updating.

**Step 2: Verify**

`npm run build` compiles. In the preview, confirm the toggle now reads VERSUS / SINGLE PLAYER, sits in a label-left/control-right row on desktop widths, and stacks label-above-toggle below 600px (use `resize_window` to check both).

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wrap mode toggle in StepRow, rename CHALLENGE MODE to VERSUS"
```

---

### Task 4: Split the "VS Friend" block — outstanding challenges stays first, name entry becomes its own earlier step

**Files:**
- Modify: `app/page.tsx` (the whole `{mode === "vs-friend" && !waitingGameId && (...)}` block, currently lines 479-572 after Task 3's edits shift line numbers — search for the block by its content instead of exact line numbers)

**Context:** Today this is ONE big block containing, in order: outstanding challenges, "ENTER YOUR NAME" label, name input + Create Game button, error text, and "YOUR RECORD" list. We need to split it into pieces that can sit on either side of the (shared, step-numbered) match picker: outstanding challenges and name entry BEFORE the picker; the Create Game button and record list AFTER it.

**Step 1: Replace the outstanding-challenges + name-entry portion**

Find:
```tsx
          {/* VS Friend */}
          {mode === "vs-friend" && !waitingGameId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              {outstandingGames.length > 0 && (
                <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", maxWidth: 340 }}>
                  <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
                    OUTSTANDING CHALLENGES
                  </div>
                  {outstandingGames.map((g) => {
                    const iP1 = g.player1_uuid === uuid;
                    const myName = iP1 ? g.player1_name : g.player2_name;
                    const oppName = iP1 ? g.player2_name : g.player1_name;
                    const myAnswers = iP1 ? g.player1_answers : g.player2_answers;
                    const myTurn = g.phase !== "waiting" && myAnswers.length < g.questions.length;
                    const statusLabel = g.phase === "waiting" ? "UNCLAIMED" : myTurn ? "YOUR TURN" : "WAITING ON OPPONENT";
                    const statusColor = g.phase === "waiting" ? "var(--text-dim)" : myTurn ? "var(--gold)" : "var(--green)";
                    return (
                      <button
                        key={g.id}
                        onClick={() => router.push(`/game/${g.id}`)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          padding: "8px 0",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--panel-border)",
                          color: "var(--text)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: 8,
                          textAlign: "left",
                        }}
                      >
                        <span>{myName?.toUpperCase() ?? "YOU"} vs {oppName?.toUpperCase() ?? "?"}</span>
                        <span style={{ color: statusColor }}>{statusLabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <label style={{ fontSize: 8, color: "var(--text)", textAlign: "center" }}>
                3. ENTER YOUR NAME
              </label>
              <label style={{ fontSize: 8, color: "var(--text)", textAlign: "center" }}>
                4. CREATE GAME
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PLAYER 1"
                  maxLength={16}
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 10,
                    padding: 10,
                    background: "#0a0e14",
                    border: "2px solid var(--panel-border)",
                    color: "var(--text)",
                    borderRadius: 4,
                    width: 140,
                  }}
                />
                <button onClick={handleCreateGame} disabled={creating} style={ctaButtonStyle}>
                  {creating ? "..." : "CREATE GAME"}
                </button>
              </div>
              {error && <div style={{ fontSize: 8, color: "var(--red)" }}>{error}</div>}
              {myGames.length > 0 && (
                <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", marginTop: 6 }}>
                  <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
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
            </div>
          )}
```

with (note this now sits **before** the match picker in the file — see Task 5 for where the picker moves to):

```tsx
          {/* Outstanding challenges (not a numbered step) */}
          {mode === "vs-friend" && !waitingGameId && outstandingGames.length > 0 && (
            <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", maxWidth: 340 }}>
              <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
                OUTSTANDING CHALLENGES
              </div>
              {outstandingGames.map((g) => {
                const iP1 = g.player1_uuid === uuid;
                const myName = iP1 ? g.player1_name : g.player2_name;
                const oppName = iP1 ? g.player2_name : g.player1_name;
                const myAnswers = iP1 ? g.player1_answers : g.player2_answers;
                const myTurn = g.phase !== "waiting" && myAnswers.length < g.questions.length;
                const statusLabel = g.phase === "waiting" ? "UNCLAIMED" : myTurn ? "YOUR TURN" : "WAITING ON OPPONENT";
                const statusColor = g.phase === "waiting" ? "var(--text-dim)" : myTurn ? "var(--gold)" : "var(--green)";
                return (
                  <button
                    key={g.id}
                    onClick={() => router.push(`/game/${g.id}`)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 0",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--panel-border)",
                      color: "var(--text)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 8,
                      textAlign: "left",
                    }}
                  >
                    <span>{myName?.toUpperCase() ?? "YOU"} vs {oppName?.toUpperCase() ?? "?"}</span>
                    <span style={{ color: statusColor }}>{statusLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Enter your name (Versus mode only) */}
          {mode === "vs-friend" && !waitingGameId && (
            <StepRow number={2} label="ENTER YOUR NAME">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PLAYER 1"
                maxLength={16}
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: 10,
                  padding: 10,
                  background: "#0a0e14",
                  border: "2px solid var(--panel-border)",
                  color: "var(--text)",
                  borderRadius: 4,
                  width: 140,
                }}
              />
            </StepRow>
          )}
```

**Step 2: Verify**

`npm run build` compiles (it will still reference `handleCreateGame`, `error`, `myGames`, `record` from later in the file in Task 6 below — if you run the build between Task 4 and Task 5/6 you may see "unused variable" warnings for things temporarily not yet re-placed; that's expected mid-refactor and resolves once Task 6 is done. If it's a hard TypeScript error rather than a lint warning, skip ahead and do Task 5 and 6 in the same sitting before verifying.)

**Step 3: Commit** (bundle with Task 5 and 6 below if the build only passes once all three are done — see note above)

---

### Task 5: Move the match picker between name entry and the final step, wrap in StepRow + Bracket, rename sub-labels

**Files:**
- Modify: `app/page.tsx` (the `{/* Match picker */}` block)

**Step 1: Replace the picker block**

Find:
```tsx
          <label style={{ fontSize: 8, color: "var(--text)" }}>2. PICK THE COUNTRIES</label>

          {/* Match picker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 440 }}>
            <label style={{ fontSize: 8, color: "var(--text)" }}>PICK A SPECIFIC MATCH FROM THE 2026 TOURNAMENT</label>
            <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap" }}>
              <select
                value={pickedKnockout}
                onChange={(e) => selectKnockout(e.target.value)}
                style={{ ...pickerSelectStyle(pickerMode === "knockout"), width: "calc(50% - 4px)", minWidth: 140 }}
              >
                <option value="">— KNOCKOUT STAGE —</option>
                {KNOCKOUT_ROUNDS.map((round) => (
                  <optgroup key={round} label={`── ${round.toUpperCase()} ──`}>
                    {(groupedKnockout[round] ?? []).map((p) => (
                      <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                        {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select
                value={pickedGroupMatch}
                onChange={(e) => selectGroupMatch(e.target.value)}
                style={{ ...pickerSelectStyle(pickerMode === "group"), width: "calc(50% - 4px)", minWidth: 140 }}
              >
                <option value="">— GROUP STAGE —</option>
                {groups.map((g) => (
                  <optgroup key={g} label={`── GROUP ${g} ──`}>
                    {groupedMatches[g].map((p) => (
                      <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                        {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <label style={{ fontSize: 8, color: "var(--text)", marginTop: 10 }}>OR PICK THE TWO COUNTRIES</label>
            <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap" }}>
              <select
                value={customHome}
                onChange={(e) => selectCustomHome(e.target.value)}
                style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
              >
                <option value="">— COUNTRY 1 —</option>
                {countryNames.filter((c) => c !== customAway).map((c) => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
              <select
                value={customAway}
                onChange={(e) => selectCustomAway(e.target.value)}
                style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
              >
                <option value="">— COUNTRY 2 —</option>
                {countryNames.filter((c) => c !== customHome).map((c) => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <label style={{ fontSize: 8, color: "var(--text)", marginTop: 10 }}>OR CLICK FOR A RANDOM MATCHUP</label>
            <button
              onClick={selectRandom}
              style={{ fontSize: 8, padding: "10px 24px", background: pickerMode === "random" ? "var(--gold)" : "var(--panel)", color: pickerMode === "random" ? "#000" : "var(--text-dim)", border: `2px solid ${pickerMode === "random" ? "var(--gold)" : "var(--panel-border)"}`, borderRadius: 4, cursor: "pointer" }}
            >
              RANDOM COUNTRIES
            </button>
          </div>
```

with:
```tsx
          <StepRow number={mode === "vs-friend" ? 3 : 2} label="PICK THE COUNTRIES">
            <Bracket>
              <div>
                <div style={{ fontSize: 7, color: "var(--text-dim)", marginBottom: 6 }}>1. SPECIFIC MATCH FROM THE 2026 TOURNAMENT</div>
                <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap", maxWidth: 440 }}>
                  <select
                    value={pickedKnockout}
                    onChange={(e) => selectKnockout(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "knockout"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— KNOCKOUT STAGE —</option>
                    {KNOCKOUT_ROUNDS.map((round) => (
                      <optgroup key={round} label={`── ${round.toUpperCase()} ──`}>
                        {(groupedKnockout[round] ?? []).map((p) => (
                          <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                            {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <select
                    value={pickedGroupMatch}
                    onChange={(e) => selectGroupMatch(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "group"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— GROUP STAGE —</option>
                    {groups.map((g) => (
                      <optgroup key={g} label={`── GROUP ${g} ──`}>
                        {groupedMatches[g].map((p) => (
                          <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                            {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 7, color: "var(--text-dim)", marginBottom: 6 }}>2. TWO 2026 PARTICIPANTS OF YOUR CHOICE</div>
                <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap", maxWidth: 440 }}>
                  <select
                    value={customHome}
                    onChange={(e) => selectCustomHome(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— COUNTRY 1 —</option>
                    {countryNames.filter((c) => c !== customAway).map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                  <select
                    value={customAway}
                    onChange={(e) => selectCustomAway(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— COUNTRY 2 —</option>
                    {countryNames.filter((c) => c !== customHome).map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 7, color: "var(--text-dim)", marginBottom: 6 }}>3. RANDOM MATCHUP</div>
                <button
                  onClick={selectRandom}
                  style={{ fontSize: 8, padding: "10px 24px", background: pickerMode === "random" ? "var(--gold)" : "var(--panel)", color: pickerMode === "random" ? "#000" : "var(--text-dim)", border: `2px solid ${pickerMode === "random" ? "var(--gold)" : "var(--panel-border)"}`, borderRadius: 4, cursor: "pointer" }}
                >
                  RANDOM MATCHUP
                </button>
              </div>
            </Bracket>
          </StepRow>
```

**Step 2: Verify**

`npm run build` compiles. In the preview, confirm the picker sits under a "3. PICK THE COUNTRIES" (Versus) or "2. PICK THE COUNTRIES" (Single Player) heading, with a visible left-side bracket spanning the 3 sub-options, each sub-option showing its renamed text (no "PICK A"/"PICK THE"/"CLICK FOR A" prefixes), and the random button now reads "RANDOM MATCHUP".

**Step 3: Commit** (see note in Task 4 — commit Tasks 4-6 together if the build only compiles once all three are in place)

---

### Task 6: Final steps — "3. PLAY" (Single) and "4. CREATE GAME" (Versus, button only) + trailing record list

**Files:**
- Modify: `app/page.tsx` (the Single Player block and the tail end of the Versus flow)

**Step 1: Update the Single Player final step**

Find:
```tsx
          {mode === "single" && (
            <label style={{ fontSize: 8, color: "var(--text)" }}>3. PLAY</label>
          )}

          {/* Single player */}
          {mode === "single" && (
            <button
              onClick={() => {
                // getMatchPairs() falls back to the full random pool when the
                // current picker mode doesn't have a complete selection yet —
                // only route with home/away when it resolved to one specific pair.
                const pairs = getMatchPairs();
                if (pickerMode !== "random" && pairs.length === 1) {
                  const pair = pairs[0];
                  router.push(`/single?home=${encodeURIComponent(pair.home)}&away=${encodeURIComponent(pair.away)}`);
                  return;
                }
                router.push("/single");
              }}
              style={ctaButtonStyle}
            >
              PLAY
            </button>
          )}
```

with:
```tsx
          {mode === "single" && (
            <StepRow number={3} label="PLAY">
              <button
                onClick={() => {
                  // getMatchPairs() falls back to the full random pool when the
                  // current picker mode doesn't have a complete selection yet —
                  // only route with home/away when it resolved to one specific pair.
                  const pairs = getMatchPairs();
                  if (pickerMode !== "random" && pairs.length === 1) {
                    const pair = pairs[0];
                    router.push(`/single?home=${encodeURIComponent(pair.home)}&away=${encodeURIComponent(pair.away)}`);
                    return;
                  }
                  router.push("/single");
                }}
                style={ctaButtonStyle}
              >
                PLAY
              </button>
            </StepRow>
          )}
```

**Step 2: Add back the Create Game step and trailing record list**

Directly after the block from Step 1, add (this is new — it's the second half of what Task 4 removed from the old bundled block):

```tsx
          {mode === "vs-friend" && !waitingGameId && (
            <StepRow number={4} label="CREATE GAME">
              <button onClick={handleCreateGame} disabled={creating} style={ctaButtonStyle}>
                {creating ? "..." : "CREATE GAME LINK"}
              </button>
            </StepRow>
          )}
          {mode === "vs-friend" && !waitingGameId && error && (
            <div style={{ fontSize: 8, color: "var(--red)" }}>{error}</div>
          )}
          {mode === "vs-friend" && !waitingGameId && myGames.length > 0 && (
            <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", maxWidth: 340 }}>
              <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
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

Note: this drops the `handleCreateGame`'s `name.trim()` check message ("ENTER YOUR NAME FIRST") from appearing inline right after the button the way it used to — it's unchanged logic-wise (still the same `error` state, same message), just rendered in its own conditional block now since the input and button are no longer in the same wrapping `<div>`.

**Step 3: Verify**

`npm run build` compiles with zero errors and zero unused-variable warnings (this is the point where Tasks 4-6's pieces are all back in place). In the preview:
- Single Player mode shows steps 1, 2, 3 (PLAY).
- Versus mode shows steps 1, 2 (name), 3 (countries), 4 (Create Game Link), with outstanding challenges above step 2 and your record below step 4 when applicable.
- Confirm creating a game still works end-to-end (name validation error still shows, Create Game Link button still creates a game and transitions to the waiting screen).

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rework home page into numbered form rows with bracket-grouped picker"
```

---

### Task 7: Final check and push

**Step 1:** Run `npm run build` one more time to confirm everything compiles clean.

**Step 2:** Manual pass in the preview at both a desktop width (≥600px, rows side-by-side) and a mobile width (<600px, via `resize_window`) confirming rows stack correctly on mobile.

**Step 3:** `git push origin main` (per this project's "simple changes go directly to main" convention).
