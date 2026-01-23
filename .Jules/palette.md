## 2024-05-22 - Interactive Elements as Divs
**Learning:** The app heavily utilizes `div` elements with `onclick` handlers for interactive controls (sets, checkboxes), completely bypassing keyboard accessibility and semantic roles.
**Action:** When refactoring vanilla JS apps, systematically replace interactive `div`s with `<button>` or `<label>`/`<input>` pairs to restore semantics and keyboard support without breaking the visual design (flexbox usually handles the transition well).
