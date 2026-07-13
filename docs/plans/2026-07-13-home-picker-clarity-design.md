# Home picker clarity — design

## Problem

Two small clarity issues on the home page match picker (`app/page.tsx`):

1. The **RANDOM** button reads as ambiguous now that Challenge Mode is the
   default view — a player could read "random" as "match me with a random
   opponent" rather than "randomize the two countries used for questions."
2. The three section labels ("OR PICK A KNOCKOUT ROUND MATCH", "OR PICK A
   GROUP STAGE MATCH", "OR PICK THE TWO COUNTRIES") use `var(--text-dim)`,
   which reads as washed out against the pitch background.

## Design

- Rename the button from `RANDOM` to `RANDOM COUNTRIES` — same behavior,
  clearer copy. (`app/page.tsx`, the `selectRandom` button.)
- Change the three `<label>` elements' color from `var(--text-dim)` to
  `var(--text)` (the existing bright off-white already used for question
  text elsewhere) — no layout, spacing, or structural changes.

## Explicitly out of scope

The Random/Knockout/Group/Custom controls still use `var(--text-dim)` for
their own *inactive* state (e.g. an unselected dropdown's placeholder). That
dimming is a different visual role (unselected vs. active) than the section
labels, and wasn't part of the reported confusion — leaving as-is.
