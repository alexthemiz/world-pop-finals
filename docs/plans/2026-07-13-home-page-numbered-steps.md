# Home Page Numbered Steps Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add numbered top-level headings ("1. PICK A MODE", "2. PICK THE COUNTRIES", etc.) to the home page so new users can see it's a sequential flow.

**Architecture:** Five label insertions/renames inside the existing JSX in `app/page.tsx`, all using the same style already used by sibling labels (`fontSize: 8, color: "var(--text)"`). No new state, no layout/structural changes.

**Tech Stack:** Next.js App Router, inline CSS, no automated test suite in this project — verification is manual via the dev server preview (per CLAUDE.md).

---

### Task 1: "1. PICK A MODE" above the mode toggle

**Files:**
- Modify: `app/page.tsx:349-350`

**Step 1: Make the change**

Insert a new label directly before the `{/* Mode toggle */}` comment block, between the title `<div>` (ending at line 348) and the mode toggle `<div>` (starting at line 351):

```tsx
          </div>

          <label style={{ fontSize: 8, color: "var(--text)" }}>1. PICK A MODE</label>

          {/* Mode toggle */}
          <div
```

**Step 2: Verify**

Start the dev server preview and load the home page. Confirm "1. PICK A MODE" now appears above the CHALLENGE MODE / SINGLE PLAYER toggle.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add '1. PICK A MODE' heading above mode toggle"
```

---

### Task 2: "2. PICK THE COUNTRIES" above the picker block

**Files:**
- Modify: `app/page.tsx:378-379`

**Step 1: Make the change**

Insert a new label directly before the existing `{/* Match picker */}` comment:

```tsx
          <label style={{ fontSize: 8, color: "var(--text)" }}>2. PICK THE COUNTRIES</label>

          {/* Match picker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 440 }}>
            <label style={{ fontSize: 8, color: "var(--text)" }}>PICK A SPECIFIC MATCH FROM THE 2026 TOURNAMENT</label>
```

Do not change the existing "PICK A SPECIFIC MATCH FROM THE 2026 TOURNAMENT", "OR PICK THE TWO COUNTRIES", or "OR CLICK FOR A RANDOM MATCHUP" labels — those stay as sub-labels under this new umbrella heading, unnumbered.

**Step 2: Verify**

In the preview, confirm "2. PICK THE COUNTRIES" appears above the three existing picker sub-sections, and that the sub-labels are unchanged.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add '2. PICK THE COUNTRIES' heading above picker block"
```

---

### Task 3: "3. PLAY" above the Single Player PLAY button

**Files:**
- Modify: `app/page.tsx:449-450`

**Step 1: Make the change**

Insert a new label directly before the existing `{/* Single player */}` comment:

```tsx
          <label style={{ fontSize: 8, color: "var(--text)" }}>3. PLAY</label>

          {/* Single player */}
          {mode === "single" && (
```

This label is unconditional in the JSX but sits right before the `mode === "single"` block, so make sure it's wrapped the same way — i.e. move the conditional to include the label, since the label should only show in Single Player mode:

```tsx
          {mode === "single" && (
            <label style={{ fontSize: 8, color: "var(--text)" }}>3. PLAY</label>
          )}

          {/* Single player */}
          {mode === "single" && (
```

(Two separate `mode === "single"` blocks is fine and matches the pattern already used elsewhere in this file — do not try to merge them into one conditional wrapping both the label and the button, since that would require restructuring the existing return.)

**Step 2: Verify**

In the preview, switch to Single Player mode and confirm "3. PLAY" appears above the PLAY button. Switch to Challenge Mode and confirm the label does NOT appear.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add '3. PLAY' heading above Single Player button"
```

---

### Task 4: Rename "ENTER YOUR NAME" to "3. ENTER YOUR NAME"

**Files:**
- Modify: `app/page.tsx:513-515`

**Step 1: Make the change**

```tsx
              <label style={{ fontSize: 8, color: "var(--text)", textAlign: "center" }}>
                3. ENTER YOUR NAME
              </label>
```

**Step 2: Verify**

In the preview, switch to Challenge Mode and confirm the label now reads "3. ENTER YOUR NAME".

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "fix: number 'ENTER YOUR NAME' label as step 3 in Challenge Mode"
```

---

### Task 5: "4. CREATE GAME" above the name-input/Create Game row

**Files:**
- Modify: `app/page.tsx:516` (the `<div style={{ display: "flex", gap: 10, alignItems: "center" }}>` row containing the name input and CREATE GAME button)

**Step 1: Make the change**

Insert a new label directly before that row, after the "3. ENTER YOUR NAME" label block:

```tsx
              <label style={{ fontSize: 8, color: "var(--text)", textAlign: "center" }}>
                3. ENTER YOUR NAME
              </label>
              <label style={{ fontSize: 8, color: "var(--text)", textAlign: "center" }}>
                4. CREATE GAME
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
```

**Step 2: Verify**

In the preview, confirm "4. CREATE GAME" appears between the "3. ENTER YOUR NAME" label and the name input/Create Game button row.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add '4. CREATE GAME' heading above name-input/Create Game row"
```

---

### Task 6: Final check and push

**Step 1:** Run `npm run build` to confirm no TypeScript/build errors.

**Step 2:** Do a full manual pass in the preview: toggle between Single Player and Challenge Mode, confirming the full numbered sequence reads correctly in each (1/2/3 for Single Player; 1/2/3/4 for Challenge Mode).

**Step 3:** `git push origin main` (per this project's "simple changes go directly to main" convention).
