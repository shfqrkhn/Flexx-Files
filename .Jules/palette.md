## 2024-05-22 - Interactive Elements as Divs
**Learning:** The app heavily utilizes `div` elements with `onclick` handlers for interactive controls (sets, checkboxes), completely bypassing keyboard accessibility and semantic roles.
**Action:** When refactoring vanilla JS apps, systematically replace interactive `div`s with `<button>` or `<label>`/`<input>` pairs to restore semantics and keyboard support without breaking the visual design (flexbox usually handles the transition well).

## 2024-05-24 - Dynamic ARIA Labels in Vanilla JS
**Learning:** In apps using direct DOM manipulation for state changes (like `innerHTML` replacement or attribute swapping), static ARIA labels become stale when content changes (e.g., swapping exercise videos).
**Action:** Always update associated accessibility attributes (`aria-label`, `aria-expanded`, etc.) within the same JavaScript handlers that update the visual content to ensure screen readers remain in sync.
