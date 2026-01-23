## 2024-05-22 - Interactive Elements as Divs
**Learning:** The app heavily utilizes `div` elements with `onclick` handlers for interactive controls (sets, checkboxes), completely bypassing keyboard accessibility and semantic roles.
**Action:** When refactoring vanilla JS apps, systematically replace interactive `div`s with `<button>` or `<label>`/`<input>` pairs to restore semantics and keyboard support without breaking the visual design (flexbox usually handles the transition well).

## 2024-05-24 - Dynamic ARIA Labels in Vanilla JS
**Learning:** In apps using direct DOM manipulation for state changes (like `innerHTML` replacement or attribute swapping), static ARIA labels become stale when content changes (e.g., swapping exercise videos).
**Action:** Always update associated accessibility attributes (`aria-label`, `aria-expanded`, etc.) within the same JavaScript handlers that update the visual content to ensure screen readers remain in sync.

## 2024-05-25 - Accessible Fake File Inputs
**Learning:** Overlying invisible file inputs on buttons provides a seamless visual experience but breaks accessibility (focus visibility, screen reader announcement) if the underlying button remains in the tab order or if the input lacks a label.
**Action:** When using the invisible file input pattern, explicitly remove the visual button from the tab order (`tabindex="-1"`, `aria-hidden="true"`), label the input (`aria-label`), and proxy focus events from the input to the button's visual state (e.g., via `onfocus` toggling styles).
