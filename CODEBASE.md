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
README.md
css/styles.css
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
| `css/styles.css` | View/UI | Important | Excerpt | UI entry and styling |
| `favicon.ico` | Asset/Generated | Context | Excluded | Not behaviorally significant |
| `index.html` | View/UI | Important | Excerpt | UI entry and styling |
| `js/accessibility.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/app.js` | Core Logic | Critical | Excerpt | Core flow logic and persistence |
| `js/config.js` | Config/Settings | Critical | Full | Core business settings |
| `js/constants.js` | Config/Settings | Critical | Full | Core business settings |
| `js/core.js` | Core Logic | Critical | Excerpt | Core flow logic and persistence |
| `js/i18n.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/observability.js` | Supporting Logic | Important | Summary | Supporting cross-cutting concerns |
| `js/security.js` | Core Logic | Critical | Excerpt | Core flow logic and persistence |
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
| `tests/simulation_24_months.mjs` | Test | Important | Excerpt | Representative test |
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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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

/* ... [EXCERPTED] ... */

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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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
    show(opts) {
        return new Promise((resolve) => {
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
            return;
        }
        this.el.classList.remove('active');
        this.el.setAttribute('aria-hidden', 'true');
        if (this.resolve) this.resolve(res);
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

// ... [EXCERPTED IMPLEMENTATION] ...

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
export const APP_VERSION = '3.9.66';
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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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

// ... [EXCERPTED IMPLEMENTATION] ...

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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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

// ... [EXCERPTED IMPLEMENTATION] ...

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
  "version": "3.9.66",
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
const CACHE_NAME = 'flexx-v3.9.66';
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
- **inclusion mode:** Excerpt
- **note:** Excerpted top and bottom regions to preserve module signature and initialization.
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

// ... [EXCERPTED IMPLEMENTATION] ...

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