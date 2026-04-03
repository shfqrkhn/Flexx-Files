# CODEBASE.md

## Scope
- **apparent purpose:** Offline-first PWA for military-grade strength tracking.
- **stack/languages/frameworks:** Vanilla JS, HTML, CSS, Service Workers.
- **entry points:** `index.html`, `js/app.js`.
- **build/run/test systems:** npm, `npx serve`, node-based test scripts.
- **architectural style:** Module pattern, View-Controller decoupled via events/storage.
- **major operational invariants:** Zero external API calls, offline sovereignty, atomic local storage transactions.

## Repository Map
```text
CLAUDE.md
Complete_Strength_Protocol.md
LICENSE
README.md
assets/icon-192.png
assets/icon-512.png
css/styles.css
favicon.ico
index.html
js/accessibility.js
js/app.js
js/config.js
js/constants.js
js/core.js
js/i18n.js
js/observability.js
js/security.js
manifest.json
package-lock.json
package.json
sw.js
tests/benchmark_accessibility.mjs
tests/benchmark_accessibility_audit.js
tests/benchmark_app_lookup.mjs
tests/benchmark_audit_log.mjs
tests/benchmark_calculator.mjs
tests/benchmark_chart_logic.mjs
tests/benchmark_delete_session.mjs
tests/benchmark_get_last_non_deload.mjs
tests/benchmark_logger.mjs
tests/benchmark_lookup.mjs
tests/benchmark_plate_load.mjs
tests/benchmark_render_history_cache.mjs
tests/benchmark_render_nav.mjs
tests/benchmark_render_nav_skip.mjs
tests/benchmark_render_warmup_optimization.mjs
tests/benchmark_sanitize_json.mjs
tests/benchmark_sanitize_url.mjs
tests/benchmark_save_draft.mjs
tests/benchmark_save_session_lookup.mjs
tests/benchmark_save_session_real.mjs
tests/benchmark_storage.mjs
tests/benchmark_storage_reset.mjs
tests/benchmark_storage_usage.mjs
tests/simulation_24_months.mjs
tests/simulation_mobile_gestures.mjs
tests/test_alt_stats.mjs
tests/verify_app_render.mjs
tests/verify_correctness.mjs
tests/verify_e2e_flow.py
tests/verify_get_last_non_deload.mjs
tests/verify_history_pagination.mjs
tests/verify_input_zoom.html
tests/verify_optimization_last_session.mjs
tests/verify_plate_load.mjs
tests/verify_plate_load_lru.mjs
tests/verify_plate_load_precision.mjs
tests/verify_sanitize_url_cache_eviction.mjs
tests/verify_save_draft.mjs
tests/verify_save_session_volume.mjs
tests/verify_storage_reset.mjs
tests/verify_ui_decoupling.mjs
tests/verify_version_consistency.mjs
verification_error.png
verification_history.png
verification_lifting.png
verification_recovery.png
verification_warmup.png
```

## Authoritative Review Summary
- **core flows:** Workout session initialization -> weight calculation -> persistence to local storage -> history rendering.
- **important interfaces:** `Storage` (atomic saves), `Calculator` (progression logic), `Validator` (strict schema), `Sanitizer` (XSS prevention).
- **key configs:** `js/constants.js`, `manifest.json`, `sw.js`.
- **major invariants:** LocalStorage is the single source of truth; DOM updates use strictly sanitized inputs.
- **principal risks:** Local storage quota limits (handled by quota checks), DOM injection vulnerabilities (mitigated by Sanitizer), state mismatches on service worker updates.

## File Inventory
| Path | Role | Priority | Inclusion | Reason |
|---|---|---|---|---|
| `.gitignore` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `CLAUDE.md` | Documentation | Context | Summary | Contextual info |
| `CODEBASE.md` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `Complete_Strength_Protocol.md` | Documentation | Context | Summary | Contextual info |
| `LICENSE` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `README.md` | Documentation | Context | Summary | Contextual info |
| `assets/icon-192.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `assets/icon-512.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `css/styles.css` | View/UI | Important | Full | UI entry and styling |
| `favicon.ico` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `index.html` | View/UI | Important | Full | UI entry and styling |
| `js/accessibility.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/app.js` | Core Logic | Critical | Full | Core flow logic and persistence |
| `js/config.js` | Config/Settings | Critical | Full | Core business settings |
| `js/constants.js` | Config/Settings | Critical | Full | Core business settings |
| `js/core.js` | Core Logic | Critical | Full | Core flow logic and persistence |
| `js/i18n.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/observability.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/security.js` | Core Logic | Critical | Full | Core flow logic and persistence |
| `manifest.json` | Config/Manifest | Critical | Full | Entry point / config |
| `package-lock.json` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `package.json` | Config/Manifest | Critical | Full | Entry point / config |
| `sw.js` | Config/Manifest | Critical | Full | Entry point / config |
| `tests/benchmark_accessibility.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_accessibility_audit.js` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_app_lookup.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_audit_log.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_calculator.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_chart_logic.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_delete_session.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_get_last_non_deload.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_logger.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_lookup.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_plate_load.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_render_history_cache.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_render_nav.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_render_nav_skip.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_render_warmup_optimization.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_sanitize_json.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_sanitize_url.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_save_draft.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_save_session_lookup.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_save_session_real.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_storage.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_storage_reset.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/benchmark_storage_usage.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/simulation_24_months.mjs` | Test | Important | Full | Representative test |
| `tests/simulation_mobile_gestures.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/test_alt_stats.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_app_render.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_correctness.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_e2e_flow.py` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_get_last_non_deload.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_history_pagination.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_input_zoom.html` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_optimization_last_session.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_plate_load.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_plate_load_lru.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_plate_load_precision.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_sanitize_url_cache_eviction.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_save_draft.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_save_session_volume.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_storage_reset.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_ui_decoupling.mjs` | Test | Context | Summary | Repetitive test suites |
| `tests/verify_version_consistency.mjs` | Test | Context | Summary | Repetitive test suites |
| `verification_error.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `verification_history.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `verification_lifting.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `verification_recovery.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `verification_warmup.png` | Asset/Generated | Context | Excluded | Not behaviorally significant |

## Embedded Critical Files
### `css/styles.css`
- **role:** View/UI
- **why it matters:** UI entry and styling
- **inclusion mode:** Full
```css
/* === VARIABLES === */
:root {
    --bg-primary: #050505;
    --bg-secondary: #121212;
    --bg-card: #1e1e1e;
    --text-primary: #f0f0f0;
    --text-secondary: #a0a0a0;
    --accent: #ff6b35;
    --accent-glow: rgba(255, 107, 53, 0.3);
    --success: #00e676;
    --warning: #ffea00;
    --error: #ff1744;
    --border: #333;
    --radius-lg: 1rem;
    --radius-sm: 0.5rem;
    --nav-height: 65px;
    --safe-area-bottom: env(safe-area-inset-bottom);
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

    /* Responsive spacing system */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --content-padding-bottom: 5rem;

    /* Responsive typography */
    --font-xs: 0.875rem;
    --font-sm: 0.9375rem;
    --font-base: 1rem;
    --font-lg: 1.125rem;
}

/* === ACCESSIBILITY === */

/* Skip to main content link */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 var(--radius-sm) 0;
    z-index: 10000;
    font-weight: 600;
}

.skip-link:focus {
    top: 0;
    outline: 2px solid var(--success);
    outline-offset: 2px;
}

/* Screen reader only text */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

body.reduce-motion *,
body.reduce-motion *::before,
body.reduce-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    :root {
        --border: #ffffff;
        --text-secondary: #ffffff;
    }
}

/* === CORE === */
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

/* Allow text selection for accessibility - only disable on interactive elements */
/* Sentinel: Law of Universality - Prevent double-tap zoom on all interactive elements */
button, .nav-item, .stepper-btn, .set-btn, .timer-dock, summary, label, a, input, select, textarea, [role="button"], [role="tab"], [role="switch"] { touch-action: manipulation; }
button, .nav-item, .stepper-btn, .set-btn, summary, label { user-select: none; }

body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: var(--font-sans); margin: 0;
    height: 100vh; /* Fallback */
    height: 100dvh; /* Dynamic viewport height for mobile browsers */
    display: flex; flex-direction: column; overflow: hidden;
    font-size: var(--font-base);
}

/* Keyboard focus outline for accessibility (enhanced) */
*:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}

*:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* === LAYOUT === */
#app { height: 100%; display: flex; flex-direction: column; }
#main-content {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: var(--spacing-md) var(--spacing-md) calc(var(--nav-height) + var(--content-padding-bottom)) var(--spacing-md);
    scroll-behavior: smooth;
}
.container { max-width: 600px; margin: 0 auto; width: 100%; padding: 0 var(--spacing-xs); }
.flex-row { display: flex; align-items: center; }

/* === TYPOGRAPHY === */
h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 var(--spacing-sm) 0; }
h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: var(--spacing-md); color: var(--text-primary); }
h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-sm); }
.text-xs { font-size: var(--font-xs); color: var(--text-secondary); letter-spacing: 0.5px; }
a { transition: all 0.2s ease; }
a:active { transform: scale(0.9); opacity: 0.7; }
summary { cursor: pointer; transition: all 0.2s ease; }
summary:active { transform: scale(0.98); opacity: 0.8; }

/* === CARDS === */
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    transition: transform 0.2s;
}
.card:active { transform: scale(0.995); }

/* === CONTROLS === */
.stepper-control {
    display: flex; align-items: center; gap: var(--spacing-sm);
    background: var(--bg-secondary); padding: var(--spacing-xs);
    border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.stepper-btn {
    width: 44px; height: 44px; border-radius: var(--radius-sm);
    border: 2px solid var(--accent); background: var(--bg-card); color: var(--accent);
    font-size: 1.5rem; font-weight: bold; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}
.stepper-btn:active {
    transform: scale(0.92);
    background: var(--accent);
    color: var(--bg-primary);
    box-shadow: 0 0 12px var(--accent-glow);
}
.stepper-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
.stepper-value {
    flex: 1; text-align: center; font-size: 1.5rem; font-weight: 700;
    font-variant-numeric: tabular-nums; background: transparent; border: none; color: white;
    min-width: 0; max-width: 100%;
}
.set-group { display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.set-btn {
    flex: 1; height: 48px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg-secondary);
    color: var(--text-secondary); font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease; cursor: pointer;
}
.set-btn:active {
    transform: scale(0.95);
    background: var(--bg-card);
}
.set-btn.completed {
    background: var(--success); color: #000; border-color: var(--success);
    box-shadow: 0 0 10px rgba(0, 230, 118, 0.3);
}
.set-btn.completed:active {
    transform: scale(0.95);
    box-shadow: 0 0 20px rgba(0, 230, 118, 0.5);
}

/* === BUTTONS === */
.btn-primary {
    background: var(--accent); color: white; border: none;
    width: 100%; padding: var(--spacing-md); border-radius: var(--radius-lg);
    font-size: var(--font-base); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 4px 15px var(--accent-glow); margin-top: var(--spacing-md);
    transition: all 0.2s ease; cursor: pointer;
}
.btn-primary:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px var(--accent-glow);
}
.btn-secondary {
    background: var(--bg-secondary); color: var(--text-secondary);
    width: 100%; padding: var(--spacing-md); border-radius: var(--radius-sm);
    border: 1px solid var(--border); font-weight: 600; cursor: pointer;
    transition: all 0.2s ease;
}
.btn-secondary:active {
    transform: scale(0.98);
    background: var(--bg-card);
}

/* === TIMER DOCK === */
.timer-dock {
    position: fixed; bottom: calc(var(--nav-height) + var(--spacing-sm));
    left: 50%; transform: translateX(-50%) translateY(150%);
    width: 95%; max-width: 580px;
    background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(10px);
    border: 1px solid var(--accent); border-radius: 50px;
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex; justify-content: space-between; align-items: center;
    z-index: 500; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.timer-dock.active { transform: translateX(-50%) translateY(0); }
.timer-display { font-size: 1.5rem; font-weight: 900; color: var(--accent); font-variant-numeric: tabular-nums; }
.timer-skip { color: var(--text-secondary); font-size: var(--font-sm); letter-spacing: 1px; cursor: pointer; transition: all 0.2s ease; }
.timer-skip:active { transform: scale(0.95); color: var(--accent); }

/* === NAVIGATION === */
.bottom-nav {
    height: var(--nav-height); background: rgba(5, 5, 5, 0.95);
    backdrop-filter: blur(10px); border-top: 1px solid var(--border);
    display: flex; justify-content: space-around; align-items: center;
    position: fixed; bottom: 0; width: 100%; z-index: 1000;
    padding-bottom: var(--safe-area-bottom);
}
.nav-item {
    background: none; border: none; color: var(--text-secondary);
    display: flex; flex-direction: column; align-items: center; gap: var(--spacing-xs);
    font-size: var(--font-xs); font-weight: 600; opacity: 0.6; transition: 0.2s;
    cursor: pointer; padding: var(--spacing-sm);
}
.nav-item:active { transform: scale(0.92); }
.nav-item.active { opacity: 1; color: var(--accent); transform: translateY(-2px); }
.nav-item.active:active { transform: translateY(-2px) scale(0.92); }
.nav-item .icon { font-size: 1.4rem; }

/* === MODALS === */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
    z-index: 2000; display: flex; align-items: center; justify-content: center;
    opacity: 0; visibility: hidden; transition: 0.2s ease;
    padding: var(--spacing-md);
}
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: var(--spacing-lg);
    width: 100%; max-width: 400px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    transform: scale(0.95) translateY(var(--spacing-sm)); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-overlay.active .modal-box { transform: scale(1) translateY(0); }
.modal-actions { display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg); }
.btn-modal { padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-sm); font-weight: 600; border: none; cursor: pointer; transition: all 0.2s ease; }
.btn-modal:active { transform: scale(0.96); }
.btn-confirm { background: var(--accent); color: white; }
.btn-danger { background: var(--error); color: white; }
.btn-ghost { background: transparent; color: var(--text-secondary); }

/* === UTILS === */
.hidden { display: none !important; }
.fade-in { animation: fadeIn 0.4s ease-out; }
.big-check { width: 1.5rem; height: 1.5rem; accent-color: var(--accent); margin-right: var(--spacing-md); }
.checkbox-wrapper { display: flex; align-items: center; padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(var(--spacing-sm)); } to { opacity: 1; transform: translateY(0); } }

/* === RESPONSIVE MEDIA QUERIES === */

/* Small mobile devices (< 375px) */
@media (max-width: 374px) {
    :root {
        --spacing-md: 0.75rem;
        --spacing-lg: 1rem;
        --content-padding-bottom: 4rem;
        --font-xs: 0.8125rem;
    }

    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }

    .card { padding: var(--spacing-md); }
    .stepper-btn { width: 40px; height: 40px; font-size: 1.25rem; }
    .timer-dock { padding: var(--spacing-sm) var(--spacing-md); }
    .timer-display { font-size: 1.25rem; }
    .nav-item .icon { font-size: 1.25rem; }
}

/* Mobile devices (375px - 767px) - Default styles already optimized */
@media (min-width: 375px) and (max-width: 767px) {
    :root {
        --content-padding-bottom: 5rem;
    }
}

/* Tablet devices (768px - 1023px) */
@media (min-width: 768px) {
    :root {
        --spacing-md: 1.25rem;
        --spacing-lg: 2rem;
        --spacing-xl: 2.5rem;
        --content-padding-bottom: 4rem;
        --font-base: 1.0625rem;
        --font-lg: 1.25rem;
    }

    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }

    .container { max-width: 700px; }
    .card { padding: var(--spacing-xl); }

    #main-content {
        padding: var(--spacing-lg) var(--spacing-md) calc(var(--nav-height) + var(--content-padding-bottom)) var(--spacing-md);
    }

    .stepper-btn { width: 48px; height: 48px; }
    .set-btn { height: 52px; font-size: var(--font-lg); }

    .btn-primary { font-size: var(--font-lg); padding: 1.125rem; }

    .modal-box { max-width: 500px; padding: var(--spacing-xl); }
    .timer-dock { max-width: 650px; }
}

/* Desktop devices (1024px - 1439px) */
@media (min-width: 1024px) {
    :root {
        --spacing-md: 1.5rem;
        --spacing-lg: 2.5rem;
        --spacing-xl: 3rem;
        --content-padding-bottom: 3rem;
        --font-base: 1.125rem;
        --font-lg: 1.375rem;
    }

    h1 { font-size: 2.25rem; }
    h2 { font-size: 1.75rem; }

    .container { max-width: 800px; }

    #main-content {
        padding: var(--spacing-xl) var(--spacing-lg) calc(var(--nav-height) + var(--content-padding-bottom)) var(--spacing-lg);
    }

    .modal-box { max-width: 550px; }
    .timer-dock { max-width: 700px; }

    /* Hover states for desktop */
    .stepper-btn:hover:not(:active) {
        background: var(--accent);
        color: var(--bg-primary);
        box-shadow: 0 0 8px var(--accent-glow);
    }

    .set-btn:hover:not(:active) {
        background: var(--bg-card);
        border-color: var(--accent);
    }

    .btn-primary:hover:not(:active) {
        box-shadow: 0 6px 20px var(--accent-glow);
        transform: translateY(-2px);
    }

    .nav-item:hover:not(:active) {
        opacity: 0.8;
        color: var(--accent);
    }
}

/* Large desktop devices (> 1440px) */
@media (min-width: 1440px) {
    :root {
        --font-base: 1.1875rem;
        --font-lg: 1.5rem;
    }

    .container { max-width: 900px; }
    h1 { font-size: 2.5rem; }

    .card { padding: 2rem; }
    .modal-box { max-width: 600px; }
}

/* Landscape orientation optimizations for mobile */
@media (max-height: 600px) and (orientation: landscape) {
    :root {
        --content-padding-bottom: 2rem;
        --spacing-md: 0.75rem;
        --spacing-lg: 1rem;
    }

    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }

    .card { padding: var(--spacing-md); margin-bottom: var(--spacing-sm); }
    #main-content { padding: var(--spacing-sm) var(--spacing-md) calc(var(--nav-height) + var(--content-padding-bottom)) var(--spacing-md); }
}

/* Print styles for documentation */
@media print {
    .bottom-nav, .timer-dock, .btn-primary, .btn-secondary { display: none; }
    body { height: auto; }
    #main-content { padding: 1rem; overflow: visible; }
    .card { break-inside: avoid; }
}

/* Accessibility: Reduced motion for users with motion sensitivity */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }

    /* Keep essential transforms but remove transitions */
    .card:active { transform: none; }
    .stepper-btn:active { transform: scale(0.98); transition: none; }
    .set-btn:active { transform: scale(0.98); transition: none; }
    .btn-primary:active { transform: none; }
    .nav-item:active { transform: none; }
    .nav-item.active { transform: none; }
    .timer-dock { transition: none; }
    .modal-overlay { transition: none; }
    .modal-box { transition: none; transform: none; }
    .modal-overlay.active .modal-box { transform: none; }
}
```

### `index.html`
- **role:** View/UI
- **why it matters:** UI entry and styling
- **inclusion mode:** Full
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Flexx Files - Offline Strength Tracker</title>
    <meta name="description" content="Privacy-first, offline-first strength training tracker with automatic progression">
    <meta name="theme-color" content="#050505">

    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">

    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/icon-192.png">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div id="app">
        <!-- Dynamic Content Area -->
        <main id="main-content" class="view-container" role="main" aria-live="polite" tabindex="-1"></main>

        <!-- Floating Timer (Non-Blocking) -->
        <div id="timer-dock" class="timer-dock" role="timer" aria-live="off" aria-atomic="true">
            <div class="flex-row">
                <span class="timer-display" id="timer-val" aria-label="Rest timer">00:00</span>
                <span class="text-xs" style="margin-left: 10px; opacity: 0.7;">RESTING</span>
            </div>
            <div class="timer-controls">
                <button class="timer-skip" onclick="window.skipTimer()" aria-label="Skip rest timer">SKIP</button>
            </div>
        </div>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
            <button class="nav-item active" data-view="today" aria-label="Navigate to training" aria-current="page">
                <span class="icon" aria-hidden="true">⚡</span><span>TRAIN</span>
            </button>
            <button class="nav-item" data-view="history" aria-label="Navigate to workout logs">
                <span class="icon" aria-hidden="true">📅</span><span>LOGS</span>
            </button>
            <button class="nav-item" data-view="progress" aria-label="Navigate to progress charts">
                <span class="icon" aria-hidden="true">📈</span><span>GAINS</span>
            </button>
            <button class="nav-item" data-view="settings" aria-label="Navigate to system settings">
                <span class="icon" aria-hidden="true">⚙️</span><span>SYSTEM</span>
            </button>
        </nav>
    </div>

    <!-- Custom Modal Layer (Replaces Native Alerts) -->
    <div id="modal-layer" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-body" aria-hidden="true">
        <div class="modal-box">
            <h3 id="modal-title" class="modal-title"></h3>
            <div id="modal-body" class="modal-body"></div>
            <div id="modal-actions" class="modal-actions"></div>
        </div>
    </div>

    <script type="module" src="js/app.js"></script>
</body>
</html>
```

### `js/app.js`
- **role:** Core Logic
- **why it matters:** Core flow logic and persistence
- **inclusion mode:** Full
```javascript
import { EXERCISES, WARMUP, DECOMPRESSION, CARDIO_OPTIONS, RECOVERY_CONFIG, EXERCISE_MAP, WARMUP_MAP, DECOMPRESSION_MAP } from './config.js';
import { Storage, Calculator, Validator } from './core.js';
import { Observability, Logger, Metrics, Analytics } from './observability.js';
import { Accessibility, ScreenReader } from './accessibility.js';
import { Security, Sanitizer } from './security.js';
import { I18n, DateFormatter } from './i18n.js';
import * as CONST from './constants.js';

// === MODAL SYSTEM ===
const Modal = {
    el: document.getElementById('modal-layer'),
    title: document.getElementById('modal-title'),
    body: document.getElementById('modal-body'),
    actions: document.getElementById('modal-actions'),
    resolve: null,
    previousFocus: null,
    show(opts) {
        return new Promise((resolve) => {
            this.previousFocus = document.activeElement;
            // Null checks for modal elements
            if (!this.el || !this.title || !this.body || !this.actions) {
                Logger.error('Modal elements not found in DOM');
                // Fallback to native alert/confirm
                if (opts.type === 'confirm') {
                    resolve(confirm(opts.text || opts.title || 'Confirm?'));
                } else {
                    alert(opts.text || opts.title || 'Notice');
                    resolve(true);
                }
                return;
            }

            this.resolve = resolve;
            this.title.innerText = opts.title || 'Notice';
            this.body.innerText = opts.text || '';
            this.actions.innerHTML = '';
            if (opts.type === 'confirm') {
                const cancel = document.createElement('button');
                cancel.className = 'btn-modal btn-ghost';
                cancel.innerText = 'Cancel';
                cancel.setAttribute('aria-label', 'Cancel and close dialog');
                cancel.onclick = () => this.close(false);
                this.actions.appendChild(cancel);
            }
            const ok = document.createElement('button');
            ok.className = opts.danger ? 'btn-modal btn-danger' : 'btn-modal btn-confirm';
            ok.innerText = opts.okText || 'OK';
            ok.setAttribute('aria-label', opts.okText ? `${opts.okText} and close dialog` : 'Confirm and close dialog');
            ok.onclick = () => this.close(true);
            this.actions.appendChild(ok);
            this.el.classList.add('active');
            this.el.setAttribute('aria-hidden', 'false');
            ok.focus(); // Move focus into modal for accessibility
        });
    },
    close(res) {
        if (!this.el) {
            Logger.error('Modal element not found');
            if (this.resolve) this.resolve(res);
            if (this.previousFocus) this.previousFocus.focus();
            return;
        }
        this.el.classList.remove('active');
        this.el.setAttribute('aria-hidden', 'true');
        if (this.resolve) this.resolve(res);
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = null;
        }
    }
};

// === PRE-OPTIMIZATION ===
function preSanitizeConfig() {
    try {
        const sanitize = (obj) => {
            if (obj.video) obj.video = Sanitizer.sanitizeURL(obj.video);
            if (obj.altLinks) {
                for (const key in obj.altLinks) {
                    if (Object.prototype.hasOwnProperty.call(obj.altLinks, key)) {
                        obj.altLinks[key] = Sanitizer.sanitizeURL(obj.altLinks[key]);
                    }
                }
            }
        };

        EXERCISES.forEach(sanitize);
        WARMUP.forEach(sanitize);
        DECOMPRESSION.forEach(sanitize);
        CARDIO_OPTIONS.forEach(sanitize);

        Logger.info('Static configuration URLs pre-sanitized');
    } catch (e) {
        Logger.error('Failed to pre-sanitize config', { error: e.message });
    }
}

// === STATE & TOOLS ===
const State = { view: 'today', phase: null, recovery: null, activeSession: null, historyLimit: CONST.HISTORY_PAGINATION_LIMIT };
let _navCache = null;
let _lastNavView = null;
// Optimization: Cache generated session cards to avoid repeated string generation/sanitization
const _sessionCardCache = new WeakMap();
const Haptics = {
    success: () => navigator.vibrate?.([10, 30, 10]),
    light: () => navigator.vibrate?.(10),
    heavy: () => navigator.vibrate?.(50)
};

const Timer = {
    interval: null, endTime: null,
    start(sec = CONST.DEFAULT_REST_TIMER_SECONDS) {
        if (this.interval) clearInterval(this.interval);
        this.endTime = Date.now() + (sec * 1000);
        const timerDock = document.getElementById('timer-dock');
        if (!timerDock) {
            Logger.error('Timer dock element not found');
            return;
        }
        timerDock.classList.add('active');
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    },
    tick() {
        const rem = Math.ceil((this.endTime - Date.now()) / 1000);
        if (rem <= 0) {
            this.stop();
            Haptics.success();
            ScreenReader.announce('Rest period complete. Ready for next set.');
            return;
        }
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        const timerVal = document.getElementById('timer-val');
        if (!timerVal) {
            Logger.error('Timer value element not found');
            this.stop();
            return;
        }
        timerVal.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    },
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.endTime = null;

        const timerVal = document.getElementById('timer-val');
        if (timerVal) {
            const m = Math.floor(CONST.DEFAULT_REST_TIMER_SECONDS / 60);
            const s = CONST.DEFAULT_REST_TIMER_SECONDS % 60;
            timerVal.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        }

        const timerDock = document.getElementById('timer-dock');
        if (timerDock) timerDock.classList.remove('active');
    }
};

// === RENDER ROUTER ===
function render() {
    try {
        const main = document.getElementById('main-content');
        if (!main) {
            Logger.error('Main content element not found');
            return;
        }

        // Update active tab state
        if (_lastNavView !== State.view) {
            if (!_navCache) {
                _navCache = document.querySelectorAll('.nav-item');
            }
            _navCache.forEach(el => {
                const isActive = el.dataset.view === State.view;
                el.classList.toggle('active', isActive);
                if (isActive) el.setAttribute('aria-current', 'page');
                else el.removeAttribute('aria-current');
            });
            _lastNavView = State.view;
        }

        main.innerHTML = '';
        main.className = 'fade-in';

        switch (State.view) {
            case 'today': renderToday(main); break;
            case 'history': renderHistory(main); break;
            case 'progress': renderProgress(main); break;
            case 'settings': renderSettings(main); break;
            case 'protocol': renderProtocol(main); break;
            default:
                Logger.warn(`Unknown view: ${State.view}`);
                renderToday(main);
        }

        // Accessibility: Move focus to main content on view change
        // This ensures screen readers announce the new content and keyboard users aren't lost
        main.focus();
    } catch (e) {
        Logger.error('Render error:', e);
        // Try to show error to user
        const main = document.getElementById('main-content');
        if (main) {
            main.innerHTML = `
                <div class="container">
                    <div class="card" style="border-color:var(--error)">
                        <h3>⚠️ Something went wrong</h3>
                        <p class="text-xs">Please refresh the page. If the problem persists, try exporting your data and clearing the app cache.</p>
                    </div>
                </div>`;
        }
    }
}

// === VIEWS ===
function renderToday(c) {
    if (!State.recovery) renderRecovery(c);
    else if (State.phase === 'warmup') renderWarmup(c);
    else if (State.phase === 'lifting') renderLifting(c);
    else if (State.phase === 'cardio') renderCardio(c);
    else renderDecompress(c);
}

function renderRecovery(c) {
    const check = Validator.canStartWorkout();
    if (!check.valid && !State.forceRestSkip) {
        const nextDate = check.nextAvailable ? DateFormatter.format(check.nextAvailable) : '';
        c.innerHTML = `
            <div class="container">
                <h1>⏸️ ${I18n.t('recovery.restRequired')}</h1>
                <div class="card">
                    <h3>${I18n.t('recovery.restDesc')}</h3>
                    <p style="margin-top:1rem; color:var(--text-secondary)">
                        <strong style="color:var(--accent)">${check.hours} hours</strong> remaining
                    </p>
                    ${nextDate ? `<p class="text-xs" style="margin-top:0.5rem">${I18n.t('recovery.nextWorkout', { date: nextDate })}</p>` : ''}
                    <p class="text-xs" style="margin-top:1rem; opacity:0.7">${I18n.t('recovery.restTip')}</p>
                </div>
                <button class="btn btn-secondary" onclick="window.skipRest()" aria-label="Override rest requirement and train anyway">${I18n.t('recovery.trainAnyway')}</button>
            </div>`;
        return;
    }
    c.innerHTML = `
        <div class="container">
            <h1>${I18n.t('recovery.title')}</h1>
            <p class="text-xs" style="margin-bottom:1rem; text-align:center; opacity:0.8">${I18n.t('recovery.subtitle')}</p>
            ${check.isFirst ? `
                <div class="card" style="border-color:var(--accent)">
                    <h3>🎯 ${I18n.t('recovery.calibration')}</h3>
                    <p class="text-xs">${I18n.t('recovery.calibrationDesc')}</p>
                </div>` : ''}
            ${check.warning ? `
                <div class="card" style="border-color:var(--warning)">
                    <h3>⚠️ ${I18n.t('recovery.longGap')}</h3>
                    <p class="text-xs">${I18n.t('recovery.longGapDesc', { days: check.days })}</p>
                </div>` : ''}
            <button type="button" class="card" onclick="window.setRec('green')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--success)">✓ ${I18n.t('recovery.green')}</h3>
                <p class="text-xs">${I18n.t('recovery.greenDesc')}</p>
            </button>
            <button type="button" class="card" onclick="window.setRec('yellow')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--warning)">⚠ ${I18n.t('recovery.yellow')}</h3>
                <p class="text-xs">${I18n.t('recovery.yellowDesc')}</p>
            </button>
            <button type="button" class="card" onclick="window.setRec('red')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--error)">✕ ${I18n.t('recovery.red')}</h3>
                <p class="text-xs">${I18n.t('recovery.redDesc')}</p>
            </button>
        </div>`;
}

function renderWarmup(c) {
    let warmupHtml = '';
    // Optimization: Create Map for O(1) lookup
    const activeMap = new Map();
    if (State.activeSession?.warmup) {
        for (const w of State.activeSession.warmup) {
            activeMap.set(w.id, w);
        }
    }

    for (let i = 0; i < WARMUP.length; i++) {
        const w = WARMUP[i];
        const activeW = activeMap.get(w.id);
        const isChecked = activeW ? activeW.completed : false;
        const altUsed = activeW ? activeW.altUsed : '';
        const displayName = Sanitizer.sanitizeString(altUsed || w.name);
        const vidUrl = altUsed && w.altLinks?.[altUsed] ? w.altLinks[altUsed] : w.video;

        let optionsHtml = '';
        for (let j = 0; j < w.alternatives.length; j++) {
            const a = w.alternatives[j];
            optionsHtml += `<option value="${a}" ${altUsed === a ? 'selected' : ''}>${a}</option>`;
        }

        warmupHtml += `
            <div style="margin-bottom:1.5rem; border-bottom:1px solid #333; padding-bottom:1rem;">
                <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                    <label class="checkbox-wrapper" style="margin:0; padding:0; background:none; border:none; width:auto; cursor:pointer" for="w-${w.id}">
                        <input type="checkbox" class="big-check" id="w-${w.id}" ${isChecked ? 'checked' : ''} onchange="window.updateWarmup('${w.id}')">
                        <div><div id="name-${w.id}">${displayName}</div><div class="text-xs">${w.reps}</div></div>
                    </label>
                    <a id="vid-${w.id}" href="${vidUrl}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none; padding-left:1rem;" aria-label="Watch video for ${displayName}">🎥</a>
                </div>
                <details><summary class="text-xs" style="opacity:0.7; cursor:pointer">Alternatives</summary>
                    <select id="alt-${w.id}" onchange="window.swapAlt('${w.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);" aria-label="Select alternative for ${w.name}">
                        <option value="">${w.name}</option>
                        ${optionsHtml}
                    </select>
                </details>
            </div>`;
    }

    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:1rem;">
                <h1>${I18n.t('workout.warmup')}</h1>
                <span class="text-xs" style="opacity:0.8">${I18n.t('workout.warmupSubtitle')}</span>
            </div>
            <div class="card">
                ${warmupHtml}
            </div>
            <button class="btn btn-primary" onclick="window.nextPhase('lifting')" aria-label="${I18n.t('workout.startLifting')}">${I18n.t('workout.startLifting')}</button>
        </div>`;
}

function renderLifting(c) {
    const sessions = Storage.getSessions();
    const isDeload = Calculator.isDeloadWeek(sessions);
    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                <h1>${I18n.t('workout.lifting')}</h1>
                <div class="flex-row" style="gap:0.5rem">
                    ${isDeload ? `<span class="text-xs" style="border:1px solid var(--accent); color:var(--accent); padding:0.25rem 0.5rem; border-radius:0.75rem">${I18n.t('workout.deload')}</span>` : ''}
                    <span class="text-xs" style="border:1px solid var(--border); padding:0.25rem 0.5rem; border-radius:0.75rem">${State.recovery.toUpperCase()}</span>
                </div>
            </div>
            <p class="text-xs" style="margin-bottom:1.5rem; text-align:center; opacity:0.8">${I18n.t('workout.tempo')}</p>
            ${(() => {
                let exercisesHtml = '';
                // Optimization: Create Map for O(1) lookup
                const activeMap = new Map();
                if (State.activeSession?.exercises) {
                    for (const e of State.activeSession.exercises) {
                        activeMap.set(e.id, e);
                    }
                }

                for (let j = 0; j < EXERCISES.length; j++) {
                    const ex = EXERCISES[j];
                    // Check state first for persistence
                    const activeEx = activeMap.get(ex.id);
                    const hasAlt = activeEx?.usingAlternative;
                    const name = Sanitizer.sanitizeString(hasAlt ? activeEx.altName : ex.name);
                    const vid = hasAlt && ex.altLinks?.[activeEx.altName] ? ex.altLinks[activeEx.altName] : ex.video;

                    const w = activeEx ? activeEx.weight : Calculator.getRecommendedWeight(ex.id, State.recovery, sessions);
                    // Name Display Fix: Pass actual name (alternative if used) for history lookup
                    const lookupName = hasAlt ? activeEx.altName : ex.id;
                    const last = Calculator.getLastCompletedExercise(lookupName, sessions);
                    const lastText = last ? I18n.t('exercise.last', { weight: last.weight }) : I18n.t('exercise.firstSession');

                    // Optimization: Use for loop to avoid garbage collection pressure from Array.from
                    let setButtonsHtml = '';
                    for (let i = 0; i < ex.sets; i++) {
                        const isSetDone = activeEx && i < activeEx.setsCompleted;
                        const completedClass = isSetDone ? ' completed' : '';
                        const ariaPressed = isSetDone ? 'true' : 'false';
                        setButtonsHtml += `<button type="button" class="set-btn${completedClass}" id="s-${ex.id}-${i}" onclick="window.togS('${ex.id}',${i},${ex.sets})" aria-label="${I18n.t('a11y.set', { number: i+1 })}" aria-pressed="${ariaPressed}">${i+1}</button>`;
                    }

                    exercisesHtml += `
                <div class="card" id="card-${ex.id}">
                    <div class="flex-row" style="justify-content:space-between; margin-bottom:0.25rem;">
                        <div>
                            <div class="text-xs" style="color:var(--accent)">${ex.category}</div>
                            <h2 id="name-${ex.id}" style="margin-bottom:0">${name}</h2>
                            <div class="text-xs" style="opacity:0.8; margin-bottom:0.25rem">${ex.sets} sets × ${ex.reps} reps</div>
                            <div id="last-${ex.id}" class="text-xs" style="opacity:0.6; margin-bottom:0.5rem">${lastText}</div>
                        </div>
                        <a id="vid-${ex.id}" href="${vid}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${name}">🎥</a>
                    </div>
                    <div class="stepper-control">
                        <button class="stepper-btn" onclick="window.modW('${ex.id}', -2.5)" aria-label="${I18n.t('a11y.decreaseWeight')} for ${name}">−</button>
                        <input type="number" class="stepper-value" id="w-${ex.id}" value="${w}" step="2.5" readonly inputmode="none" aria-label="${I18n.t('a11y.weightPounds')} for ${name}">
                        <button class="stepper-btn" onclick="window.modW('${ex.id}', 2.5)" aria-label="${I18n.t('a11y.increaseWeight')} for ${name}">+</button>
                    </div>
                    <div id="pl-${ex.id}" class="text-xs" style="text-align:center; font-family:monospace; margin:0.5rem 0 1rem 0; color:var(--text-secondary)" aria-live="polite">${Calculator.getPlateLoad(w)} ${I18n.t('exercise.perSide')}</div>
                    <div class="set-group" role="group" aria-label="Sets for ${name}">
                        ${setButtonsHtml}
                    </div>
                    <details class="mt-4" style="margin-top:1rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                        <summary class="text-xs">${I18n.t('exercise.alternatives')}</summary>
                        <select id="alt-${ex.id}" onchange="window.swapAlt('${ex.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none" aria-label="Select alternative for ${ex.name}">
                            <option value="">${ex.name}</option>
                            ${ex.alternatives.map(a=>`<option value="${a}" ${hasAlt && activeEx.altName === a ? 'selected' : ''}>${a}</option>`).join('')}
                        </select>
                    </details>
                </div>`;
                }
                return exercisesHtml;
            })()}
            <button class="btn btn-primary" onclick="window.nextPhase('cardio')" aria-label="${I18n.t('workout.nextCardio')}">${I18n.t('workout.nextCardio')}</button>
        </div>`;
}

function renderCardio(c) {
    const activeCardio = State.activeSession?.cardio;
    const selectedType = activeCardio ? activeCardio.type : CARDIO_OPTIONS[0].name;
    const isCompleted = activeCardio ? activeCardio.completed : false;
    const cfg = CARDIO_OPTIONS.find(o => o.name === selectedType) || CARDIO_OPTIONS[0];

    c.innerHTML = `
        <div class="container"><h1>${I18n.t('workout.cardio')}</h1><div class="card">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;"><h3>${I18n.t('exercise.selection')}</h3><a id="cardio-vid" href="${cfg.video}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${cfg.name}">🎥</a></div>
            <div class="text-xs" style="opacity:0.8; margin-bottom:1rem">${I18n.t('workout.cardioSubtitle')}</div>
            <select id="cardio-type" onchange="window.swapCardioLink(); window.updateCardio()" style="width:100%; padding:1rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem;" aria-label="Select cardio type">${CARDIO_OPTIONS.map(o=>`<option value="${o.name}" ${o.name === selectedType ? 'selected' : ''}>${o.name}</option>`).join('')}</select>
            <button class="btn btn-secondary" onclick="window.startCardio()" aria-label="${I18n.t('exercise.startTimer')}">${I18n.t('exercise.startTimer')}</button>
            <label class="checkbox-wrapper" style="margin-top:1rem; cursor:pointer" for="cardio-done"><input type="checkbox" class="big-check" id="cardio-done" ${isCompleted ? 'checked' : ''} onchange="window.updateCardio()"><span>${I18n.t('exercise.completed')}</span></label>
        </div><button class="btn btn-primary" onclick="window.nextPhase('decompress')" aria-label="${I18n.t('workout.nextDecompress')}">${I18n.t('workout.nextDecompress')}</button></div>`;
}

function renderDecompress(c) {
    let decompressHtml = '';
    // Optimization: Create Map for O(1) lookup
    const activeMap = new Map();
    if (State.activeSession?.decompress) {
        for (const d of State.activeSession.decompress) {
            activeMap.set(d.id, d);
        }
    }

    for (let i = 0; i < DECOMPRESSION.length; i++) {
        const d = DECOMPRESSION[i];
        const activeD = activeMap.get(d.id);
        const isChecked = activeD ? activeD.completed : false;
        const val = activeD ? activeD.val : '';
        const safeVal = Sanitizer.sanitizeString(String(val || ''));
        const altUsed = activeD ? activeD.altUsed : '';
        const displayName = Sanitizer.sanitizeString(altUsed || d.name);
        const vidUrl = altUsed && d.altLinks?.[altUsed] ? d.altLinks[altUsed] : d.video;

        let optionsHtml = '';
        for (let j = 0; j < d.alternatives.length; j++) {
            const a = d.alternatives[j];
            optionsHtml += `<option value="${a}" ${altUsed === a ? 'selected' : ''}>${a}</option>`;
        }

        decompressHtml += `
            <div class="card">
                <div class="flex-row" style="justify-content:space-between; margin-bottom:0.25rem;">
                    <h3 id="name-${d.id}">${displayName}</h3>
                    <a id="vid-${d.id}" href="${vidUrl}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${displayName}">🎥</a>
                </div>
                <div class="text-xs" style="opacity:0.8; margin-bottom:0.75rem">${d.duration}</div>
                    ${d.inputLabel ? `<input type="number" id="val-${d.id}" value="${safeVal}" placeholder="${d.inputLabel}" aria-label="${d.inputLabel} for ${d.name}" style="width:100%; padding:1rem; background:var(--bg-secondary); border:none; color:white; margin-bottom:0.5rem" onchange="window.updateDecompress('${d.id}')">` : ''}
                <label class="checkbox-wrapper" style="cursor:pointer" for="done-${d.id}"><input type="checkbox" class="big-check" id="done-${d.id}" ${isChecked ? 'checked' : ''} onchange="window.updateDecompress('${d.id}')"><span>${I18n.t('exercise.completed')}</span></label>
                <details style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                    <summary class="text-xs" style="opacity:0.7; cursor:pointer">${I18n.t('exercise.alternatives')}</summary>
                    <select id="alt-${d.id}" onchange="window.swapAlt('${d.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);" aria-label="Select alternative for ${d.name}">
                        <option value="">Default</option>
                        ${optionsHtml}
                    </select>
                </details>
            </div>`;
    }

    c.innerHTML = `
        <div class="container"><h1>${I18n.t('workout.decompress')}</h1>
            ${decompressHtml}
            <button class="btn btn-primary" onclick="window.finish()" aria-label="${I18n.t('workout.saveFinish')}">${I18n.t('workout.saveFinish')}</button>
        </div>`;
}

function _generateSessionCard(x) {
    // Optimization: Return cached HTML if available for this session object
    if (_sessionCardCache.has(x)) {
        return _sessionCardCache.get(x);
    }

    let warmupHtml = I18n.t('history.noData');
    if (x.warmup) {
        warmupHtml = '';
        for (let j = 0; j < x.warmup.length; j++) {
            const w = x.warmup[j];
            if (w.completed) {
                warmupHtml += `✓ ${Sanitizer.sanitizeString(w.altUsed || w.id)} `;
            }
        }
    }

    let exercisesHtml = '';
    for (let j = 0; j < x.exercises.length; j++) {
        const e = x.exercises[j];
        const rawName = e.altName || e.name || EXERCISE_MAP.get(e.id)?.name || e.id;
        const displayName = Sanitizer.sanitizeString(rawName);
        exercisesHtml += `<div class="flex-row" style="justify-content:space-between; font-size:0.85rem; margin-bottom:0.25rem; ${e.skipped ? 'opacity:0.5; text-decoration:line-through' : ''}"><span>${displayName}</span><span>${e.weight} lbs</span></div>`;
    }

    const decompressStatus = Array.isArray(x.decompress) ?
        (x.decompress.every(d => d.completed) ? I18n.t('history.fullSession') : I18n.t('history.partial')) :
        (x.decompress?.completed ? I18n.t('exercise.completed') : I18n.t('exercise.skip'));

    const html = `
<div class="card">
    <div class="flex-row" style="justify-content:space-between">
        <div><h3>${DateFormatter.format(x.date)}</h3><span class="text-xs" style="border:1px solid var(--border); padding:0.125rem 0.375rem; border-radius:var(--radius-sm)">${Sanitizer.sanitizeString(x.recoveryStatus).toUpperCase()}</span></div>
        <button class="btn btn-secondary btn-delete-session" style="width:44px; height:44px; padding:0; display:flex; align-items:center; justify-content:center; flex-shrink:0" data-session-id="${x.id}" aria-label="Delete session from ${DateFormatter.format(x.date)}">✕</button>
    </div>
    <details style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.5rem;">
        <summary class="text-xs" style="cursor:pointer; padding:0.5rem 0; opacity:0.8">${I18n.t('history.viewDetails')}</summary>
        <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">${I18n.t('history.warmup')}</div>
        <div class="text-xs" style="margin-bottom:1rem; line-height:1.4">${warmupHtml}</div>
        <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">${I18n.t('history.lifting')}</div>
        ${exercisesHtml}
        <div class="text-xs" style="margin:1rem 0 0.5rem 0; color:var(--accent)">${I18n.t('history.finisher')}</div>
        <div class="text-xs">
            ${I18n.t('workout.cardio')}: ${Sanitizer.sanitizeString(x.cardio?.type || 'N/A')}<br>
            ${I18n.t('workout.decompress')}: ${decompressStatus}
        </div>
    </details>
</div>`;

    _sessionCardCache.set(x, html);
    return html;
}

function renderHistory(c) {
    // Optimization: Iterating backwards avoids O(N) copy & reverse of entire history array
    const sessions = Storage.getSessions();
    const limit = State.historyLimit || CONST.HISTORY_PAGINATION_LIMIT;

    let historyHtml = '';
    if (sessions.length === 0) {
        historyHtml = `<div class="card"><p>${I18n.t('history.noLogs')}</p></div>`;
    } else {
        // Iterate backwards from end
        let count = 0;
        for (let i = sessions.length - 1; i >= 0 && count < limit; i--) {
            historyHtml += _generateSessionCard(sessions[i]);
            count++;
        }
    }

    c.innerHTML = `<div class="container"><h1>${I18n.t('history.title')}</h1>
        <div id="history-list">${historyHtml}</div>
        ${limit < sessions.length ? `<button id="load-more-btn" class="btn btn-secondary" style="width:100%; margin-top:1rem; padding:1rem">${I18n.t('history.loadMore', { remaining: sessions.length - limit })}</button>` : ''}
        </div>`;

    const loadMoreBtn = c.querySelector('#load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', window.loadMoreHistory);
    }
}

function renderProgress(c) {
    c.innerHTML = `<div class="container"><h1>${I18n.t('progress.title')}</h1><div class="card"><select id="chart-ex" onchange="window.drawChart(this.value)" aria-label="Select exercise for progress chart" style="width:100%; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem; border-radius:var(--radius-sm);">${EXERCISES.map(e=>`<option value="${e.id}">${Sanitizer.sanitizeString(e.name)}</option>`).join('')}</select><div id="chart-area" style="min-height:250px"></div></div></div>`;
    setTimeout(()=>window.drawChart('hinge'),100);
}

function renderSettings(c) {
    c.innerHTML = `
        <div class="container">
            <h1>${I18n.t('settings.title')}</h1>
            <div class="card">
                <button class="btn btn-secondary" onclick="window.viewProtocol()" aria-label="${I18n.t('settings.protocolGuide')}">${I18n.t('settings.protocolGuide')}</button>
            </div>
            <div class="card">
                <button class="btn btn-secondary" id="backup-btn">${I18n.t('settings.backupData')}</button>
                <div style="position:relative; margin-top:0.5rem">
                    <button class="btn btn-secondary" tabindex="-1" aria-hidden="true">${I18n.t('settings.restoreData')}</button>
                    <input type="file" onchange="window.imp(this)" aria-label="${I18n.t('settings.restoreData')}"
                           onfocus="this.previousElementSibling.style.outline='2px solid var(--accent)';this.previousElementSibling.style.outlineOffset='2px'"
                           onblur="this.previousElementSibling.style.outline=''"
                           style="position:absolute;top:0;left:0;opacity:0;width:100%;height:100%">
                </div>
                <button class="btn btn-secondary" style="margin-top:0.5rem; color:var(--error)" onclick="window.wipe()" aria-label="${I18n.t('settings.factoryReset')}">${I18n.t('settings.factoryReset')}</button>
            </div>
            <div class="text-xs" style="text-align:center; margin-top:2rem; opacity:0.5">
                v${CONST.APP_VERSION} (${CONST.STORAGE_VERSION})
            </div>
        </div>`;

    const usage = Storage.getUsage();
    const storageHtml = `
        <div class="card">
            <h3>${I18n.t('settings.storage')}</h3>
            <p class="text-xs" style="margin-bottom:0.5rem">${I18n.t('settings.storageUsage', {
                percent: usage.percent.toFixed(1),
                used: (usage.bytes / 1024).toFixed(0) + 'KB',
                total: (usage.limit / 1024 / 1024).toFixed(0) + 'MB'
            })}</p>
            <div style="width:100%; height:8px; background:var(--bg-secondary); border-radius:4px; overflow:hidden">
                <div style="width:${usage.percent}%; height:100%; background:${usage.percent > 90 ? 'var(--error)' : 'var(--accent)'}"></div>
            </div>
        </div>`;

    // Insert storage card before backup card
    const container = c.querySelector('.container');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = storageHtml;
    // Find the backup card (2nd card)
    const cards = container.querySelectorAll('.card');
    if (cards.length > 1) {
        container.insertBefore(tempDiv.firstElementChild, cards[1]);
    } else {
        container.appendChild(tempDiv.firstElementChild);
    }

    const backupBtn = c.querySelector('#backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            try {
                Storage.exportData();
            } catch(e) {
                Modal.show({ title: I18n.t('errors.exportFailed'), text: e.message });
            }
        });
    }
}

function renderProtocol(c) {
    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="margin-bottom:1rem">
                <button class="btn btn-secondary" style="width:auto; padding:0.5rem 1rem" onclick="window.closeProtocol()" aria-label="${I18n.t('protocol.back')}">${I18n.t('protocol.back')}</button>
            </div>
            <h1>${I18n.t('protocol.title')}</h1>
            <div class="card">
                <h3 style="color:var(--accent)">${I18n.t('protocol.hygiene')}</h3>
                <p class="text-xs" style="margin-bottom:1rem">${I18n.t('protocol.hygieneDesc')}</p>

                <h3 style="color:var(--accent)">${I18n.t('protocol.overview')}</h3>
                <ul class="text-xs" style="padding-left:1.2rem; line-height:1.6">
                    <li><strong>Schedule:</strong> 3 days/week (e.g., Mon/Wed/Fri)</li>
                    <li><strong>Time:</strong> 58 Minutes</li>
                    <li><strong>Spacing:</strong> 48–72 hours rest required</li>
                </ul>
            </div>

            <div class="card">
                <h3 style="color:var(--warning)">${I18n.t('protocol.faultTolerance')}</h3>
                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:0.5rem; font-size:0.8rem; margin-top:0.5rem">
                    <div>Missed 1</div><div>Slide schedule (maintain 48h gap)</div>
                    <div>Missed 2+</div><div>Reduce weights 10%</div>
                    <div>Sick (Fever)</div><div>FULL REST. Resume 24h after fever. Reduce 20%.</div>
                    <div>Injury</div><div>Skip aggravating exercise. Do others.</div>
                </div>
            </div>

            <div class="card" style="border-color:var(--error)">
                <h3>🚨 ${I18n.t('protocol.gymClosed')}</h3>
                <p class="text-xs" style="margin-bottom:0.5rem">${I18n.t('protocol.emergencyCircuit')}</p>
                <ul class="text-xs" style="padding-left:1.2rem; line-height:1.6">
                    <li><strong>Push:</strong> Incline Push-ups (Hands on furniture)</li>
                    <li><strong>Legs:</strong> Bodyweight Squats (Tempo: 3s down)</li>
                    <li><strong>Pull:</strong> Inverted Rows (Table) OR Door Rows</li>
                    <li><strong>Core:</strong> Hardstyle Plank</li>
                </ul>
            </div>
        </div>`;
}

// === HANDLERS ===
window.updateWarmup = (id) => {
    try {
        const el = document.getElementById(`w-${id}`);
        if (!el) return;

        if (State.activeSession && State.activeSession.warmup) {
            const w = State.activeSession.warmup.find(x => x.id === id);
            if (w) {
                w.completed = el.checked;
                Storage.saveDraft(State.activeSession);
            }
        }
    } catch (e) {
        Logger.error('Error updating warmup:', e);
    }
};

window.updateCardio = () => {
    try {
        const typeEl = document.getElementById('cardio-type');
        const doneEl = document.getElementById('cardio-done');

        if (State.activeSession && State.activeSession.cardio) {
            if (typeEl) State.activeSession.cardio.type = typeEl.value;
            if (doneEl) State.activeSession.cardio.completed = doneEl.checked;
            Storage.saveDraft(State.activeSession);
        }
    } catch (e) {
        Logger.error('Error updating cardio:', e);
    }
};

window.updateDecompress = (id) => {
    try {
        const valEl = document.getElementById(`val-${id}`);
        const doneEl = document.getElementById(`done-${id}`);

        if (State.activeSession && State.activeSession.decompress) {
            const d = State.activeSession.decompress.find(x => x.id === id);
            if (d) {
                if (valEl) d.val = valEl.value;
                if (doneEl) d.completed = doneEl.checked;
                Storage.saveDraft(State.activeSession);
            }
        }
    } catch (e) {
        Logger.error('Error updating decompress:', e);
    }
};

window.setRec = async (r) => {
    Metrics.mark('recovery-select-start');

    if (r === 'red') {
        Logger.info('Red recovery selected - confirming override', { recovery: r });
        ScreenReader.announce(I18n.t('modal.lowRecovery'));
        const proceed = await Modal.show({
            type: 'confirm',
            title: I18n.t('modal.lowRecovery'),
            text: I18n.t('modal.restWarning'),
            danger: true,
            okText: I18n.t('modal.trainAnyway')
        });
        if (!proceed) {
            Analytics.track('recovery_selected', { status: 'red', action: 'skipped' });
            return;
        }
        Analytics.track('recovery_selected', { status: 'red', action: 'override' });
        Logger.warn('Red recovery override - user chose to train anyway', { recovery: r });
    }

    State.recovery = r;
    State.activeSession = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        recoveryStatus: r,
        exercises: [],
        warmup: WARMUP.map(w => ({ id: w.id, completed: false, altUsed: '' }))
    };
    State.phase = 'warmup';

    Logger.info('Workout started', { recovery: r, sessionId: State.activeSession.id });
    Analytics.track('recovery_selected', { status: r });

    // Announce recovery selection
    const recoveryText = r === 'green' ? I18n.t('recovery.green') : (r === 'yellow' ? I18n.t('recovery.yellow') : I18n.t('recovery.red'));
    ScreenReader.announce(`${recoveryText} selected. Starting warmup.`);

    Haptics.success(); // Tactile feedback for start
    Metrics.measure('recovery-select', 'recovery-select-start');
    render();
};
window.modW = (id, d) => {
    try {
        const el = document.getElementById(`w-${id}`);
        if (!el) {
            Logger.error(`Weight input not found: w-${id}`);
            return;
        }
        const currentValue = parseFloat(el.value) || 0;
        const newValue = Math.max(0, currentValue + d);
        el.value = newValue;

        // Persistence: Update active session state
        const activeEx = State.activeSession?.exercises?.find(e => e.id === id);
        if (activeEx) activeEx.weight = newValue;

        // Palette: Update plate math display in real-time
        const plateEl = document.getElementById(`pl-${id}`);
        if (plateEl) {
            plateEl.textContent = `${Calculator.getPlateLoad(newValue)} / side`;
        }

        if (State.activeSession) Storage.saveDraft(State.activeSession);
        Haptics.light();
    } catch (e) {
        Logger.error('Error modifying weight:', e);
    }
};

window.togS = (ex, i, max) => {
    try {
        const el = document.getElementById(`s-${ex}-${i}`);
        if (!el) {
            Logger.error(`Set button not found: s-${ex}-${i}`);
            return;
        }
        const isCompleted = el.classList.toggle('completed');
        el.setAttribute('aria-pressed', isCompleted);

        if(isCompleted) {
            Haptics.success();
            // Auto-start rest timer after every completed set (including last set)
            Timer.start();
        }

        // Persistence: Update active session state
        if (State.activeSession?.exercises) {
            const activeEx = State.activeSession.exercises.find(e => e.id === ex);
            if (activeEx) {
                const card = document.getElementById(`card-${ex}`);
                if (card) {
                    const sets = card.querySelectorAll('.set-btn.completed').length;
                    activeEx.setsCompleted = sets;
                    activeEx.completed = sets >= max;
                }
            }
            Storage.saveDraft(State.activeSession);
        }
    } catch (e) {
        Logger.error('Error toggling set:', e);
    }
};

window.swapAlt = (id) => {
    try {
        const selElement = document.getElementById(`alt-${id}`);
        if (!selElement) {
            Logger.error(`Alternative selector not found: alt-${id}`);
            return;
        }
        const sel = selElement.value;
        const cfg = EXERCISE_MAP.get(id) || WARMUP_MAP.get(id) || DECOMPRESSION_MAP.get(id);
        if (!cfg) {
            Logger.error(`Exercise config not found: ${id}`);
            return;
        }
        const vidElement = document.getElementById(`vid-${id}`);
        const nameElement = document.getElementById(`name-${id}`);

        if (vidElement) {
            vidElement.href = sel && cfg.altLinks[sel] ? cfg.altLinks[sel] : cfg.video;
            vidElement.rel = 'noopener noreferrer';
            vidElement.setAttribute('aria-label', `Watch video for ${sel || cfg.name}`);
        }
        if (nameElement) {
            nameElement.textContent = sel || cfg.name;
        }

        // Persist alternative choice to state immediately
        if (State.activeSession) {
            if (State.phase === 'lifting') {
                const ex = State.activeSession.exercises.find(e => e.id === id);
                if (ex) {
                    ex.usingAlternative = !!sel;
                    ex.altName = sel;

                    // Update recommended weight and stats for the new selection
                    const target = sel || ex.id;
                    const sessions = Storage.getSessions();

                    // Update weight in state
                    ex.weight = Calculator.getRecommendedWeight(target, State.recovery, sessions);

                    // Update UI elements
                    const inputEl = document.getElementById(`w-${id}`);
                    if (inputEl) inputEl.value = ex.weight;

                    const plateEl = document.getElementById(`pl-${id}`);
                    if (plateEl) plateEl.textContent = `${Calculator.getPlateLoad(ex.weight)} / side`;

                    const lastEl = document.getElementById(`last-${id}`);
                    if (lastEl) {
                        const last = Calculator.getLastCompletedExercise(target, sessions);
                        lastEl.textContent = last ? `Last: ${last.weight} lbs` : 'First Session';
                    }
                }
            } else if (State.phase === 'warmup') {
                const w = State.activeSession.warmup.find(e => e.id === id);
                if (w) w.altUsed = sel;
            } else if (State.phase === 'decompress') {
                const d = State.activeSession.decompress.find(e => e.id === id);
                if (d) d.altUsed = sel;
            }
            Storage.saveDraft(State.activeSession);
        }
    } catch (e) {
        Logger.error('Error swapping alternative:', e);
    }
};

window.swapCardioLink = () => {
    try {
        const cardioTypeElement = document.getElementById('cardio-type');
        if (!cardioTypeElement) {
            Logger.error('Cardio type selector not found');
            return;
        }
        const selName = cardioTypeElement.value;
        const cfg = CARDIO_OPTIONS.find(o => o.name === selName);
        if (cfg) {
            const vidElement = document.getElementById('cardio-vid');
            if (vidElement) {
                vidElement.href = cfg.video;
                vidElement.rel = 'noopener noreferrer';
                vidElement.setAttribute('aria-label', `Watch video for ${cfg.name}`);
            }
        }
    } catch (e) {
        Logger.error('Error swapping cardio link:', e);
    }
};

window.nextPhase = async (p) => {
    try {
        if(p === 'lifting') {
            State.activeSession.warmup = WARMUP.map(w => {
                const checkElement = document.getElementById(`w-${w.id}`);
                const altElement = document.getElementById(`alt-${w.id}`);
                return {
                    id: w.id,
                    completed: checkElement ? checkElement.checked : false,
                    altUsed: altElement ? altElement.value : ''
                };
            });

            // Initialize exercises with recommended weights for persistence
            const sessions = Storage.getSessions();
            State.activeSession.exercises = EXERCISES.map(ex => ({
                id: ex.id,
                name: ex.name,
                weight: Calculator.getRecommendedWeight(ex.id, State.recovery, sessions),
                setsCompleted: 0,
                completed: false,
                usingAlternative: false,
                skipped: false
            }));
        }

        if(p === 'cardio') {
            State.activeSession.exercises = EXERCISES.map(ex => {
                const weightElement = document.getElementById(`w-${ex.id}`);
                const w = weightElement ? (parseFloat(weightElement.value) || 0) : 0;
                const sets = document.querySelectorAll(`#card-${ex.id} .set-btn.completed`).length;
                const altElement = document.getElementById(`alt-${ex.id}`);
                const alt = altElement ? altElement.value : '';
                return {
                    id: ex.id,
                    name: ex.name,
                    weight: w,
                    setsCompleted: sets,
                    completed: sets === ex.sets,
                    usingAlternative: !!alt,
                    altName: alt
                };
            });
            if (!State.activeSession.cardio) {
                State.activeSession.cardio = { type: CARDIO_OPTIONS[0].name, completed: false };
            }
        }

        if(p === 'decompress') {
            const cardioTypeElement = document.getElementById('cardio-type');
            const cardioDoneElement = document.getElementById('cardio-done');
            State.activeSession.cardio = {
                type: cardioTypeElement ? cardioTypeElement.value : 'Unknown',
                completed: cardioDoneElement ? cardioDoneElement.checked : false
            };
            if (!State.activeSession.decompress) {
                State.activeSession.decompress = DECOMPRESSION.map(d => ({
                    id: d.id, val: null, completed: false, altUsed: ''
                }));
            }
        }

        State.phase = p;
        Logger.info('Phase transition', { from: State.phase, to: p });
        Analytics.track('phase_transition', { phase: p });

        const phaseNames = {
            warmup: I18n.t('workout.warmup'),
            lifting: I18n.t('workout.lifting'),
            cardio: I18n.t('workout.cardio'),
            decompress: I18n.t('workout.decompress')
        };
        ScreenReader.announce(`Starting ${phaseNames[p] || p} phase`);

        if (State.activeSession) Storage.saveDraft(State.activeSession);
        render();
    } catch (e) {
        Logger.error('Error transitioning phase', { phase: p, error: e.message });
        Logger.error('Error transitioning phase:', e);
        ScreenReader.announce(I18n.t('modal.saveError'), 'assertive');
        await Modal.show({ title: I18n.t('modal.error'), text: I18n.t('modal.saveError') });
    }
};
window.finish = async () => {
    try {
        if(!await Modal.show({ type: 'confirm', title: I18n.t('modal.finish'), text: I18n.t('modal.saveSession') })) return;

        State.activeSession.decompress = DECOMPRESSION.map(d => {
            const valElement = document.getElementById(`val-${d.id}`);
            const doneElement = document.getElementById(`done-${d.id}`);
            const altElement = document.getElementById(`alt-${d.id}`);
            return {
                id: d.id,
                val: valElement?.value || null,
                completed: doneElement ? doneElement.checked : false,
                altUsed: altElement ? altElement.value : ''
            };
        });

        Metrics.mark('session-save-start');
        const savedSession = Storage.saveSession(State.activeSession);

        Logger.info('Session completed', {
            sessionId: savedSession.id,
            sessionNumber: savedSession.sessionNumber,
            totalVolume: savedSession.totalVolume,
            recovery: savedSession.recoveryStatus
        });

        Analytics.track('session_completed', {
            sessionNumber: savedSession.sessionNumber,
            weekNumber: savedSession.weekNumber,
            recovery: savedSession.recoveryStatus,
            exercises: savedSession.exercises.length
        });

        const saveTime = Metrics.measure('session-save', 'session-save-start');
        Logger.debug('Session save performance', { duration: `${saveTime?.toFixed(2)}ms` });

        ScreenReader.announce(`Workout completed successfully. Session ${savedSession.sessionNumber} saved.`, 'assertive');

        // Ensure no intra-set timer keeps running after session completion
        Timer.stop();

        Haptics.success(); // Tactile feedback for completion
        State.view = 'history';
        State.phase = null;
        State.recovery = null;
        render();
    } catch (e) {
        Logger.error('Failed to save session', {
            sessionId: State.activeSession?.id,
            error: e.message
        });
        Logger.error('Error finishing session:', e);

        if (e.message === 'STORAGE_FULL') {
            ScreenReader.announce(I18n.t('errors.storageFull'), 'assertive');
            await Modal.show({ title: I18n.t('modal.error'), text: I18n.t('errors.storageFull') });
            return;
        }

        ScreenReader.announce(I18n.t('errors.saveFailed'), 'assertive');
        await Modal.show({ title: I18n.t('modal.error'), text: I18n.t('errors.saveFailed') });
    }
};
window.skipTimer = () => { Haptics.heavy(); Timer.stop(); };
window.skipRest = () => {
    State.forceRestSkip = true;
    render();
};
window.startCardio = () => Timer.start(CONST.CARDIO_TIMER_SECONDS);
window.loadMoreHistory = () => {
    try {
        const currentLimit = State.historyLimit || CONST.HISTORY_PAGINATION_LIMIT;
        const newLimit = currentLimit + CONST.HISTORY_PAGINATION_LIMIT;
        const sessions = Storage.getSessions();
        const historyList = document.getElementById('history-list');

        if (!historyList) {
            // Fallback if structure is missing
            Logger.warn('History list container not found, falling back to full render');
            State.historyLimit = newLimit;
            render();
            return;
        }

        // Optimization: Generate only new items
        let newHtml = '';
        const startIndex = sessions.length - 1 - currentLimit;

        let count = 0;
        for (let i = startIndex; i >= 0 && count < CONST.HISTORY_PAGINATION_LIMIT; i--) {
            newHtml += _generateSessionCard(sessions[i]);
            count++;
        }

        if (newHtml) {
            historyList.insertAdjacentHTML('beforeend', newHtml);
        }

        State.historyLimit = newLimit;

        // Update Load More Button
        const btn = document.getElementById('load-more-btn');
        if (btn) {
            if (State.historyLimit >= sessions.length) {
                btn.remove();
                // Focus the last summary or something reasonable
                const summaries = document.querySelectorAll('summary');
                if (summaries.length > 0) summaries[summaries.length - 1].focus();
            } else {
                // Update text
                btn.textContent = I18n.t('history.loadMore', { remaining: sessions.length - State.historyLimit });
                btn.focus();
            }
        }
    } catch (e) {
        Logger.error('Error loading more history:', e);
        render();
    }
};
window.viewProtocol = () => {
    State.view = 'protocol';
    render();
};
window.closeProtocol = () => {
    State.view = 'settings';
    render();
};
window.del = async (id) => {
    if(await Modal.show({type:'confirm',title:I18n.t('modal.delete'),danger:true})) {
        try {
            Storage.deleteSession(id);
            render();
        } catch(e) {
            Modal.show({ title: I18n.t('modal.error'), text: e.message });
        }
    }
};
window.wipe = async () => { if(await Modal.show({type:'confirm',title:I18n.t('modal.reset'),danger:true})) Storage.reset(); };
window.imp = (el) => {
    const file = el.files[0];
    if (!file) return;

    // Sentinel: DoS prevention - validate file size before reading
    const maxSizeBytes = CONST.MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        Modal.show({
            type: 'error',
            title: 'File Too Large',
            message: CONST.ERROR_MESSAGES.IMPORT_FILE_TOO_LARGE
        });
        el.value = ''; // Reset input
        return;
    }

    const r = new FileReader();
    r.onload = async e => {
        const result = Storage.validateImport(e.target.result);
        if (!result.valid) {
            Modal.show({ title: I18n.t('modal.invalidFile'), text: result.error || 'Invalid file format.' });
            return;
        }

        if (await Modal.show({
            type: 'confirm',
            title: I18n.t('settings.restoreData'),
            text: I18n.t('modal.importConfirm', { count: result.sessions.length })
        })) {
            Storage.applyImport(result.sessions);
        }
        el.value = ''; // Reset input
    };
    r.readAsText(file);
};

// === SVG CHARTING ===
const ChartCache = {
    // WeakMap<sessionsArray, Map<exerciseId, dataArray>>
    _cache: new WeakMap(),
    _lastSessions: null,
    _lastIndex: null,

    _cloneIndex(oldIndex) {
        const newIndex = new Map();
        for (const [id, val] of oldIndex) {
            newIndex.set(id, {
                data: val.data, // Shared reference (Copy-On-Write)
                minVal: val.minVal,
                maxVal: val.maxVal
            });
        }
        return newIndex;
    },

    _addToIndex(index, session) {
        if (!session.exercises) return;
        for (let j = 0; j < session.exercises.length; j++) {
            const ex = session.exercises[j];

            if (!index.has(ex.id)) {
                index.set(ex.id, { data: [], minVal: Infinity, maxVal: -Infinity });
            }

            if (!ex.usingAlternative) {
                const entry = index.get(ex.id);
                // Copy-On-Write: Clone array before mutation
                entry.data = [...entry.data];

                const v = ex.weight;
                entry.data.push({ d: new Date(session.date), v });
                if (v < entry.minVal) entry.minVal = v;
                if (v > entry.maxVal) entry.maxVal = v;
            }
        }
    },

    _removeFromIndex(index, session) {
        if (!session.exercises) return;
        for (let j = 0; j < session.exercises.length; j++) {
            const ex = session.exercises[j];
            if (ex.usingAlternative) continue;

            const entry = index.get(ex.id);
            if (!entry || entry.data.length === 0) continue;

            const lastPoint = entry.data[entry.data.length - 1];
            // Compare timestamps
            if (new Date(session.date).getTime() === lastPoint.d.getTime()) {
                // Copy-On-Write: Clone array before mutation
                entry.data = [...entry.data];

                const popped = entry.data.pop();

                if (popped.v === entry.minVal || popped.v === entry.maxVal) {
                    let newMin = Infinity;
                    let newMax = -Infinity;
                    for (const p of entry.data) {
                        if (p.v < newMin) newMin = p.v;
                        if (p.v > newMax) newMax = p.v;
                    }
                    entry.minVal = newMin;
                    entry.maxVal = newMax;
                }
            }
        }
    },

    getData(exerciseId) {
        const sessions = Storage.getSessions();
        if (!this._cache.has(sessions)) {
            let index = null;

            // Optimization: Incremental Update
            if (this._lastSessions && this._lastIndex) {
                const oldLen = this._lastSessions.length;
                const newLen = sessions.length;

                // Find divergence index
                let divergenceIndex = 0;
                const minLen = Math.min(oldLen, newLen);
                while (divergenceIndex < minLen && sessions[divergenceIndex] === this._lastSessions[divergenceIndex]) {
                    divergenceIndex++;
                }

                // Case 1: Append (Everything up to oldLen matches)
                if (divergenceIndex === oldLen && newLen === oldLen + 1) {
                    index = this._cloneIndex(this._lastIndex);
                    this._addToIndex(index, sessions[newLen - 1]);
                }
                // Case 2: Replace Last (Everything up to oldLen-1 matches)
                else if (divergenceIndex === oldLen - 1 && newLen === oldLen) {
                    index = this._cloneIndex(this._lastIndex);
                    this._removeFromIndex(index, this._lastSessions[oldLen - 1]);
                    this._addToIndex(index, sessions[newLen - 1]);
                }
                // Case 3: Remove Last (Everything up to newLen matches)
                else if (divergenceIndex === newLen && newLen === oldLen - 1) {
                    index = this._cloneIndex(this._lastIndex);
                    this._removeFromIndex(index, this._lastSessions[oldLen - 1]);
                }
                // Case 4: Remove Last to Empty
                else if (newLen === 0 && oldLen === 1) {
                    index = new Map();
                }
            }

            if (!index) {
                // Full rebuild
                index = new Map();
                for (let i = 0; i < sessions.length; i++) {
                    this._addToIndex(index, sessions[i]);
                }
            }

            this._cache.set(sessions, index);
            this._lastSessions = sessions;
            this._lastIndex = index;
        }

        const sessionCache = this._cache.get(sessions);

        if (!sessionCache.has(exerciseId)) {
            return { data: [], minVal: Infinity, maxVal: -Infinity };
        }

        return sessionCache.get(exerciseId);
    }
};

window.drawChart = (id) => {
    try {
        const div = document.getElementById('chart-area');
        if (!div) {
            Logger.error('Chart area element not found');
            return;
        }

        const { data, minVal, maxVal } = ChartCache.getData(id);

        if (data.length < 2) {
            div.innerHTML = `<p style="padding:1rem;color:var(--text-secondary)">${I18n.t('progress.needLogs')}</p>`;
            return;
        }

        const max = maxVal * 1.1;
        const min = minVal * 0.9;
        const W = div.clientWidth || 300;
        const H = Math.max(200, Math.min(300, W * 0.6));
        const P = 20;

        // Sentinel: Sanitize coordinates to prevent SVG injection
        const safeNum = (n) => {
            const num = Number(n);
            return (isFinite(num) && !isNaN(num)) ? num.toFixed(2) : '0';
        };

        const X = i => safeNum(P + (i/(data.length-1)) * (W-P*2));
        const Y = v => safeNum(H - (P + ((v-min)/(max-min)) * (H-P*2)));

        let path = `M ${X(0)} ${Y(data[0].v)}`;
        data.forEach((p,i) => path += ` L ${X(i)} ${Y(p.v)}`);
        div.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight progression chart for ${EXERCISE_MAP.get(id)?.name || 'exercise'}">
            <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="3"/>
            ${data.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.v)}" r="4" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="2"/>`).join('')}
        </svg><div class="flex-row" style="justify-content:space-between; margin-top:0.25rem; font-size:var(--font-xs); color:var(--text-secondary)"><span>${DateFormatter.format(data[0].d)}</span><span>${DateFormatter.format(data[data.length-1].d)}</span></div>`;
    } catch (e) {
        Logger.error('Error drawing chart:', e);
        const div = document.getElementById('chart-area');
        if (div) {
            div.innerHTML = `<p style="padding:1rem;color:var(--error)">${I18n.t('progress.errorRendering')}</p>`;
        }
    }
};

// === GLOBAL EVENT LISTENERS ===
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-item');
        if (target.dataset.view === 'history' && State.view !== 'history') {
            State.historyLimit = 20;
        }
        State.view = target.dataset.view;
        render();
    });
});

// Fix for listener leak: Global delegation for delete buttons
const mainContent = document.getElementById('main-content');
if (mainContent) {
    mainContent.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-session');
        if (deleteBtn) {
            const sessionId = deleteBtn.getAttribute('data-session-id');
            if (sessionId) window.del(sessionId);
        }
    });
}

// === INITIALIZATION ===
// Initialize all mission-critical systems
(async function initializeSystems() {
    // Mark performance start
    Metrics.mark('app-init-start');

    // 1. Initialize observability first (for logging other initializations)
    Observability.init();
    Logger.info(`🚀 Flexx Files v${CONST.APP_VERSION} - Mission-Critical Mode`);

    // 2. Initialize security system
    Security.init(Logger);
    Logger.info('Security system active');

    // Optimization: Pre-sanitize static URLs to avoid repeated parsing in render loops
    preSanitizeConfig();

    // 3. Initialize accessibility system
    Accessibility.init();
    Logger.info('Accessibility system active (WCAG 2.1 AA)');

    // 4. Initialize internationalization
    I18n.init();
    Logger.info('i18n system active', { locale: I18n.currentLocale });

    // 5. Run database migrations
    Storage.runMigrations();
    Logger.info('Database migrations complete');

    // 6. Check for draft recovery
    const draft = Storage.loadDraft();
    if (draft) {
        const restore = await Modal.show({
            type: 'confirm',
            title: I18n.t('modal.recoverSession'),
            text: I18n.t('modal.recoverDraft', { time: DateFormatter.relative(draft.date) })
        });
        if (restore) {
            State.activeSession = draft;
            State.recovery = draft.recoveryStatus;
            State.phase = 'lifting'; // Resume at lifting phase
            Logger.info('Draft session restored', { id: draft.id });
            ScreenReader.announce('Previous session recovered successfully');
        } else {
            Storage.clearDraft();
            Logger.info('Draft session discarded');
        }
    }

    // 7. Register service worker for offline capability with update detection
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            Logger.info('Service worker registered');

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available - notify user
                        showUpdateNotification(newWorker);
                    }
                });
            });

            // Detect controller change (update applied)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!window.__reloading) {
                    window.__reloading = true;
                    window.location.reload();
                }
            });
        } catch (e) {
            Logger.warn('Service worker registration failed', { error: e.message });
        }
    }

    // Update notification handler
    function showUpdateNotification(worker) {
        Modal.show({
            title: I18n.t('modal.updateAvailable'),
            text: I18n.t('modal.updateText'),
            type: 'confirm',
            okText: I18n.t('modal.reloadNow')
        }).then(reload => {
            if (reload) {
                worker.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }

    // 8. Track app startup
    Analytics.track('app_start', {
        version: CONST.APP_VERSION,
        platform: navigator.platform,
        online: navigator.onLine
    });

    // Measure initialization time
    const initTime = Metrics.measure('app-init', 'app-init-start');
    Logger.info('App initialized', {
        duration: `${initTime?.toFixed(2)}ms`,
        sessions: Storage.getSessions().length
    });

    // 9. Render the app
    render();

    // 10. Auto-save drafts every 30 seconds if session is active
    const draftAutoSaveInterval = setInterval(() => {
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Logger.debug('Draft auto-saved', { id: State.activeSession.id });
        }
    }, 30000); // 30 seconds

    // 11. Clean up resources on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(draftAutoSaveInterval);
        // Flush any pending session writes
        Storage.flushPersistence();
        // Final draft save before unload
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Storage.flushDraft();
        }
    });

    // 12. Save draft when user switches tabs or minimizes browser
    // visibilitychange fires when tab becomes hidden (more reliable than beforeunload for tab switches)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Storage.flushDraft();
            Storage.flushPersistence();
            Logger.debug('Draft saved on visibility change', { id: State.activeSession.id });
        }
    });

    // 13. Save draft on pagehide (more reliable than beforeunload on mobile/Safari)
    window.addEventListener('pagehide', () => {
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Storage.flushDraft();
            Storage.flushPersistence();
            Logger.debug('Draft saved on pagehide', { id: State.activeSession.id });
        }
    });

})().catch(error => {
    Logger.error('Fatal initialization error:', error);
    ScreenReader.announce(I18n.t('modal.initError'), 'assertive');
    Modal.show({ title: I18n.t('modal.fatalError'), text: I18n.t('modal.initError') });
});
```

### `js/config.js`
- **role:** Config/Settings
- **why it matters:** Core business settings
- **inclusion mode:** Full
```javascript
export const EXERCISES = [
    {
        id: 'hinge', name: 'Trap Bar Deadlift', category: 'HINGE', sets: 3, reps: 8,
        video: 'https://www.youtube.com/results?search_query=trap+bar+deadlift+form+tutorial',
        alternatives: ['Barbell RDL', 'DB RDL'],
        altLinks: {
            'Barbell RDL': 'https://www.youtube.com/results?search_query=barbell+romanian+deadlift+form',
            'DB RDL': 'https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form'
        }
    },
    {
        id: 'knee', name: 'Goblet Squat', category: 'KNEE', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=dumbbell+goblet+squat+form',
        alternatives: ['DB Front Squat', 'Bulgarian Split Squat'],
        altLinks: {
            'DB Front Squat': 'https://www.youtube.com/results?search_query=dumbbell+front+squat+form',
            'Bulgarian Split Squat': 'https://www.youtube.com/results?search_query=bulgarian+split+squat+dumbbells+form'
        }
    },
    {
        id: 'push_horz', name: 'DB Bench Press', category: 'H-PUSH', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+form',
        alternatives: ['Barbell Bench Press', 'Incline Push-up on Bench'],
        altLinks: {
            'Barbell Bench Press': 'https://www.youtube.com/results?search_query=barbell+bench+press+form',
            'Incline Push-up on Bench': 'https://www.youtube.com/results?search_query=hands+elevated+push+up+on+bench+form'
        }
    },
    {
        id: 'push_incline', name: 'Incline DB Press', category: 'H-PUSH', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+form',
        alternatives: ['Incline Barbell Press', 'Decline Push-up'],
        altLinks: {
            'Incline Barbell Press': 'https://www.youtube.com/results?search_query=incline+barbell+bench+press+form',
            'Decline Push-up': 'https://www.youtube.com/results?search_query=decline+push+up+form'
        }
    },
    {
        id: 'push_vert', name: 'Standing DB OHP', category: 'V-PUSH', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=standing+dumbbell+overhead+press+form',
        alternatives: ['Seated DB Press', 'Barbell Overhead Press'],
        altLinks: {
            'Seated DB Press': 'https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press+form',
            'Barbell Overhead Press': 'https://www.youtube.com/results?search_query=standing+barbell+overhead+press+form'
        }
    },
    {
        id: 'pull', name: 'Chest-Supported Row', category: 'PULL', sets: 3, reps: 12,
        video: 'https://www.youtube.com/results?search_query=incline+bench+dumbbell+row+form',
        alternatives: ['Single Arm DB Row (Bench)', 'Barbell Row'],
        altLinks: {
            'Single Arm DB Row (Bench)': 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+on+bench+form',
            'Barbell Row': 'https://www.youtube.com/results?search_query=barbell+bent+over+row+form'
        }
    },
    {
        id: 'pull_vert', name: 'Lat Pulldown', category: 'PULL', sets: 3, reps: 12,
        video: 'https://www.youtube.com/results?search_query=lat+pulldown+form',
        alternatives: ['Pull Up', 'Band Pulldown'],
        altLinks: {
            'Pull Up': 'https://www.youtube.com/results?search_query=pull+up+form',
            'Band Pulldown': 'https://www.youtube.com/results?search_query=resistance+band+lat+pulldown'
        }
    },
    {
        id: 'carry', name: 'Farmers Walk', category: 'CARRY', sets: 3, reps: 40,
        video: 'https://www.youtube.com/results?search_query=farmers+walk+dumbbell+form',
        alternatives: ['Farmer Hold (Standing)', 'DB Shrugs'],
        altLinks: {
            'Farmer Hold (Standing)': 'https://www.youtube.com/results?search_query=farmers+hold+exercise+form',
            'DB Shrugs': 'https://www.youtube.com/results?search_query=standing+dumbbell+shrugs+form'
        }
    },
    {
        id: 'calves', name: 'Standing Calf Raises', category: 'CALVES', sets: 3, reps: 15,
        video: 'https://www.youtube.com/results?search_query=standing+dumbbell+calf+raise+form',
        alternatives: ['Seated Calf Raises', 'Jump Rope'],
        altLinks: {
            'Seated Calf Raises': 'https://www.youtube.com/results?search_query=seated+dumbbell+calf+raise+form',
            'Jump Rope': 'https://www.youtube.com/results?search_query=jump+rope+boxing+technique'
        }
    }
];

export const WARMUP = [
    {
        id: 'thoracic', name: 'Wall Thoracic Rotations', reps: '10/side',
        video: 'https://www.youtube.com/results?search_query=standing+thoracic+rotation+against+wall',
        alternatives: ['Standing Windmill', 'Standing T-Spine Twist'],
        altLinks: {
            'Standing Windmill': 'https://www.youtube.com/results?search_query=standing+windmill+exercise+form',
            'Standing T-Spine Twist': 'https://www.youtube.com/results?search_query=standing+t-spine+rotation+form'
        }
    },
    {
        id: 'swings', name: 'Kettlebell Swings', reps: '20',
        video: 'https://www.youtube.com/results?search_query=russian+kettlebell+swing+form',
        alternatives: ['Broad Jumps', 'Bodyweight Good Mornings'],
        altLinks: {
            'Broad Jumps': 'https://www.youtube.com/results?search_query=broad+jump+form',
            'Bodyweight Good Mornings': 'https://www.youtube.com/results?search_query=bodyweight+good+morning+exercise'
        }
    },
    {
        id: 'halo', name: 'Standing KB Halo', reps: '10/dir',
        video: 'https://www.youtube.com/results?search_query=standing+kettlebell+halo+exercise',
        alternatives: ['Around the World (Plate/DB)', 'Shoulder Dislocates (Broom)'],
        altLinks: {
            'Around the World (Plate/DB)': 'https://www.youtube.com/results?search_query=plate+around+the+world+exercise',
            'Shoulder Dislocates (Broom)': 'https://www.youtube.com/results?search_query=shoulder+dislocates+form'
        }
    },
    {
        id: 'prying', name: 'Goblet Squat Prying', reps: '10',
        video: 'https://www.youtube.com/results?search_query=goblet+squat+prying+stretch',
        alternatives: ['Cossack Squat', 'Deep Squat Hold'],
        altLinks: {
            'Cossack Squat': 'https://www.youtube.com/results?search_query=cossack+squat+form',
            'Deep Squat Hold': 'https://www.youtube.com/results?search_query=deep+squat+hold+mobility'
        }
    },
    {
        id: 'rope', name: 'Jump Rope', reps: '100',
        video: 'https://www.youtube.com/results?search_query=jump+rope+basic+bounce',
        alternatives: ['Jumping Jacks', 'High Knees'],
        altLinks: {
            'Jumping Jacks': 'https://www.youtube.com/results?search_query=jumping+jacks+form',
            'High Knees': 'https://www.youtube.com/results?search_query=high+knees+exercise+form'
        }
    }
];

export const CARDIO_OPTIONS = [
    { name: 'Assault Bike', video: 'https://www.youtube.com/results?search_query=assault+bike+technique' },
    { name: 'Rower', video: 'https://www.youtube.com/results?search_query=concept2+rowing+technique' },
    { name: 'Treadmill Incline', video: 'https://www.youtube.com/results?search_query=treadmill+incline+walking+form' }
];

export const DECOMPRESSION = [
    {
        id: 'hang', name: 'Dead Hang',
        video: 'https://www.youtube.com/results?search_query=dead+hang+form',
        alternatives: ['Farmers Hold (Static)', 'Plate Pinch Hold'],
        altLinks: {
            'Farmers Hold (Static)': 'https://www.youtube.com/results?search_query=farmers+hold+exercise',
            'Plate Pinch Hold': 'https://www.youtube.com/results?search_query=plate+pinch+grip+hold'
        },
        inputLabel: 'Seconds',
        duration: '30-60 seconds • Relax shoulders, decompress spine'
    },
    {
        id: 'breath', name: 'Box Breathing (Seated)',
        video: 'https://www.youtube.com/results?search_query=seated+box+breathing+technique',
        alternatives: ['Physiological Sigh', '4-7-8 Breathing'],
        altLinks: {
            'Physiological Sigh': 'https://www.youtube.com/results?search_query=physiological+sigh+breathing',
            '4-7-8 Breathing': 'https://www.youtube.com/results?search_query=4-7-8+breathing+technique'
        },
        inputLabel: null,
        duration: '4 rounds • 4s inhale, 4s hold, 4s exhale, 4s hold'
    }
];

export const RECOVERY_CONFIG = {
    green: { label: 'Green', factor: 1.0 },
    yellow: { label: 'Yellow', factor: 0.9 },
    red: { label: 'Red', factor: 0 }
};
// Optimization: Pre-calculated Maps for O(1) lookups
export const EXERCISE_MAP = new Map(EXERCISES.map(e => [e.id, e]));
export const WARMUP_MAP = new Map(WARMUP.map(e => [e.id, e]));
export const DECOMPRESSION_MAP = new Map(DECOMPRESSION.map(e => [e.id, e]));
```

### `js/constants.js`
- **role:** Config/Settings
- **why it matters:** Core business settings
- **inclusion mode:** Full
```javascript
/**
 * Application Constants
 * All magic numbers and configuration values centralized for maintainability
 */

// === WORKOUT TIMING ===
export const REST_PERIOD_HOURS = 24; // Minimum hours between workouts
export const WEEK_WARNING_HOURS = 168; // Warn if more than 1 week since last workout (7 days)
export const SESSIONS_PER_WEEK = 3; // Used for week number calculation
export const DEFAULT_REST_TIMER_SECONDS = 90; // Default rest between sets

// === PROGRESSION SYSTEM ===
export const WEIGHT_INCREMENT_LBS = 5; // Weight increase on successful completion
export const STEPPER_INCREMENT_LBS = 2.5; // Weight adjustment step in UI
export const DELOAD_WEEK_INTERVAL = 6; // Deload every N weeks
export const DELOAD_PERCENTAGE = 0.6; // 60% of max for deload week
export const STALL_DELOAD_PERCENTAGE = 0.9; // 90% of weight on stall detection
export const STALL_DETECTION_SESSIONS = 3; // Number of failed sessions to trigger stall
export const YELLOW_RECOVERY_MULTIPLIER = 0.9; // 90% weight on yellow recovery

// === BARBELL CALCULATIONS ===
export const OLYMPIC_BAR_WEIGHT_LBS = 45; // Standard Olympic barbell weight
export const AVAILABLE_PLATES = [45, 35, 25, 10, 5, 2.5, 1.25]; // Available plate weights
export const PLATE_CACHE_LIMIT = 300; // Max number of weight calculations to cache

// === AUTO-EXPORT ===
export const AUTO_EXPORT_INTERVAL = 5; // Auto-export every N sessions

// === DATA VERSIONING ===
export const APP_VERSION = '3.9.73';
export const STORAGE_VERSION = 'v3';
export const STORAGE_PREFIX = 'flexx_';

// === OBSERVABILITY ===
export const LOG_LEVEL = 'INFO'; // DEBUG, INFO, WARN, ERROR, CRITICAL
export const MAX_LOG_ENTRIES = 500;
export const MAX_ERROR_ENTRIES = 50;
export const PERFORMANCE_LONG_TASK_MS = 50;

// === SECURITY ===
export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
export const SESSION_DRAFT_AUTOSAVE_INTERVAL_MS = 30000; // 30 seconds
export const MAX_IMPORT_FILE_SIZE_MB = 10; // Maximum file size for data imports (DoS prevention)

// === ACCESSIBILITY ===
export const A11Y_ANNOUNCE_DELAY_MS = 100;
export const A11Y_FOCUS_TRAP_ENABLED = true;

// === I18N ===
export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en'];

// === SUSTAINABILITY ===
export const BATTERY_LOW_THRESHOLD = 0.2; // 20%
export const BATTERY_CRITICAL_THRESHOLD = 0.15; // 15%

// === DEBUG ===
export const DUMMY_DATA_SESSIONS = 8; // Number of sessions in dummy data
export const DUMMY_DATA_DAYS_BACK = 30; // How far back to generate dummy data
export const DEBUG_REST_UNLOCK_HOURS = 73; // Backdating time for rest unlock (3 days + 1 hour)

// === UI TIMING ===
export const CHART_RENDER_DELAY_MS = 100; // Delay before rendering chart to ensure DOM is ready
export const TIMER_TICK_INTERVAL_MS = 1000; // Timer update frequency
export const HISTORY_PAGINATION_LIMIT = 20; // Number of sessions to load per page
export const CARDIO_TIMER_SECONDS = 300; // Default duration for cardio timer (5 mins)

// === RECOVERY STATES ===
export const RECOVERY_STATES = {
    GREEN: 'green',
    YELLOW: 'yellow',
    RED: 'red'
};

// === WORKOUT PHASES ===
export const PHASES = {
    WARMUP: 'warmup',
    LIFTING: 'lifting',
    CARDIO: 'cardio',
    DECOMPRESSION: 'decompression'
};

// === ERROR MESSAGES ===
export const ERROR_MESSAGES = {
    SAVE_FAILED: 'Failed to save workout. Please try exporting your data.',
    DELETE_FAILED: 'Failed to delete session. Please try again.',
    IMPORT_INVALID_FORMAT: 'Invalid file format: sessions must be an array',
    IMPORT_MISSING_FIELDS: 'Invalid file: some sessions are missing required fields',
    IMPORT_PARSE_ERROR: 'Invalid file: Please ensure this is a valid Flexx Files backup file.',
    IMPORT_FILE_TOO_LARGE: 'File too large. Maximum size is 10MB.',
    EXPORT_FAILED: 'Failed to export data. Please try again.',
    LOAD_FAILED: 'Failed to load sessions data'
};
```

### `js/core.js`
- **role:** Core Logic
- **why it matters:** Core flow logic and persistence
- **inclusion mode:** Full
```javascript
import { EXERCISES, EXERCISE_MAP } from './config.js';
import * as CONST from './constants.js';
import { Validator as SecurityValidator, Sanitizer } from './security.js';
import { Logger } from './observability.js';

// Optimization: Create O(1) lookup map and Set for exercises
const EXERCISE_IDS = new Set(EXERCISE_MAP.keys());

export const Storage = {
    KEYS: {
        SESSIONS: `${CONST.STORAGE_PREFIX}sessions_v3`,
        PREFS: `${CONST.STORAGE_PREFIX}prefs`,
        MIGRATION_VERSION: `${CONST.STORAGE_PREFIX}migration_version`,
        BACKUP: `${CONST.STORAGE_PREFIX}backup_snapshot`,
        DRAFT: `${CONST.STORAGE_PREFIX}draft_session`
    },

    // Performance Optimization: Cache parsed sessions to avoid repeated JSON.parse()
    _sessionCache: null,
    _cachedSessionsSize: null, // Optimization: Avoid repeated getItem() for large JSON
    _pendingWrite: null,
    _pendingWriteType: null, // 'timeout' or 'idle'
    _isCorrupted: false,

    // Draft Optimization: Debounce draft writes
    _draftCache: null,
    _pendingDraftWrite: null,
    _shouldClearDraft: false,

    /**
     * ATOMIC TRANSACTION SYSTEM
     * Provides rollback capability for safe data operations
     */
    Transaction: {
        inProgress: false,
        snapshot: null,

        begin() {
            if (this.inProgress) {
                Logger.warn('Transaction already in progress');
                return false;
            }

            try {
                // Create snapshot of current data
                // Sentinel: Use reference copy for performance (O(1)).
                // Rationale: usage patterns in saveSession guarantee that the sessions array
                // and its contained objects are effectively immutable during the transaction.
                // We trust the application not to mutate cache objects in-place.
                this.snapshot = Storage.getSessions();
                this.inProgress = true;
                Logger.debug('Transaction started', { sessionCount: this.snapshot.length });
                return true;
            } catch (e) {
                Logger.error('Failed to begin transaction:', { error: e.message });
                return false;
            }
        },

        commit() {
            if (!this.inProgress) {
                Logger.warn('No transaction in progress');
                return false;
            }

            try {
                // Transaction successful, clear snapshot
                this.snapshot = null;
                this.inProgress = false;
                Logger.debug('Transaction committed');
                return true;
            } catch (e) {
                Logger.error('Failed to commit transaction:', { error: e.message });
                this.rollback();
                return false;
            }
        },

        rollback() {
            if (!this.inProgress || !this.snapshot) {
                Logger.warn('No transaction to rollback');
                return false;
            }

            try {
                // Restore from snapshot
                localStorage.setItem(Storage.KEYS.SESSIONS, JSON.stringify(this.snapshot));
                Storage._sessionCache = null; // Invalidate cache
                this.snapshot = null;
                this.inProgress = false;
                Logger.warn('Transaction rolled back');
                return true;
            } catch (e) {
                Logger.critical('Failed to rollback transaction:', { error: e.message });
                return false;
            }
        }
    },

    /**
     * Save draft session for recovery
     */
    saveDraft(session) {
        // Update cache immediately
        this._draftCache = session;

        // Debounce: Clear previous timer
        if (this._pendingDraftWrite) {
            clearTimeout(this._pendingDraftWrite);
        }

        // Schedule write
        this._pendingDraftWrite = setTimeout(() => {
            this.flushDraft();
        }, 500); // 500ms debounce

        return true;
    },

    /**
     * Flush pending draft write immediately
     */
    flushDraft() {
        if (this._pendingDraftWrite) {
            clearTimeout(this._pendingDraftWrite);
            this._pendingDraftWrite = null;
        }

        if (this._draftCache) {
            try {
                localStorage.setItem(this.KEYS.DRAFT, JSON.stringify(this._draftCache));
                Logger.debug('Draft saved (flushed)', { sessionId: this._draftCache.id });
                return true;
            } catch (e) {
                Logger.error('Failed to flush draft:', { error: e.message });
                return false;
            }
        }
        return true;
    },

    /**
     * Load draft session
     */
    loadDraft() {
        try {
            const draft = localStorage.getItem(this.KEYS.DRAFT);
            const parsed = draft ? JSON.parse(draft) : null;

            if (parsed) {
                // SECURITY: Validate draft structure to prevent injection/corruption
                const validation = SecurityValidator.validateSession(parsed);
                if (!validation.valid) {
                    Logger.warn('Invalid draft session detected and discarded', { errors: validation.errors });
                    this.clearDraft();
                    return null;
                }
            }

            this._draftCache = parsed; // Populate cache
            return parsed;
        } catch (e) {
            Logger.error('Failed to load draft:', { error: e.message });
            return null;
        }
    },

    /**
     * Clear draft session
     */
    clearDraft() {
        try {
            if (this._pendingDraftWrite) {
                clearTimeout(this._pendingDraftWrite);
                this._pendingDraftWrite = null;
            }
            this._draftCache = null;

            localStorage.removeItem(this.KEYS.DRAFT);
            Logger.debug('Draft cleared');
            return true;
        } catch (e) {
            Logger.error('Failed to clear draft:', { error: e.message });
            return false;
        }
    },

    /**
     * Schema Migration System
     * Handles safe transitions between storage versions
     */
    getCurrentMigrationVersion() {
        return localStorage.getItem(this.KEYS.MIGRATION_VERSION) || 'v3';
    },

    setMigrationVersion(version) {
        localStorage.setItem(this.KEYS.MIGRATION_VERSION, version);
    },

    runMigrations() {
        const currentVersion = this.getCurrentMigrationVersion();
        Logger.info(`Current migration version: ${currentVersion}`);

        // If we're already on the latest version, no migration needed
        if (currentVersion === CONST.STORAGE_VERSION) {
            return;
        }

        try {
            // Run migrations in sequence
            if (currentVersion === 'v3' && CONST.STORAGE_VERSION === 'v4') {
                this.migrateV3toV4();
            }
            // Add more migration paths here as needed
            // if (currentVersion === 'v4' && CONST.STORAGE_VERSION === 'v5') {
            //     this.migrateV4toV5();
            // }

            // Update migration version after successful migration
            this.setMigrationVersion(CONST.STORAGE_VERSION);
            Logger.info(`Successfully migrated to ${CONST.STORAGE_VERSION}`);
        } catch (e) {
            Logger.error('Migration failed:', { error: e.message });
            throw new Error('Data migration failed. Your data is safe but may need manual export/import.');
        }
    },

    /**
     * Example migration: v3 to v4
     * Currently a no-op since we're still on v3
     * This demonstrates the pattern for future migrations
     */
    migrateV3toV4() {
        Logger.info('Running v3 -> v4 migration');
        const sessions = this.getSessions();

        // Example migration logic:
        // Add new fields, rename fields, transform data, etc.
        const migratedSessions = sessions.map(session => {
            // Future: Add any new required fields
            // if (!session.newField) {
            //     session.newField = defaultValue;
            // }
            return session;
        });

        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(migratedSessions));
        Logger.info(`Migrated ${migratedSessions.length} sessions`);
    },

    getSessions() {
        if (this._sessionCache) return this._sessionCache;
        try {
            const data = localStorage.getItem(this.KEYS.SESSIONS);
            if (!data) {
                this._cachedSessionsSize = 0;
                return [];
            }
            // Optimization: Cache size to avoid reading large string again in getUsage()
            this._cachedSessionsSize = data.length;

            const sessions = JSON.parse(data);
            // Validate it's an array
            this._sessionCache = Array.isArray(sessions) ? sessions : [];
            return this._sessionCache;
        } catch (e) {
            Logger.error('Failed to load sessions:', { error: e.message });
            // Sentinel: Flag corruption to prevent overwriting raw data later
            this._isCorrupted = true;
            // Return empty array so UI can still render partial state (e.g. empty history)
            // but saving will be blocked.
            return [];
        }
    },

    saveSession(session) {
        // Ensure data is loaded to detect corruption state
        this.getSessions();

        // Sentinel: Prevent data loss if storage is corrupted
        if (this._isCorrupted) {
            const msg = 'Storage is corrupted. Cannot save to prevent data loss. Please export data immediately.';
            Logger.critical(msg);
            throw new Error(msg);
        }

        // Start atomic transaction
        if (!this.Transaction.begin()) {
            Logger.error('Could not start transaction for saveSession');
            throw new Error('Transaction failed to start');
        }

        try {
            // QUOTA GUARD: Check storage usage before saving
            // Prevent data loss by blocking saves when near capacity (Bolt Mode)
            const usage = this.getUsage();
            if (usage.percent > 96) { // Leave ~200KB buffer
                Logger.warn('Storage quota exceeded', { usage: usage.percent });
                throw new Error('STORAGE_FULL');
            }

            // SECURITY: Validate session structure before saving
            const validation = SecurityValidator.validateSession(session);
            if (!validation.valid) {
                const errorMsg = `Invalid session data: ${validation.errors.join(', ')}`;
                Logger.error(errorMsg, { sessionId: session?.id });
                throw new Error(errorMsg);
            }

            const sessions = this.getSessions();

            // IDEMPOTENCY CHECK: Prevent duplicate saves of the same session
            // If a session with this ID already exists, update it instead of creating a duplicate
            const existingIndex = sessions.findIndex(s => s.id === session.id);
            if (existingIndex !== -1) {
                Logger.warn(`Session ${session.id} already exists. Updating instead of creating duplicate.`);
                // Update existing session
                session.sessionNumber = sessions[existingIndex].sessionNumber;
                session.weekNumber = sessions[existingIndex].weekNumber;
            } else {
                // New session: assign numbers
                session.sessionNumber = sessions.length + 1;
                session.weekNumber = Math.ceil(session.sessionNumber / 3);
            }

            session.totalVolume = session.exercises.reduce((sum, ex) => {
                if (ex.skipped) return sum;
                // Look up the exercise config to get the prescribed reps
                // Optimization: O(1) lookup
                const cfg = EXERCISE_MAP.get(ex.id);
                const reps = cfg ? cfg.reps : 0;
                return sum + (ex.weight * ex.setsCompleted * reps);
            }, 0);

            // Sentinel: Enforce strict schema validation before persistence
            const cleanSession = Sanitizer.scrubSession(session);
            if (!cleanSession) {
                throw new Error('Session scrubbing failed');
            }

            // Create a new array instance to ensure cache invalidation for consumers
            // relying on array identity (like Calculator's WeakMap)
            let newSessions;
            if (existingIndex !== -1) {
                // Update existing session
                newSessions = [...sessions];
                newSessions[existingIndex] = cleanSession;
            } else {
                // Add new session
                newSessions = [...sessions, cleanSession];
            }

            // Update cache and storage with the new array
            this._sessionCache = newSessions;

            // Optimization: Non-blocking I/O (Async Persistence)
            // Defer strict persistence to allow UI thread to unblock immediately
            this.schedulePersistence();

            // Defer draft clearing until persistence is confirmed
            this._shouldClearDraft = true;

            Logger.info('Session saved successfully (async scheduled)', { id: session.id, number: session.sessionNumber });
            return session;
        } catch (e) {
            Logger.error('Failed to save session:', { error: e.message });
            // Rollback transaction on error
            this.Transaction.rollback();
            throw e; // Re-throw so caller knows it failed
        }
    },

    deleteSession(id) {
        // Sentinel: Prevent data loss if storage is corrupted
        if (this._isCorrupted) {
            const msg = 'Storage is corrupted. Cannot modify data.';
            Logger.critical(msg);
            throw new Error(msg);
        }

        if (!this.Transaction.begin()) {
            Logger.error('Could not start transaction for deleteSession');
            throw new Error('Transaction failed to start');
        }

        try {
            const sessions = this.getSessions();
            const index = sessions.findIndex(s => s.id === id);

            if (index === -1) {
                Logger.warn(`Session ${id} not found`);
                this.Transaction.commit(); // Close transaction cleanly
                return false;
            }

            // Optimization: Create new array via splice to avoid O(N) filter callbacks
            const newSessions = sessions.slice();
            newSessions.splice(index, 1);

            this._sessionCache = newSessions; // Update cache

            // Commit transaction after successful cache update
            this.Transaction.commit();

            // Optimization: Non-blocking I/O
            this.schedulePersistence();
            return true;
        } catch (e) {
            Logger.error('Failed to delete session:', { error: e.message });
            this.Transaction.rollback();
            throw new Error('Failed to delete session. Please try again.');
        }
    },

    exportData() {
        try {
            const sessions = this.getSessions();
            const data = {
                version: CONST.APP_VERSION,
                exportDate: new Date().toISOString(),
                sessions
            };
            // Windows Safe Filename (No colons)
            const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `flexx-files-backup-${safeDate}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (e) {
            Logger.error('Export error:', { error: e.message });
            throw new Error(CONST.ERROR_MESSAGES.EXPORT_FAILED);
        }
    },

    autoExport(sessions) {
        try {
            const data = {
                version: CONST.APP_VERSION,
                type: 'auto',
                sessions
            };
            const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `flexx-files-auto-${safeDate}.json`;
            a.click();
        } catch (e) {
            Logger.error('Auto-export error:', { error: e.message });
            // Don't alert for auto-export failures, just log
        }
    },

    validateImport(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Use Security Validator
            const validation = SecurityValidator.validateImportData(data);
            if (!validation.valid) {
                // SECURITY: Never expose validation details to user
                Logger.error('Import validation failed', { errors: validation.errors });
                return { valid: false, error: CONST.ERROR_MESSAGES.IMPORT_PARSE_ERROR };
            }

            const sessions = Array.isArray(data) ? data : data.sessions;

            // Sentinel: Scrub sessions to prevent schema pollution
            const cleanSessions = sessions.map(s => Sanitizer.scrubSession(s)).filter(s => s !== null);

            return { valid: true, sessions: cleanSessions };
        } catch (e) {
            Logger.error('Import error:', { error: e.message });
            return { valid: false, error: CONST.ERROR_MESSAGES.IMPORT_PARSE_ERROR };
        }
    },

    applyImport(sessions) {
        try {
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
            this._sessionCache = null;
            window.location.reload();
        } catch (e) {
            Logger.error('Apply import error:', { error: e.message });
            throw new Error('Failed to apply import data');
        }
    },

    schedulePersistence() {
        if (this._pendingWrite) {
            if (this._pendingWriteType === 'idle' && typeof window.cancelIdleCallback === 'function') {
                window.cancelIdleCallback(this._pendingWrite);
            } else {
                clearTimeout(this._pendingWrite);
            }
        }

        // Use requestIdleCallback if available for better non-blocking behavior
        if (typeof window.requestIdleCallback === 'function') {
            this._pendingWriteType = 'idle';
            this._pendingWrite = window.requestIdleCallback(() => {
                this.flushPersistence();
            }, { timeout: 2000 }); // Force write after 2s if no idle time
        } else {
            this._pendingWriteType = 'timeout';
            // Defer to next tick to allow UI update
            this._pendingWrite = setTimeout(() => {
                this.flushPersistence();
            }, 0);
        }
    },

    flushPersistence() {
        if (this._pendingWrite) {
            if (this._pendingWriteType === 'idle' && typeof window.cancelIdleCallback === 'function') {
                window.cancelIdleCallback(this._pendingWrite);
            } else {
                clearTimeout(this._pendingWrite);
            }
            this._pendingWrite = null;
            this._pendingWriteType = null;
        }

        if (!this._sessionCache) return;
        try {
            const json = JSON.stringify(this._sessionCache);
            localStorage.setItem(this.KEYS.SESSIONS, json);
            // Optimization: Update cached size immediately after write
            this._cachedSessionsSize = json.length;

            if (this._shouldClearDraft) {
                this.clearDraft();
                this._shouldClearDraft = false;
            }

            // Commit transaction if in progress
            if (this.Transaction.inProgress) {
                this.Transaction.commit();
            }
        } catch (e) {
            Logger.error('Persistence failed:', { error: e.message });
            if (this.Transaction.inProgress) {
                this.Transaction.rollback();
            }
        }
        this._pendingWrite = null;
    },

    reset() {
        // Sentinel: Only clear Flexx Files data, preserving other apps on same origin
        const prefix = CONST.STORAGE_PREFIX || 'flexx_';
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });

        this._sessionCache = null;
        window.location.reload();
    },

    /**
     * Calculate storage usage
     * @returns {object} { bytes, percent, limit }
     */
    getUsage() {
        let total = 0;
        const prefix = CONST.STORAGE_PREFIX || 'flexx_';
        try {
            // Iterate using key() to support mocks and standard localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    // Optimization: Use cached size for large sessions key to avoid allocation
                    if (key === this.KEYS.SESSIONS && this._cachedSessionsSize !== null) {
                        total += (key.length + this._cachedSessionsSize) * 2;
                        continue;
                    }

                    const value = localStorage.getItem(key);
                    if (value) {
                        total += (key.length + value.length) * 2; // UTF-16 approximation (2 bytes per char)
                    }
                }
            }
        } catch (e) {
            Logger.warn('Storage usage calculation failed', { error: e.message });
        }

        const limit = 5 * 1024 * 1024; // 5MB typical limit
        return {
            bytes: total,
            percent: Math.min(100, (total / limit) * 100),
            limit
        };
    },

};

export const Calculator = {
    // Optimization: Cache expensive lookups keyed by sessions array instance
    _cache: new WeakMap(),
    _plateCache: new Map(),
    _loadBuffer: [],
    // Optimization: Pre-calculate plate strings to avoid repeated conversion
    _plateStrings: CONST.AVAILABLE_PLATES.map(String),
    _lastSessions: null,
    _lastLookup: null,

    _cloneLookup(lookup) {
        const newLookup = new Map();
        for (const [key, val] of lookup) {
            newLookup.set(key, {
                last: val.last,
                lastSession: val.lastSession,
                lastCompleted: val.lastCompleted,
                lastNonDeload: val.lastNonDeload,
                lastGreen: val.lastGreen,
                recent: [...val.recent] // Copy array to prevent shared mutation
            });
        }
        return newLookup;
    },

    _applySession(lookup, session) {
        const week = Math.ceil(session.sessionNumber / CONST.SESSIONS_PER_WEEK);
        const isDeload = (week % CONST.DELOAD_WEEK_INTERVAL === 0);

        for (const ex of session.exercises) {
            if (ex.skipped) continue;

            const key = (ex.usingAlternative && ex.altName) ? ex.altName : ex.id;
            if (!lookup.has(key)) {
                lookup.set(key, { last: null, lastSession: null, lastCompleted: null, lastNonDeload: null, lastGreen: null, recent: [] });
            }
            const entry = lookup.get(key);

            // Add to recent history (newest at start)
            entry.recent.unshift(ex);
            if (entry.recent.length > CONST.STALL_DETECTION_SESSIONS) {
                entry.recent.pop();
            }

            // Update last (this is the newest)
            entry.last = ex;
            entry.lastSession = session;

            // Update lastCompleted
            if (ex.completed) {
                entry.lastCompleted = ex;
            }

            // Update lastNonDeload
            if (!isDeload) {
                entry.lastNonDeload = ex;
            }

            // Update lastGreen
            if (session.recoveryStatus === 'green' && !isDeload) {
                entry.lastGreen = ex;
            }
        }
    },

    _rollbackSession(lookup, session, historySessions) {
        // Rollback is trickier because we need to undo state changes.
        // historySessions is the FULL history array from which we are removing the last session.
        // We use it to refill 'recent' buffer and find previous 'lastCompleted' if needed.

        // We need to know which exercises were in the session we are removing
        for (const ex of session.exercises) {
            if (ex.skipped) continue;

            const key = (ex.usingAlternative && ex.altName) ? ex.altName : ex.id;
            const entry = lookup.get(key);
            if (!entry) continue;

            // 1. Remove from 'recent'
            // The removed exercise should be at index 0 of recent
            if (entry.recent.length > 0 && entry.recent[0] === ex) {
                entry.recent.shift();

                // Refill 'recent' from history if it dropped below threshold
                if (entry.recent.length < CONST.STALL_DETECTION_SESSIONS) {
                    this._scanBackwardsForRecent(entry, key, historySessions, historySessions.length - 2);
                }
            }

            // 2. Update 'last'
            entry.last = entry.recent.length > 0 ? entry.recent[0] : null;
            entry.lastSession = null; // Invalidate cache to force fallback

            // 3. Update 'lastCompleted'
            if (entry.lastCompleted === ex) {
                const recentCompleted = entry.recent.find(e => e.completed);
                if (recentCompleted) {
                    entry.lastCompleted = recentCompleted;
                } else {
                    entry.lastCompleted = this._scanBackwardsForCompleted(key, historySessions, historySessions.length - 2);
                }
            }

            // 4. Update 'lastNonDeload'
            if (entry.lastNonDeload === ex) {
                entry.lastNonDeload = this._scanBackwardsForNonDeload(key, historySessions, historySessions.length - 2);
            }

            // 5. Update 'lastGreen'
            if (entry.lastGreen === ex) {
                entry.lastGreen = this._scanBackwardsForGreen(key, historySessions, historySessions.length - 2);
            }
        }
    },

    _scanBackwardsForGreen(key, sessions, startIndex) {
        for (let i = startIndex; i >= 0; i--) {
            const session = sessions[i];
            if (session.recoveryStatus !== 'green') continue;

            const week = Math.ceil(session.sessionNumber / CONST.SESSIONS_PER_WEEK);
            if (week % CONST.DELOAD_WEEK_INTERVAL === 0) continue;

            const ex = session.exercises.find(e => {
                const k = (e.usingAlternative && e.altName) ? e.altName : e.id;
                return k === key && !e.skipped;
            });

            if (ex) return ex;
        }
        return null;
    },

    _scanBackwardsForRecent(entry, key, sessions, startIndex) {
        for (let i = startIndex; i >= 0; i--) {
            if (entry.recent.length >= CONST.STALL_DETECTION_SESSIONS) break;

            const session = sessions[i];
            const ex = session.exercises.find(e => {
                const k = (e.usingAlternative && e.altName) ? e.altName : e.id;
                return k === key && !e.skipped;
            });

            if (ex) {
                if (!entry.recent.includes(ex)) {
                    entry.recent.push(ex);
                }
            }
        }
    },

    _scanBackwardsForCompleted(key, sessions, startIndex) {
        for (let i = startIndex; i >= 0; i--) {
            const session = sessions[i];
            const ex = session.exercises.find(e => {
                const k = (e.usingAlternative && e.altName) ? e.altName : e.id;
                return k === key && !e.skipped;
            });

            if (ex && ex.completed) {
                return ex;
            }
        }
        return null;
    },

    _scanBackwardsForNonDeload(key, sessions, startIndex) {
        for (let i = startIndex; i >= 0; i--) {
            const session = sessions[i];
            const week = Math.ceil(session.sessionNumber / CONST.SESSIONS_PER_WEEK);
            if (week % CONST.DELOAD_WEEK_INTERVAL === 0) continue;

            const ex = session.exercises.find(e => {
                const k = (e.usingAlternative && e.altName) ? e.altName : e.id;
                return k === key && !e.skipped;
            });

            if (ex) return ex;
        }
        return null;
    },

    _ensureCache(sessions, targetId = null) {
        if (this._cache.has(sessions)) {
            const lookup = this._cache.get(sessions);
            // If targetId is requested but missing, and the cache was built using a partial scan,
            // we must force a full scan to find the missing target.
            if (targetId && !lookup.has(targetId) && lookup._isPartial) {
                // Fall through to full scan logic (bypass return)
            } else {
                return lookup;
            }
        }

        // Optimization: Content Equality Check
        // If array identity differs but content is identical (same session objects in same order),
        // we can reuse the cached lookup.
        if (this._lastSessions && sessions.length === this._lastSessions.length) {
            let match = true;
            // Iterate backwards as changes are usually at the end
            for (let i = sessions.length - 1; i >= 0; i--) {
                if (sessions[i] !== this._lastSessions[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                // Check for partial cache validity with targetId
                if (targetId && !this._lastLookup.has(targetId) && this._lastLookup._isPartial) {
                    // Fall through to full scan
                } else {
                    this._cache.set(sessions, this._lastLookup);
                    this._lastSessions = sessions; // Update reference to newest array
                    return this._lastLookup;
                }
            }
        }

        // Optimization: Incremental Update
        if (this._lastSessions && this._lastLookup) {
            const oldLen = this._lastSessions.length;
            const newLen = sessions.length;

            // If the last lookup was partial and we need a target it doesn't have,
            // we cannot use incremental update safely without complex logic.
            // Simpler to just fall back to full scan.
            const forceFullScan = targetId && !this._lastLookup.has(targetId) && this._lastLookup._isPartial;

            if (!forceFullScan) {
                // Case 1: Append (newLen === oldLen + 1)
                if (newLen === oldLen + 1 &&
                    (oldLen === 0 || (sessions[0] === this._lastSessions[0] && sessions[oldLen - 1] === this._lastSessions[oldLen - 1]))) {

                    const newLookup = this._cloneLookup(this._lastLookup);
                    newLookup._isPartial = this._lastLookup._isPartial;
                    this._applySession(newLookup, sessions[newLen - 1]);

                    this._cache.set(sessions, newLookup);
                    this._lastSessions = sessions;
                    this._lastLookup = newLookup;
                    return newLookup;
                }

                // Case 2: Replace Last (newLen === oldLen)
                // e.g. User updated the current workout
                if (newLen === oldLen && oldLen > 0 &&
                    (sessions[0] === this._lastSessions[0] &&
                     (oldLen === 1 || sessions[oldLen - 2] === this._lastSessions[oldLen - 2]))) {

                    const newLookup = this._cloneLookup(this._lastLookup);
                    newLookup._isPartial = this._lastLookup._isPartial;
                    this._rollbackSession(newLookup, this._lastSessions[oldLen - 1], this._lastSessions);
                    this._applySession(newLookup, sessions[newLen - 1]);

                    this._cache.set(sessions, newLookup);
                    this._lastSessions = sessions;
                    this._lastLookup = newLookup;
                    return newLookup;
                }

                // Case 3: Remove Last (newLen === oldLen - 1)
                // e.g. User deleted the last workout
                if (newLen === oldLen - 1 && newLen > 0 &&
                     (sessions[0] === this._lastSessions[0] && sessions[newLen - 1] === this._lastSessions[newLen - 1])) {

                     const newLookup = this._cloneLookup(this._lastLookup);
                     newLookup._isPartial = this._lastLookup._isPartial;
                     this._rollbackSession(newLookup, this._lastSessions[oldLen - 1], this._lastSessions);

                     this._cache.set(sessions, newLookup);
                     this._lastSessions = sessions;
                     this._lastLookup = newLookup;
                     return newLookup;
                }

                // Case 4: Remove Last to Empty (1 -> 0)
                if (newLen === 0 && oldLen === 1) {
                     const newLookup = new Map();
                     newLookup._isPartial = false; // Empty is complete
                     this._cache.set(sessions, newLookup);
                     this._lastSessions = sessions;
                     this._lastLookup = newLookup;
                     return newLookup;
                }
            }
        }

        // Optimization: Iterate backwards and stop early once we found data for all current exercises.
        // NOTE: This assumes we primarily care about exercises in the current configuration (EXERCISES).
        // If the user has history for exercises no longer in EXERCISES, or if they haven't performed
        // one of the current exercises, we will scan the full history (falling back to O(N)).
        // This is acceptable as the app UI is driven by EXERCISES.
        const lookup = new Map(); // Map<exerciseId, { last, lastSession, lastCompleted, lastNonDeload, lastGreen, recent }>

        // Optimization: Use pre-calculated Set
        const requiredIds = EXERCISE_IDS;
        const fullyResolved = new Set();
        let brokeEarly = false;

        for (let i = sessions.length - 1; i >= 0; i--) {
            // Stop if we have found everything we need
            // AND if a specific target was requested, we found it too.
            const targetFound = !targetId || fullyResolved.has(targetId);
            if (fullyResolved.size >= requiredIds.size && targetFound) {
                brokeEarly = true;
                break;
            }

            const session = sessions[i];
            for (const ex of session.exercises) {
                if (ex.skipped) continue;

                const key = (ex.usingAlternative && ex.altName) ? ex.altName : ex.id;
                if (!lookup.has(key)) {
                    lookup.set(key, { last: null, lastSession: null, lastCompleted: null, lastNonDeload: null, lastGreen: null, recent: [] });
                }
                const entry = lookup.get(key);

                // Add to recent history if we haven't hit the limit yet
                if (entry.recent.length < CONST.STALL_DETECTION_SESSIONS) {
                    entry.recent.push(ex);
                }

                // Since iterating backwards, the first valid entry found is the latest
                if (!entry.last) {
                    entry.last = ex;
                    entry.lastSession = session;
                }

                if (ex.completed && !entry.lastCompleted) {
                    entry.lastCompleted = ex;
                }

                if (!entry.lastNonDeload) {
                    const week = Math.ceil(session.sessionNumber / CONST.SESSIONS_PER_WEEK);
                    if (week % CONST.DELOAD_WEEK_INTERVAL !== 0) {
                        entry.lastNonDeload = ex;
                    }
                }

                // Update lastGreen (first one encountered is the latest)
                if (!entry.lastGreen && session.recoveryStatus === 'green') {
                    const week = Math.ceil(session.sessionNumber / CONST.SESSIONS_PER_WEEK);
                    if (week % CONST.DELOAD_WEEK_INTERVAL !== 0) {
                        entry.lastGreen = ex;
                    }
                }

                // Check if this exercise is fully resolved (we have lastCompleted AND enough recent history)
                // Note: We need lastCompleted to calculate progression.
                // We need recent to detect stalls.
                // If we have both, we can stop searching for this exercise.
                const isRequired = requiredIds.has(key) || key === targetId;
                if (isRequired && !fullyResolved.has(key)) {
                    // We are resolved if:
                    // 1. We have found a completed entry (so we know the last successful weight)
                    // 2. We have filled the recent buffer (so we can detect stalls)
                    // 3. We have found the last non-deload entry
                    // 4. We have found the last green entry
                    // Note: If the user has NEVER completed the exercise, we will scan full history.
                    // This is expected and necessary to find the last completion (which doesn't exist).
                    if (entry.lastCompleted && entry.recent.length >= CONST.STALL_DETECTION_SESSIONS && entry.lastNonDeload && entry.lastGreen) {
                        fullyResolved.add(key);
                    }
                }
            }
        }

        lookup._isPartial = brokeEarly;
        this._cache.set(sessions, lookup);
        this._lastSessions = sessions;
        this._lastLookup = lookup;
        return lookup;
    },

    getRecommendedWeight(exerciseId, recoveryStatus, sessions) {
        if (!sessions) sessions = Storage.getSessions();
        if (sessions.length === 0) return 0;

        const base = this.getBaseRecommendation(exerciseId, sessions);
        const factor = recoveryStatus === CONST.RECOVERY_STATES.YELLOW ?
            CONST.YELLOW_RECOVERY_MULTIPLIER : 1.0;
        let w = base * factor;
        return parseFloat((Math.round(w / CONST.STEPPER_INCREMENT_LBS) * CONST.STEPPER_INCREMENT_LBS).toFixed(1));
    },

    isDeloadWeek(sessions) {
        if (!sessions) sessions = Storage.getSessions();
        const week = Math.ceil((sessions.length + 1) / CONST.SESSIONS_PER_WEEK);
        return (week > 0 && week % CONST.DELOAD_WEEK_INTERVAL === 0);
    },

    getBaseRecommendation(exerciseId, sessions) {
        // Deload every N weeks
        if (this.isDeloadWeek(sessions)) {
            // Check if we are already in the deload week (mid-week)
            if (sessions.length > 0) {
                const lastSession = sessions[sessions.length - 1];
                const currentWeek = Math.ceil((sessions.length + 1) / CONST.SESSIONS_PER_WEEK);
                const lastWeek = Math.ceil(lastSession.sessionNumber / CONST.SESSIONS_PER_WEEK);

                if (lastWeek === currentWeek) {
                    // Already deloaded. Return last attempt weight (maintain).
                    const lastAttempt = this.getLastExercise(exerciseId, sessions);
                    return lastAttempt ? lastAttempt.weight : CONST.OLYMPIC_BAR_WEIGHT_LBS;
                }
            }

            const last = this.getLastCompletedExercise(exerciseId, sessions);
            return last ? last.weight * CONST.DELOAD_PERCENTAGE : CONST.OLYMPIC_BAR_WEIGHT_LBS;
        }

        // Stall detection: reduce weight if failing repeatedly
        if (this.detectStall(exerciseId, sessions)) {
            const last = this.getLastExercise(exerciseId, sessions);
            return last ? last.weight * CONST.STALL_DELOAD_PERCENTAGE : CONST.OLYMPIC_BAR_WEIGHT_LBS;
        }

        // Normal progression: add weight on success
        const last = this.getLastExercise(exerciseId, sessions);
        if (!last) return CONST.OLYMPIC_BAR_WEIGHT_LBS;

        // Check if coming out of a deload week
        if (sessions.length > 0) {
            const lastSession = sessions[sessions.length - 1];
            const lastWeek = Math.ceil(lastSession.sessionNumber / CONST.SESSIONS_PER_WEEK);

            // If previous session was a deload week, resume from pre-deload weight
            if (lastWeek % CONST.DELOAD_WEEK_INTERVAL === 0) {
                const preDeloadEx = this.getLastNonDeloadExercise(exerciseId, sessions);
                if (preDeloadEx) {
                    // Check if pre-deload session was a transient dip (Yellow)
                    const lastGreen = this.getLastGreenExercise(exerciseId, sessions);
                    if (lastGreen && preDeloadEx.completed && preDeloadEx.weight < lastGreen.weight) {
                        return lastGreen.weight;
                    }
                    return preDeloadEx.completed ? preDeloadEx.weight + CONST.WEIGHT_INCREMENT_LBS : preDeloadEx.weight;
                }
            }
        }

        // Transient State Resilience:
        // If the last session was a constrained recovery day (Yellow/Red) and resulted in a
        // weight lower than our Green baseline, we should restore the Green baseline.
        // This prevents temporary constraints from permanently degrading progress.
        const lastRecovery = this.getLastRecoveryStatus(exerciseId, sessions);
        if (lastRecovery && lastRecovery !== 'green' && last.completed) {
            const lastGreen = this.getLastGreenExercise(exerciseId, sessions);
            // If we have a green baseline that is higher than what we just did
            if (lastGreen && lastGreen.weight > last.weight) {
                // Resume progression from the Green baseline
                // (Assuming we would have progressed if not constrained)
                return lastGreen.completed ? lastGreen.weight + CONST.WEIGHT_INCREMENT_LBS : lastGreen.weight;
            }
        }

        return last.completed ? last.weight + CONST.WEIGHT_INCREMENT_LBS : last.weight;
    },

    detectStall(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);

        // If we don't have enough history, it's not a stall
        if (!entry || entry.recent.length < CONST.STALL_DETECTION_SESSIONS) return false;

        const recent = entry.recent;
        // Stall detected if all recent attempts failed at same weight
        return recent.every(e => !e.completed && e.weight === recent[0].weight);
    },

    getLastExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);
        return entry ? entry.last : null;
    },

    getLastCompletedExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);
        return entry ? entry.lastCompleted : null;
    },

    getLastNonDeloadExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);
        return entry ? entry.lastNonDeload : null;
    },

    getLastGreenExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);
        return entry ? entry.lastGreen : null;
    },

    getLastRecoveryStatus(exerciseId, sessions) {
        const cache = this._ensureCache(sessions, exerciseId);
        const entry = cache.get(exerciseId);

        // Optimized Path: O(1)
        if (entry && entry.lastSession) {
            return entry.lastSession.recoveryStatus;
        }

        // Fallback Path: O(N)
        if (!entry || !entry.last) return null;

        // Find the session containing the last exercise object
        // Optimization: iterate backwards as it's likely recent
        for (let i = sessions.length - 1; i >= 0; i--) {
            const s = sessions[i];
            if (s.exercises.includes(entry.last)) {
                // Self-healing cache: Update lastSession if found
                entry.lastSession = s;
                return s.recoveryStatus;
            }
        }
        return null;
    },

    getPlateLoad(weight) {
        if (this._plateCache.has(weight)) {
            const result = this._plateCache.get(weight);
            // LRU: Move to end of cache by deleting and re-inserting
            this._plateCache.delete(weight);
            this._plateCache.set(weight, result);
            return result;
        }

        // Calculate plates needed for each side of barbell
        let result;
        if (weight < CONST.OLYMPIC_BAR_WEIGHT_LBS) {
            result = 'Use DBs / Fixed Bar';
        } else {
            const target = (weight - CONST.OLYMPIC_BAR_WEIGHT_LBS) / 2; // Each side gets half
            // Epsilon for floating point comparison (0.005 lbs precision is sufficient for 1.25 lbs plates)
            const EPSILON = 0.005;

            if (target <= EPSILON) {
                result = 'Empty Bar';
            } else {
                this._loadBuffer.length = 0;
                let rem = target + EPSILON; // Add epsilon to ensure we catch plates slightly below threshold due to FP error
                const plates = CONST.AVAILABLE_PLATES;
                const plateStrs = this._plateStrings;
                const len = plates.length;

                // Greedy algorithm: use largest plates first
                for (let i = 0; i < len; i++) {
                    const p = plates[i];
                    const pStr = plateStrs[i];
                    while (rem >= p) {
                        this._loadBuffer.push(pStr);
                        rem -= p;
                    }
                }
                result = this._loadBuffer.length ? `+ [ ${this._loadBuffer.join(', ')} ]` : 'Empty Bar';
            }
        }

        // Optimization: Memoize result
        // Limit cache size to prevent memory leaks (e.g. 300 entries)
        if (this._plateCache.size > CONST.PLATE_CACHE_LIMIT) {
            const firstKey = this._plateCache.keys().next().value;
            this._plateCache.delete(firstKey);
        }
        this._plateCache.set(weight, result);

        return result;
    },
};

export const Validator = {
    canStartWorkout() {
        const sessions = Storage.getSessions();
        if (sessions.length === 0) return { valid: true, isFirst: true };

        const lastSession = sessions[sessions.length - 1];
        if (!lastSession || !lastSession.date) {
            Logger.warn('Last session missing date');
            return { valid: true, warning: true };
        }

        const hours = (Date.now() - new Date(lastSession.date)) / 3600000;

        // Require minimum rest period
        if (hours < CONST.REST_PERIOD_HOURS) {
            return {
                valid: false,
                hours: Math.ceil(CONST.REST_PERIOD_HOURS - hours),
                nextAvailable: new Date(Date.now() + ((CONST.REST_PERIOD_HOURS - hours) * 3600000))
            };
        }

        // Warn if it's been more than a week
        if (hours > CONST.WEEK_WARNING_HOURS) {
            return {
                valid: true,
                warning: true,
                days: Math.floor(hours / 24),
                message: 'Long gap since last workout'
            };
        }

        return { valid: true };
    }
};
```

### `js/security.js`
- **role:** Core Logic
- **why it matters:** Core flow logic and persistence
- **inclusion mode:** Full
```javascript
/**
 * Security Module
 * Provides input sanitization, XSS protection, CSP support, and data validation
 * Zero external dependencies - all validation is local
 */

import { RECOVERY_STATES, STORAGE_PREFIX, APP_VERSION } from './constants.js';

let Logger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} };

// === INPUT SANITIZATION ===
const SANITIZE_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
};
const SANITIZE_REGEX = /[<>"'\/]/g;

// Module-level cache for URL sanitization
const _urlCache = new Map();

export const Sanitizer = {
    /**
     * Scrub session object to remove unauthorized fields (Schema Enforcement)
     */
    scrubSession(session) {
        if (!session || typeof session !== 'object') return null;

        // Allowlist of root fields
        const clean = {
            id: String(session.id),
            date: String(session.date),
            recoveryStatus: String(session.recoveryStatus),
            exercises: [],
            warmup: [],
            cardio: null,
            decompress: null
        };

        // Optional numeric root fields
        if (session.sessionNumber !== undefined) clean.sessionNumber = Number(session.sessionNumber);
        if (session.weekNumber !== undefined) clean.weekNumber = Number(session.weekNumber);
        if (session.totalVolume !== undefined) clean.totalVolume = Number(session.totalVolume);

        // Deep scrub exercises
        if (Array.isArray(session.exercises)) {
            clean.exercises = session.exercises.map(ex => {
                const cleanEx = {
                    id: String(ex.id),
                    name: String(ex.name),
                    weight: Number(ex.weight)
                };
                // Optional fields
                if (ex.setsCompleted !== undefined) cleanEx.setsCompleted = Number(ex.setsCompleted);
                if (ex.completed !== undefined) cleanEx.completed = Boolean(ex.completed);
                if (ex.usingAlternative !== undefined) cleanEx.usingAlternative = Boolean(ex.usingAlternative);
                if (ex.altName !== undefined) cleanEx.altName = String(ex.altName);
                if (ex.skipped !== undefined) cleanEx.skipped = Boolean(ex.skipped);
                return cleanEx;
            });
        }

        // Deep scrub warmup
        if (Array.isArray(session.warmup)) {
            clean.warmup = session.warmup.map(w => {
                const cleanW = {
                    id: String(w.id),
                    completed: Boolean(w.completed)
                };
                if (w.altUsed !== undefined) cleanW.altUsed = String(w.altUsed);
                return cleanW;
            });
        }

        // Deep scrub cardio
        if (session.cardio && typeof session.cardio === 'object') {
            clean.cardio = {
                type: String(session.cardio.type),
                completed: Boolean(session.cardio.completed)
            };
        }

        // Deep scrub decompress
        if (session.decompress) {
            if (Array.isArray(session.decompress)) {
                clean.decompress = session.decompress.map(d => {
                    const cleanD = {
                        id: String(d.id),
                        completed: Boolean(d.completed)
                    };
                    if (d.val !== undefined && d.val !== null) cleanD.val = String(d.val);
                    else if (d.val === null) cleanD.val = null;
                    if (d.altUsed !== undefined) cleanD.altUsed = String(d.altUsed);
                    return cleanD;
                });
            } else if (typeof session.decompress === 'object') {
                clean.decompress = {
                    completed: Boolean(session.decompress.completed)
                };
            }
        }

        return clean;
    },

    /**
     * Sanitize string input - remove dangerous characters
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(SANITIZE_REGEX, match => SANITIZE_MAP[match]);
    },

    /**
     * Sanitize number input
     */
    sanitizeNumber(num, min = -Infinity, max = Infinity) {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) return 0;
        return Math.max(min, Math.min(max, parsed));
    },

    /**
     * Sanitize file name for downloads
     */
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9._-]/gi, '_').substring(0, 255);
    },

    /**
     * Validate URL is safe (no javascript: protocol)
     * Defense-in-depth: pre-validate before URL parsing to prevent encoding bypasses
     */
    sanitizeURL(url) {
        // Optimization: Check cache first
        if (typeof url === 'string' && _urlCache.has(url)) {
            const result = _urlCache.get(url);
            // LRU: Move to end of cache by deleting and re-inserting
            _urlCache.delete(url);
            _urlCache.set(url, result);
            return result;
        }

        try {
            // Type check
            if (typeof url !== 'string' || !url) {
                Logger.warn('Invalid URL type', { url: typeof url });
                return '#';
            }

            // Normalize whitespace and control characters that could hide protocol
            const normalized = url.trim().replace(/[\x00-\x1F\x7F]/g, '');

            // Pre-validation: block dangerous protocols before URL parsing
            // This prevents encoding bypasses like java%09script: or data:
            const protocolMatch = normalized.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/) || ['', ''];
            const protocol = protocolMatch[1].toLowerCase();

            const dangerousProtocols = ['javascript', 'data', 'vbscript', 'file', 'about'];
            if (dangerousProtocols.includes(protocol)) {
                Logger.warn('Dangerous URL protocol blocked', { url: normalized.substring(0, 50), protocol });
                AuditLog.log('xss_attempt', { url: normalized.substring(0, 50), protocol });
                return '#';
            }

            // Parse and validate structure
            const parsed = new URL(normalized);

            // Only allow http, https protocols (double-check after parsing)
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                Logger.warn('Unsafe URL protocol detected', { url: normalized.substring(0, 50), protocol: parsed.protocol });
                AuditLog.log('xss_attempt', { url: normalized.substring(0, 50), protocol: parsed.protocol });
                return '#';
            }

            // Return normalized URL to prevent any residual encoding issues
            const result = parsed.href;

            // Cache success results (limit cache size to 100)
            if (_urlCache.size >= 100) {
                const oldest = _urlCache.keys().next().value;
                _urlCache.delete(oldest);
            }
            _urlCache.set(url, result);

            return result;
        } catch (e) {
            Logger.warn('Invalid URL format', { error: e.message });
            return '#';
        }
    }
};

// === DATA VALIDATION ===
export const Validator = {
    /**
     * Validate session data structure
     */
    validateSession(session) {
        const required = ['id', 'date', 'recoveryStatus', 'exercises'];
        const missing = required.filter(field => !(field in session));

        if (missing.length > 0) {
            Logger.error('Invalid session: missing fields', { missing });
            AuditLog.log('failed_validation', { type: 'session', missing });
            return { valid: false, errors: [`Missing fields: ${missing.join(', ')}`] };
        }

        // Validate types for ID, date, and recoveryStatus to prevent coercion bypasses
        if (typeof session.id !== 'string') {
            Logger.error('Invalid session: ID must be a string');
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_id_type' });
            return { valid: false, errors: ['Invalid session ID type'] };
        }
        if (typeof session.date !== 'string') {
            Logger.error('Invalid session: Date must be a string');
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_date_type' });
            return { valid: false, errors: ['Invalid date type'] };
        }
        if (typeof session.recoveryStatus !== 'string') {
            Logger.error('Invalid session: Recovery status must be a string');
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_recovery_type' });
            return { valid: false, errors: ['Invalid recovery status type'] };
        }

        // Validate ID format (UUID)
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)) {
            Logger.error('Invalid session: bad ID format', { id: session.id });
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_id', id: session.id });
            return { valid: false, errors: ['Invalid session ID format'] };
        }

        // Validate date
        if (isNaN(new Date(session.date).getTime())) {
            Logger.error('Invalid session: bad date', { date: session.date });
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_date', date: session.date });
            return { valid: false, errors: ['Invalid date format'] };
        }

        // Validate recovery status
        if (!Object.values(RECOVERY_STATES).includes(session.recoveryStatus)) {
            Logger.error('Invalid session: bad recovery status', { status: session.recoveryStatus });
            AuditLog.log('failed_validation', { type: 'session', error: 'bad_recovery', status: session.recoveryStatus });
            return { valid: false, errors: ['Invalid recovery status'] };
        }

        // Validate optional numeric fields
        if (session.sessionNumber !== undefined && (typeof session.sessionNumber !== 'number' || isNaN(session.sessionNumber))) {
            return { valid: false, errors: ['sessionNumber must be a number'] };
        }
        if (session.weekNumber !== undefined && (typeof session.weekNumber !== 'number' || isNaN(session.weekNumber))) {
            return { valid: false, errors: ['weekNumber must be a number'] };
        }
        if (session.totalVolume !== undefined && (typeof session.totalVolume !== 'number' || isNaN(session.totalVolume))) {
            return { valid: false, errors: ['totalVolume must be a number'] };
        }

        // Validate exercises array
        if (!Array.isArray(session.exercises)) {
            Logger.error('Invalid session: exercises not an array');
            AuditLog.log('failed_validation', { type: 'session', error: 'exercises_not_array' });
            return { valid: false, errors: ['Exercises must be an array'] };
        }

        // Validate each exercise in the array
        for (const [index, exercise] of session.exercises.entries()) {
            const result = this.validateExercise(exercise);
            if (!result.valid) {
                Logger.error('Invalid session: invalid exercise', { index, errors: result.errors });
                AuditLog.log('failed_validation', { type: 'session', error: 'invalid_exercise', index, details: result.errors });
                return {
                    valid: false,
                    errors: [`Exercise ${index + 1}: ${result.errors.join(', ')}`]
                };
            }
        }

        // Validate optional warmup field
        if (session.warmup) {
            if (!Array.isArray(session.warmup)) {
                return { valid: false, errors: ['Warmup must be an array'] };
            }
            // Check elements are objects with id and completed
            for (const [i, w] of session.warmup.entries()) {
                if (typeof w !== 'object' || !w || typeof w.id !== 'string' || typeof w.completed !== 'boolean') {
                    return { valid: false, errors: [`Warmup item ${i} invalid`] };
                }
                // Optional altUsed must be string if present
                if (w.altUsed !== undefined && w.altUsed !== null && typeof w.altUsed !== 'string') {
                    return { valid: false, errors: [`Warmup item ${i} altUsed must be string`] };
                }
            }
        }

        // Validate optional cardio field
        if (session.cardio) {
            if (typeof session.cardio !== 'object') {
                return { valid: false, errors: ['Cardio must be an object'] };
            }
            if (typeof session.cardio.type !== 'string' || typeof session.cardio.completed !== 'boolean') {
                return { valid: false, errors: ['Cardio object invalid'] };
            }
        }

        // Validate optional decompress field
        if (session.decompress) {
            // Can be array or object (legacy)
            if (Array.isArray(session.decompress)) {
                for (const [i, d] of session.decompress.entries()) {
                    if (typeof d !== 'object' || !d || typeof d.id !== 'string' || typeof d.completed !== 'boolean') {
                        return { valid: false, errors: [`Decompress item ${i} invalid`] };
                    }
                }
            } else if (typeof session.decompress === 'object') {
                if (typeof session.decompress.completed !== 'boolean') {
                    return { valid: false, errors: ['Decompress object invalid'] };
                }
            } else {
                return { valid: false, errors: ['Decompress must be array or object'] };
            }
        }

        return { valid: true, errors: [] };
    },

    /**
     * Validate exercise data
     */
    validateExercise(exercise) {
        const required = ['id', 'name', 'weight'];
        const missing = required.filter(field => !(field in exercise));

        if (missing.length > 0) {
            return { valid: false, errors: [`Missing fields: ${missing.join(', ')}`] };
        }

        // Validate types
        if (typeof exercise.id !== 'string') return { valid: false, errors: ['id must be a string'] };
        if (typeof exercise.name !== 'string') return { valid: false, errors: ['name must be a string'] };

        // Validate weight is a reasonable number
        if (typeof exercise.weight !== 'number' || isNaN(exercise.weight) || exercise.weight < 0 || exercise.weight > 2000) {
            return { valid: false, errors: ['Weight must be between 0 and 2000 lbs'] };
        }

        // Validate optional fields if present
        if (exercise.setsCompleted !== undefined && (typeof exercise.setsCompleted !== 'number' || isNaN(exercise.setsCompleted) || exercise.setsCompleted < 0)) {
            return { valid: false, errors: ['setsCompleted must be a positive number'] };
        }
        if (exercise.completed !== undefined && typeof exercise.completed !== 'boolean') {
            return { valid: false, errors: ['completed must be boolean'] };
        }
        if (exercise.usingAlternative !== undefined && typeof exercise.usingAlternative !== 'boolean') {
            return { valid: false, errors: ['usingAlternative must be boolean'] };
        }
        if (exercise.altName !== undefined && exercise.altName !== null && typeof exercise.altName !== 'string') {
            return { valid: false, errors: ['altName must be string'] };
        }
        if (exercise.skipped !== undefined && typeof exercise.skipped !== 'boolean') {
            return { valid: false, errors: ['skipped must be boolean'] };
        }

        return { valid: true, errors: [] };
    },

    /**
     * Validate import data structure
     */
    validateImportData(data) {
        if (!data || typeof data !== 'object') {
            AuditLog.log('failed_validation', { type: 'import', error: 'invalid_format' });
            return { valid: false, errors: ['Invalid data format'] };
        }

        // Check for required fields
        const sessions = Array.isArray(data) ? data : data.sessions;

        if (!Array.isArray(sessions)) {
            AuditLog.log('failed_validation', { type: 'import', error: 'missing_sessions_array' });
            return { valid: false, errors: ['Data must contain a sessions array'] };
        }

        // Validate each session
        const errors = [];
        sessions.forEach((session, index) => {
            const result = this.validateSession(session);
            if (!result.valid) {
                errors.push(`Session ${index + 1}: ${result.errors.join(', ')}`);
            }
        });

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        return { valid: true, errors: [], sessionCount: sessions.length };
    }
};


// === CONTENT SECURITY POLICY ===
export const CSP = {
    /**
     * Generate CSP meta tag content
     */
    getPolicy() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for dynamic styles
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
    },

    /**
     * Check if CSP is enabled
     */
    isEnabled() {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return !!meta;
    }
};

// === INTEGRITY CHECKER ===
export const IntegrityChecker = {
    /**
     * Generate hash of data for integrity verification
     */
    async generateHash(data) {
        const str = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(str);

        if ('crypto' in window && 'subtle' in window.crypto) {
            try {
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            } catch (e) {
                Logger.warn('Web Crypto API not available, using fallback hash');
                return this.simpleHash(str);
            }
        } else {
            return this.simpleHash(str);
        }
    },

    /**
     * Simple hash function fallback (not cryptographically secure)
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },

    /**
     * Verify data integrity
     */
    async verify(data, expectedHash) {
        const actualHash = await this.generateHash(data);
        return actualHash === expectedHash;
    }
};

// === AUDIT LOG ===
const CRITICAL_EVENTS = new Set([
    'failed_validation',
    'xss_attempt',
    'rate_limit_exceeded',
    'integrity_check_failed'
]);

export const AuditLog = {
    logs: [],
    persistedLogs: null,
    maxLogs: 100,
    _pendingWrite: null,

    /**
     * Log security-relevant events
     */
    log(event, details = {}) {
        const entry = {
            event,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 50)
        };

        this.logs.push(entry);

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        Logger.info(`Security audit: ${event}`, details);

        // Persist critical security events
        if (this.isCritical(event)) {
            this.persist(entry);
        }
    },

    isCritical(event) {
        return CRITICAL_EVENTS.has(event);
    },

    _ensureCache() {
        if (!this.persistedLogs) {
            try {
                this.persistedLogs = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}audit_log`) || '[]');
            } catch (e) {
                Logger.error('Failed to load audit log cache', { error: e.message });
                this.persistedLogs = [];
            }
        }
    },

    persist(entry) {
        try {
            // Optimization: Use in-memory cache to avoid O(N) read/parse on every write
            // Verified: Reduces I/O overhead by ~99%
            this._ensureCache();

            this.persistedLogs.push(entry);

            // Keep only last 50 critical events
            if (this.persistedLogs.length > 50) {
                this.persistedLogs.shift();
            }

            // Optimization: Batch writes to localStorage
            if (this._pendingWrite) clearTimeout(this._pendingWrite);
            this._pendingWrite = setTimeout(() => this.flushLogs(), 1000);
        } catch (e) {
            Logger.error('Failed to persist audit log', { error: e.message });
        }
    },

    flushLogs() {
        if (this._pendingWrite) {
            clearTimeout(this._pendingWrite);
            this._pendingWrite = null;
        }
        if (this.persistedLogs) {
            try {
                localStorage.setItem(`${STORAGE_PREFIX}audit_log`, JSON.stringify(this.persistedLogs));
            } catch (e) {
                Logger.error('Failed to flush audit logs', { error: e.message });
            }
        }
    },

    getLogs() {
        return [...this.logs];
    },

    getPersistedLogs() {
        try {
            this._ensureCache();
            return [...this.persistedLogs];
        } catch (e) {
            return [];
        }
    },

    clear() {
        if (this._pendingWrite) clearTimeout(this._pendingWrite);
        this.logs = [];
        this.persistedLogs = null;
        localStorage.removeItem(`${STORAGE_PREFIX}audit_log`);
    }
};

// === INITIALIZE SECURITY SYSTEM ===
export const Security = {
    init(logger) {
        if (logger) Logger = logger;
        // Log initialization
        AuditLog.log('security_init', { version: APP_VERSION });
        Logger.info('Security system initialized');

        // Ensure flush on unload
        window.addEventListener('beforeunload', () => AuditLog.flushLogs());
    },

    Sanitizer,
    Validator,
    CSP,
    IntegrityChecker,
    AuditLog
};

export default Security;
```

### `manifest.json`
- **role:** Config/Manifest
- **why it matters:** Entry point / config
- **inclusion mode:** Full
```json
{
    "name": "Flexx Files",
    "short_name": "Flexx",
    "description": "Offline Strength Tracker",
    "start_url": "./",
    "scope": "./",
    "display": "standalone",
    "background_color": "#050505",
    "theme_color": "#050505",
    "icons": [
        { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
        { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
    ]
}
```

### `package.json`
- **role:** Config/Manifest
- **why it matters:** Entry point / config
- **inclusion mode:** Full
```json
{
  "name": "flexx-files",
  "version": "3.9.73",
  "type": "module",
  "scripts": {
    "test:correctness": "node tests/verify_correctness.mjs",
    "test:simulation": "node tests/simulation_24_months.mjs",
    "test:version": "node tests/verify_version_consistency.mjs",
    "test:optimization": "node tests/verify_optimization_last_session.mjs",
    "test:render": "node tests/verify_app_render.mjs",
    "bench:calculator": "node tests/benchmark_calculator.mjs",
    "bench:storage": "node tests/benchmark_storage.mjs"
  }
}
```

### `sw.js`
- **role:** Config/Manifest
- **why it matters:** Entry point / config
- **inclusion mode:** Full
```javascript
const CACHE_NAME = 'flexx-v3.9.73';
const ASSETS = [
    './', './index.html', './css/styles.css',
    './js/app.js', './js/core.js', './js/config.js',
    './js/accessibility.js', './js/constants.js', './js/i18n.js',
    './js/observability.js', './js/security.js',
    './manifest.json',
    './assets/icon-192.png', './assets/icon-512.png'
];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.map(n => n !== CACHE_NAME ? caches.delete(n) : null))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request).catch(() => {
            if (e.request.mode === 'navigate') return caches.match('./index.html');
        }))
    );
});
self.addEventListener('message', e => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
```

### `tests/simulation_24_months.mjs`
- **role:** Test
- **why it matters:** Representative test
- **inclusion mode:** Full
```javascript
import { Storage, Calculator, Validator } from '../js/core.js';
import * as CONST from '../js/constants.js';
import { EXERCISES, WARMUP, CARDIO_OPTIONS, DECOMPRESSION } from '../js/config.js';

// === MOCK ENV ===
const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null
};

global.setTimeout = (cb) => { cb(); return 1; };
global.clearTimeout = () => {};

global.window = {
    requestIdleCallback: (cb) => cb(),
    cancelIdleCallback: () => {},
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    location: { reload: () => {}, pathname: '/test', href: 'http://localhost/test' }
};

global.console = {
    ...console,
    log: console.log,
    info: () => {},
    debug: () => {},
    warn: console.warn,
    error: console.error
};

// Mock Date for simulation
const realDate = Date;
let mockNow = realDate.now();

global.Date = class extends realDate {
    constructor(...args) {
        if (args.length === 0) return new realDate(mockNow);
        return new realDate(...args);
    }
    static now() {
        return mockNow;
    }
};

// Mock crypto for UUIDs
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    },
    writable: true
});

// === SIMULATION CONSTANTS ===
const MONTHS_TO_SIMULATE = 24;
const SESSIONS_PER_WEEK = 3;
const TOTAL_WEEKS = MONTHS_TO_SIMULATE * 4.33;
const TARGET_SESSIONS = Math.ceil(TOTAL_WEEKS * SESSIONS_PER_WEEK);

// === HELPER FUNCTIONS ===
function createSession(date, recovery) {
    return {
        id: crypto.randomUUID(),
        date: date.toISOString(),
        recoveryStatus: recovery,
        exercises: [],
        warmup: WARMUP.map(w => ({ id: w.id, completed: false, altUsed: '' })),
        cardio: { type: CARDIO_OPTIONS[0].name, completed: false },
        decompress: DECOMPRESSION.map(d => ({ id: d.id, val: null, completed: false, altUsed: '' }))
    };
}

// Mimic a page reload by clearing the in-memory cache
function simulateReload() {
    Storage._sessionCache = null;
    // We don't clear localStorage, that's persistent
}

async function runSimulation() {
    console.log(`Starting Comprehensive ${MONTHS_TO_SIMULATE}-month Simulation...`);

    const startDate = new realDate();
    startDate.setFullYear(startDate.getFullYear() - 2);
    let currentDate = new Date(startDate);
    mockNow = currentDate.getTime();

    let completedSessions = 0;
    let attemptedSessions = 0;
    let errors = 0;

    // Reset storage
    Storage.reset();

    // We iterate by "opportunities" to workout, not fixed session count
    // Assuming 3 opportunities per week for 24 months
    const opportunities = TARGET_SESSIONS;

    for (let i = 0; i < opportunities; i++) {
        attemptedSessions++;

        // 1. Simulate Life Events (Gaps)
        // 5% chance of missing a week (vacation, busy, etc)
        if (Math.random() < 0.05) {
            // Skip 7 days
            currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            mockNow = currentDate.getTime();
            // console.log(`[${i}] Missed week due to life event.`);
            continue;
        }

        mockNow = currentDate.getTime();

        // 2. Determine Recovery
        // 10% Red (Skip), 20% Yellow (Reduced), 70% Green
        const rVal = Math.random();
        let recovery = 'green';
        if (rVal < 0.10) recovery = 'red';
        else if (rVal < 0.30) recovery = 'yellow';

        if (recovery === 'red') {
            // User skips workout, maybe walks. Time advances.
            // console.log(`[${i}] Red recovery. Resting.`);
            const hoursToAdd = 48; // Standard gap
            currentDate = new Date(currentDate.getTime() + hoursToAdd * 60 * 60 * 1000);
            continue;
        }

        // 3. Start Session
        // Check Validator (might flag long gap)
        const check = Validator.canStartWorkout();

        let session = createSession(currentDate, recovery);
        Storage.saveDraft(session);

        // 4. Simulate Context Loss (Reload) during Warmup
        if (Math.random() < 0.1) {
            simulateReload();
            const draft = Storage.loadDraft();
            if (!draft) {
                console.error(`FAIL: Draft lost after reload at warmup step ${i}`);
                errors++;
            } else {
                session = draft; // Resume
            }
        }

        // Complete Warmup
        session.warmup.forEach(w => w.completed = true);
        Storage.saveDraft(session);

        // 5. Lifting Phase
        const sessions = Storage.getSessions();
        session.exercises = EXERCISES.map(ex => {
            let weight = Calculator.getRecommendedWeight(ex.id, recovery, sessions);

            // Calibration Logic
            if (weight === 0) weight = 45;

            // Long Gap Logic applied by human if Validator warned?
            if (check.warning) {
                weight = Math.round((weight * 0.9) / 2.5) * 2.5;
            }

            const isSuccess = Math.random() > 0.1; // 90% success rate
            const setsCompleted = isSuccess ? ex.sets : Math.floor(Math.random() * ex.sets);

            return {
                id: ex.id,
                name: ex.name,
                weight: weight,
                setsCompleted: setsCompleted,
                completed: setsCompleted === ex.sets,
                usingAlternative: false,
                skipped: false
            };
        });
        Storage.saveDraft(session);

        // 6. Simulate Context Loss (Reload) mid-workout
        if (Math.random() < 0.1) {
            simulateReload();
            const draft = Storage.loadDraft();
            if (!draft || !draft.exercises || draft.exercises.length === 0) {
                console.error(`FAIL: Exercises lost after reload at step ${i}`);
                errors++;
            } else {
                session = draft;
            }
        }

        // 7. Cardio & Decompress
        session.cardio.completed = true;
        session.decompress.forEach(d => d.completed = true);

        // 8. Finish
        Storage.saveSession(session);
        completedSessions++;

        // Advance time: 48h + random small variance
        currentDate = new Date(currentDate.getTime() + (48 + Math.random() * 4) * 60 * 60 * 1000);
        mockNow = currentDate.getTime();
    }

    // Final Analysis
    const history = Storage.getSessions();
    console.log(`Simulation Complete.`);
    console.log(`Attempts: ${attemptedSessions}`);
    console.log(`Completed Sessions: ${completedSessions} (History Size: ${history.length})`);

    if (history.length !== completedSessions) {
        console.error(`FAIL: History mismatch. Storage=${history.length}, Tracker=${completedSessions}`);
        errors++;
    }

    // Check progression
    const firstHinge = history.find(s => s.exercises.some(e => e.id === 'hinge'))?.exercises.find(e => e.id === 'hinge');
    const lastHinge = history[history.length-1]?.exercises.find(e => e.id === 'hinge');

    if (firstHinge && lastHinge) {
        console.log(`Hinge Progress: ${firstHinge.weight}lbs -> ${lastHinge.weight}lbs`);
        if (lastHinge.weight <= firstHinge.weight) {
            console.warn(`WARNING: No progress made. Check logic.`);
        }
    } else {
        console.error("FAIL: Could not find hinge history.");
        errors++;
    }

    if (errors === 0) {
        console.log('SUCCESS: Comprehensive Simulation Passed.');
        process.exit(0);
    } else {
        console.error(`FAIL: ${errors} errors detected.`);
        process.exit(1);
    }
}

runSimulation();
```

## Summarized Files
### `CLAUDE.md`
- **purpose:** Contextual info
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `Complete_Strength_Protocol.md`
- **purpose:** Contextual info
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `README.md`
- **purpose:** Contextual info
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `js/accessibility.js`
- **purpose:** Supporting cross-cutting concerns
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `js/i18n.js`
- **purpose:** Supporting cross-cutting concerns
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `js/observability.js`
- **purpose:** Supporting cross-cutting concerns
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_accessibility.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_accessibility_audit.js`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_app_lookup.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_audit_log.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_calculator.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_chart_logic.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_delete_session.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_get_last_non_deload.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_logger.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_lookup.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_plate_load.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_render_history_cache.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_render_nav.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_render_nav_skip.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_render_warmup_optimization.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_sanitize_json.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_sanitize_url.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_save_draft.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_save_session_lookup.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_save_session_real.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_storage.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_storage_reset.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/benchmark_storage_usage.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/simulation_mobile_gestures.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/test_alt_stats.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_app_render.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_correctness.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_e2e_flow.py`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_get_last_non_deload.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_history_pagination.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_input_zoom.html`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_optimization_last_session.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_plate_load.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_plate_load_lru.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_plate_load_precision.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_sanitize_url_cache_eviction.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_save_draft.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_save_session_volume.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_storage_reset.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_ui_decoupling.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

### `tests/verify_version_consistency.mjs`
- **purpose:** Repetitive test suites
- **key symbols/modules:** Supporting logic or tests.
- **omitted detail warning:** Specific implementation details and repetitive test assertions are omitted.

## Cross-File Relationships
- **startup wiring:** `index.html` loads all JS modules. `js/app.js` orchestrates DOM events and calls `Storage.load()`.
- **module relationships:** `App` coordinates `Core` (Storage/Calculator) and `Security` (Validator/Sanitizer).
- **API/data flow:** UI Interaction -> `app.js` -> `js/security.js` (validation) -> `js/core.js` (persistence) -> DOM update.
- **config/env flow:** Configuration constants in `js/constants.js` direct business logic across the app.
- **dependency hotspots:** `js/core.js` is central to state management.
- **test-to-implementation mapping:** `tests/verify_*.mjs` heavily validate `js/core.js` and `js/security.js`.

## Review Hotspots
- **likely correctness risks:** Plate calculator rounding issues, deload week edge cases.
- **security risks:** XSS from unsafe dynamic DOM updates (`innerHTML`).
- **performance risks:** Frequent string sanitization and DOM reflows on history render.
- **state/concurrency risks:** Draft recovery collision with current session.
- **error-handling gaps:** Silent catch blocks in Service Worker.
- **maintainability smells:** Large centralized files (`js/app.js` and `js/core.js`).

## Packaging Notes
- **exclusions:** Images, icons, lockfiles, `.git`, and node_modules are excluded to maintain brevity.
- **compression decisions:** JS Core files and large tests are excerpted. Utility/support scripts are summarized.
- **fidelity limits:** Function implementations in excerpted files are abridged, which reduces code reviewability for those specific functions.
