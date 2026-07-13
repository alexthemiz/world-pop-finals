# Home page form-row layout — design

## Problem

The numbered-labels-above-centered-stack design just shipped didn't read
well. Rework needed: numbers on the left (not centered above), name entry
moved earlier in the flow, some labels renamed/shortened, and the 3
country-picking options visually grouped with a bracket.

## Layout model

Each step becomes a row: a left column (number + short label, ~140px)
and a right column (the controls), using `display: flex` per row instead
of the current centered stack. Below 600px width, rows stack
label-above-control instead of side-by-side (matches the existing
`.tk-main` breakpoint pattern already in `app/page.tsx` — dropdowns next
to a 140px label column won't fit on a 375px phone).

## The bracket

CSS-only brace (no images/SVG), consistent with how the rest of the site
fakes borders with plain CSS: a `border-left` on a wrapping div spanning
the height of the 3 sub-options, with short horizontal "serif" ticks
(small `border-top`/`border-bottom` nubs) at the top and bottom of that
left edge.

## Flow — Versus (Challenge) mode

1. **PICK A MODE** → VERSUS / SINGLE PLAYER toggle (renamed from
   "CHALLENGE MODE")
2. **ENTER YOUR NAME** → name input (moved earlier, before countries)
3. **PICK THE COUNTRIES** (bracket spans the 3 below; "PICK" dropped
   from each sub-item, sub-numbering restarts at 1)
   1. SPECIFIC MATCH FROM THE 2026 TOURNAMENT → knockout/group dropdowns
   2. TWO 2026 PARTICIPANTS OF YOUR CHOICE → country 1/2 dropdowns
   3. RANDOM MATCHUP → button (was "RANDOM COUNTRIES")
4. **CREATE GAME** → button text becomes "CREATE GAME LINK" (clearer
   that the point of creating it is to get a link to share)

## Flow — Single Player mode

No name entry, so renumbered down:
1. **PICK A MODE**
2. **PICK THE COUNTRIES** (same bracketed 3 sub-options)
3. **PLAY** → button

## Non-step content

"OUTSTANDING CHALLENGES" and "YOUR RECORD" (past games) aren't steps —
they stay as contextual info blocks, not numbered, positioned the same
as today (outstanding challenges after mode selection, record trailing
at the end).

"{N} GAMES PLAYED" moves from just under the page title/subtitle down to
just above `<Footer />`, after all steps and trailing lists.
