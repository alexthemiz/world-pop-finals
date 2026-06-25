# Text-Opponent Nudge Design
_2026-06-22_

## Goal

Push notifications for challenge mode aren't reliably getting through to
opponents. Add a small text nudge on the "waiting for opponent" screen
reminding the waiting player to manually text their opponent that it's
their turn — doesn't remove friction, but makes the gap visible.

## Scope

One change, one file: `app/game/[id]/page.tsx`, in the active/sudden_death
view, where it currently renders:

```tsx
<CenteredMessage>WAITING FOR {oppName.toUpperCase()}...</CenteredMessage>
```

Add a second, smaller dim line directly below it:

```
TEXT {oppName} TO LET THEM KNOW IT'S THEIR TURN
```

Styled consistently with other small dim hint text already in the file
(e.g. the "NOTIFICATIONS BLOCKED" label — `fontSize: 7, color: var(--text-dim)`).

## Why only this one spot

By the time this branch renders, the opponent has already joined (we're
past the join screen, deep in the active/sudden_death phase) and the
current player has finished their round. So it's always genuinely "their
turn, not yet played" — no ambiguity with "they haven't joined yet" (that's
a separate, earlier branch with its own messaging).

## Non-goals

- No share/text button — plain copy only, per explicit choice.
- No change to the home page Outstanding Challenges list — out of scope
  for this round.
- No data, state, or architecture changes.
