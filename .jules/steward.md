## 2026-01-31 - [Palette] - [Modal Accessibility - aria-hidden Toggle]
**Protocol:** Modal dialogs must toggle `aria-hidden` attribute and move focus into modal on open. Screen readers should not access hidden modal content.

## 2026-01-31 - [Palette] - [Remove All Blocking States - User Override]
**Protocol:** No app state should block user progression without an override option. Rest period and Red recovery now have "Train Anyway" buttons allowing user autonomy while preserving safety warnings.

## 2026-01-28 - [Palette] - [Prevent Double-Tap Zoom on ALL Interactive Elements]
**Protocol:** Apply `touch-action: manipulation` to `summary` and `label` elements (and any other rapid interaction targets) to prevent mobile double-tap zoom, complying with the Law of Universality.

## 2024-05-22 - [Palette] - [Prevent Double-Tap Zoom & Touch Targets]
**Protocol:** Enforced `touch-action: manipulation` on all interactive elements (`a`, `input`, `select`, `textarea`) and increased "Delete Session" button touch target to 44x44px.
