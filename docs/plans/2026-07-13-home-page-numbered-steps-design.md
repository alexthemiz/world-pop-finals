# Home page numbered steps — design

## Problem

New users may not immediately understand the home page is a sequential
flow (pick a mode → pick countries → [enter name] → [create game]). The
existing labels ("OR PICK A SPECIFIC MATCH", "ENTER YOUR NAME", etc.)
don't communicate order.

## Options considered

- **Left-aligned label/control rows** — bigger visual overhaul, changes
  the page from centered/stacked to a two-column layout, needs its own
  mobile-width handling. Rejected as more work than the problem needs.
- **Number the existing steps** (chosen) — keeps the current centered/
  stacked layout and existing sub-labels; just adds numbered top-level
  headings. Low risk, no responsive rework.

## Design

Add new numbered top-level headings (same style as existing labels:
`var(--text)`, fontSize 8) at these points in `app/page.tsx`:

1. **"1. PICK A MODE"** — new label above the Challenge Mode / Single
   Player toggle (currently no heading there).
2. **"2. PICK THE COUNTRIES"** — new umbrella heading above the picker
   block. The three existing sub-labels ("OR PICK A SPECIFIC MATCH", "OR
   PICK THE TWO COUNTRIES", "OR CLICK FOR A RANDOM MATCHUP") are
   unchanged underneath it — they are not separately numbered.
3. **"3. ENTER YOUR NAME"** — Challenge Mode only; renames the existing
   "ENTER YOUR NAME" label to include the number.
4. **"4. CREATE GAME"** — Challenge Mode only; new label above the
   name-input/Create Game row (no heading exists there today).

**Single Player mode** gets its own shorter sequence (no name entry or
create-game step): "1. PICK A MODE", "2. PICK THE COUNTRIES", "3. PLAY" —
a new label above the existing PLAY button.

No layout, spacing, or structural changes — purely new/renamed label
text using the existing label style.
