# Home Picker Clarity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename the home page's "RANDOM" picker button to "RANDOM COUNTRIES" and brighten the three "OR PICK A ___" section labels from `var(--text-dim)` to `var(--text)`.

**Architecture:** Two inline string/style edits inside the existing match-picker JSX in `app/page.tsx`. No new state, no new components, no behavior change — copy and color only.

**Tech Stack:** Next.js App Router, inline CSS (no Tailwind), no automated test suite in this project — verification is manual via the dev server preview.

---

### Task 1: Rename the Random button

**Files:**
- Modify: `app/page.tsx:384`

**Step 1: Make the change**

Change:
```tsx
              RANDOM
```
to:
```tsx
              RANDOM COUNTRIES
```

This is the button text inside the `<button onClick={selectRandom} ...>` element at `app/page.tsx:380-385`. Nothing else in that button changes — same `onClick`, same conditional styling.

**Step 2: Verify**

Start the dev server preview (`preview_start` with the `dev` config in `.claude/launch.json`, or `npm run dev`) and load the home page. Confirm the button now reads "RANDOM COUNTRIES" and still toggles gold/active when clicked, same as before.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "fix: rename Random button to \"RANDOM COUNTRIES\" for clarity"
```

---

### Task 2: Brighten the three picker section labels

**Files:**
- Modify: `app/page.tsx:387`, `app/page.tsx:405`, `app/page.tsx:423`

**Step 1: Make the change**

In each of the three `<label>` elements below, change `color: "var(--text-dim)"` to `color: "var(--text)"`. Everything else in the style object (`fontSize`, `marginTop`) stays the same.

`app/page.tsx:387`:
```tsx
            <label style={{ fontSize: 8, color: "var(--text)", marginTop: 14 }}>OR PICK A KNOCKOUT ROUND MATCH</label>
```

`app/page.tsx:405`:
```tsx
            <label style={{ fontSize: 8, color: "var(--text)", marginTop: 14 }}>OR PICK A GROUP STAGE MATCH</label>
```

`app/page.tsx:423`:
```tsx
            <label style={{ fontSize: 8, color: "var(--text)", marginTop: 14 }}>OR PICK THE TWO COUNTRIES</label>
```

Do **not** touch the `pickerSelectStyle()` helper or the Random button's inactive-state color (`var(--text-dim)` at `app/page.tsx:382`) — those control the *inactive* state of the controls themselves, which is explicitly out of scope per the design doc.

**Step 2: Verify**

In the running preview, confirm all three labels ("OR PICK A KNOCKOUT ROUND MATCH", "OR PICK A GROUP STAGE MATCH", "OR PICK THE TWO COUNTRIES") now render in the brighter off-white used for question text, not the dim gray. Confirm the Random button and the dropdowns' own placeholder/inactive text are unchanged (still dim when inactive).

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "fix: brighten home page picker section labels for readability"
```

---

### Task 3: Final check and push

**Step 1:** Run `npm run build` to confirm no TypeScript/build errors.

**Step 2:** `git push origin main` (per this project's "simple changes go directly to main" convention).
