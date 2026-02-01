# CLAUDE.md - AI Assistant Guide for Flexx Files

## Project Overview

**Flexx Files** is a privacy-first, offline-first Progressive Web App (PWA) for strength training tracking with automatic weight progression. The application runs entirely in the browser with zero external dependencies and no server-side components.

- **Version**: 3.9.32
- **Storage Version**: v3
- **License**: MIT

### Core Principles

1. **Privacy-First**: All data stays on-device in localStorage. Zero external tracking or analytics.
2. **Offline-First**: Full functionality without internet via Service Worker caching.
3. **Zero Dependencies**: Vanilla JavaScript ES6 modules, no npm, no build tools.
4. **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support.

---

## Repository Structure

```
/
├── index.html           # Single-page application entry point
├── manifest.json        # PWA manifest for installability
├── sw.js               # Service Worker for offline caching
├── favicon.ico         # App icon
│
├── css/
│   └── styles.css      # All application styles (CSS variables, dark theme)
│
├── js/
│   ├── app.js          # Main application logic, UI rendering, state management
│   ├── core.js         # Storage, Calculator, Validator - data layer
│   ├── config.js       # Exercise definitions, warmups, cardio, decompression
│   ├── constants.js    # All magic numbers and configuration values
│   ├── security.js     # Sanitizer, Validator, CSP, AuditLog, IntegrityChecker
│   ├── observability.js # Logger, Metrics, Analytics, ErrorTracker
│   ├── accessibility.js # Keyboard navigation, screen reader, ARIA, focus management
│   └── i18n.js         # Internationalization framework
│
├── tests/
│   ├── verify_correctness.mjs   # Core functionality tests
│   ├── simulation_24_months.mjs # Long-term progression simulation
│   ├── benchmark_*.mjs          # Performance benchmarks
│   └── test_alt_stats.mjs       # Alternative exercise statistics
│
├── assets/
│   ├── icon-192.png    # PWA icon (192x192)
│   └── icon-512.png    # PWA icon (512x512)
│
└── .jules/
    └── steward.md      # Protocol learnings (modal accessibility, touch targets, etc.)
```

---

## Architecture

### Application Flow

```
index.html
    └── app.js (main entry point)
            ├── config.js (exercise definitions)
            ├── constants.js (configuration values)
            ├── core.js (Storage, Calculator, Validator)
            ├── security.js (Sanitizer, Validator)
            ├── observability.js (Logger, Metrics)
            ├── accessibility.js (KeyboardNav, ScreenReader)
            └── i18n.js (translations)
```

### State Management

Application state is managed in `js/app.js` via the `State` object:

```javascript
const State = {
    view: 'today',           // Current view: today, history, progress, settings, protocol
    phase: null,             // Workout phase: warmup, lifting, cardio, decompress
    recovery: null,          // Recovery status: green, yellow, red
    activeSession: null,     // Current workout session data
    historyLimit: 20         // Pagination for history view
};
```

### Data Storage

Data is stored in localStorage with the prefix `flexx_`:

- `flexx_sessions_v3` - All workout sessions (array)
- `flexx_prefs` - User preferences
- `flexx_draft_session` - Auto-saved session draft for crash recovery
- `flexx_errors` - Persisted error logs
- `flexx_audit_log` - Security audit events

**Atomic Transactions**: The Storage module supports transactions with rollback capability via `Storage.Transaction.begin()`, `commit()`, and `rollback()`.

---

## Key Modules

### `js/core.js` - Data Layer

**Storage**: Session CRUD operations with atomic transactions
- `getSessions()` - Returns cached sessions array
- `saveSession(session)` - Validates and saves with transaction safety
- `deleteSession(id)` - Removes session by ID
- `exportData()` / `importData(json)` - Backup/restore functionality
- `saveDraft()` / `loadDraft()` - Auto-save for crash recovery

**Calculator**: Weight progression logic
- `getRecommendedWeight(exerciseId, recoveryStatus, sessions)` - Core progression algorithm
- `isDeloadWeek(sessions)` - Check if current week is deload (every 6 weeks)
- `detectStall(exerciseId, sessions)` - Detect 3 consecutive failures at same weight
- `getPlateLoad(weight)` - Calculate plates per side for barbell

**Validator**: Workout rules
- `canStartWorkout()` - Enforce 24-48 hour rest period

### `js/security.js` - Security Layer

**Sanitizer**: Input sanitization
- `sanitizeHTML(html)` - XSS prevention
- `sanitizeString(str)` - Escape dangerous characters
- `sanitizeURL(url)` - Validate URL protocols (only http/https)
- `scrubSession(session)` - Schema enforcement via allowlist

**Validator**: Data structure validation
- `validateSession(session)` - Full session validation
- `validateExercise(exercise)` - Exercise object validation
- `validateImportData(data)` - Import file validation

### `js/observability.js` - Monitoring

**Logger**: Structured logging with levels (DEBUG, INFO, WARN, ERROR, CRITICAL)
**Metrics**: Performance timing with `mark()` and `measure()`
**Analytics**: Privacy-preserving local event tracking

### `js/accessibility.js` - WCAG 2.1 AA

**KeyboardNav**: Tab trapping, Escape to close modals, arrow key navigation
**ScreenReader**: ARIA live region announcements
**FocusManager**: Focus stack for modal focus restoration
**MotionPreference**: Respects `prefers-reduced-motion`

---

## Workout Structure

Each workout follows a 4-phase structure defined in `js/config.js`:

1. **Warmup** (5 exercises): Thoracic rotations, KB swings, halos, prying, jump rope
2. **Lifting** (9 exercises): Hinge, knee, H-push, incline push, V-push, pull, vertical pull, carry, calves
3. **Cardio** (5 minutes): Assault bike, rower, or treadmill incline
4. **Decompression** (2 exercises): Dead hang, box breathing

### Progression Rules (from `js/constants.js`)

- **Weight increment**: +5 lbs on successful completion
- **Deload week**: Every 6 weeks, reduce to 60%
- **Stall detection**: 3 consecutive failures at same weight triggers 10% reduction
- **Yellow recovery**: 90% of prescribed weight
- **Rest period**: 24-48 hours between workouts

---

## Development Workflow

### Running Tests

Tests use Node.js with ESM modules. No test framework required.

```bash
# Run correctness tests
node tests/verify_correctness.mjs

# Run 24-month simulation
node tests/simulation_24_months.mjs

# Run benchmarks
node tests/benchmark_calculator.mjs
node tests/benchmark_storage.mjs
```

**Important**: Test mocks must include:
```javascript
global.window = global;
global.window.location = { pathname: '/test', href: 'http://localhost/test' };
global.window.requestIdleCallback = (cb) => setTimeout(cb, 0);
global.window.cancelIdleCallback = (id) => clearTimeout(id);
```

### Local Development

This is a static site with no build step:

```bash
# Serve with any static server
python -m http.server 8000
# or
npx serve .
```

Access at `http://localhost:8000`

### Service Worker Updates

The service worker (`sw.js`) uses a cache-first strategy. To force updates:

1. Update `CACHE_NAME` in `sw.js` to match version (e.g., `flexx-v3.9.33`)
2. Update `APP_VERSION` in `js/constants.js`
3. Clear browser cache or hard refresh

---

## Coding Conventions

### JavaScript

- **ES6 Modules**: All files use `import`/`export`
- **No Build Tools**: Code runs directly in browser
- **No External Dependencies**: Vanilla JS only
- **Optimization Comments**: Use `// Optimization:` prefix for performance notes
- **Security Comments**: Use `// Sentinel:` or `// SECURITY:` for security-critical code

### Performance Patterns

1. **WeakMap Caching**: Calculator uses WeakMap keyed by sessions array for O(1) cache invalidation
2. **Incremental Updates**: Cache supports append/replace/delete without full rebuild
3. **Non-blocking I/O**: Storage uses `requestIdleCallback` for async persistence
4. **Event Delegation**: Global click handler on `#main-content` for delete buttons

### Security Patterns

1. **Input Sanitization**: All user input passes through `Sanitizer`
2. **Schema Enforcement**: `scrubSession()` allowlists fields before persistence
3. **URL Validation**: Only `http://` and `https://` protocols allowed
4. **CSP**: Content Security Policy defined in HTML meta tag

### Accessibility Patterns

1. **ARIA Labels**: All interactive elements have descriptive labels
2. **Focus Management**: Modal traps focus, restores on close
3. **Screen Reader**: `ScreenReader.announce()` for dynamic content
4. **Touch Targets**: Minimum 44x44px touch targets on mobile

---

## Common Tasks

### Adding a New Exercise

Edit `js/config.js`:

```javascript
export const EXERCISES = [
    // ... existing exercises
    {
        id: 'new_exercise',
        name: 'Exercise Name',
        category: 'CATEGORY',
        sets: 3,
        reps: 10,
        video: 'https://youtube.com/...',
        alternatives: ['Alt 1', 'Alt 2'],
        altLinks: {
            'Alt 1': 'https://youtube.com/...',
            'Alt 2': 'https://youtube.com/...'
        }
    }
];
```

### Modifying Progression Constants

Edit `js/constants.js`:

```javascript
export const WEIGHT_INCREMENT_LBS = 5;    // Weight increase on success
export const DELOAD_WEEK_INTERVAL = 6;    // Deload every N weeks
export const DELOAD_PERCENTAGE = 0.6;     // 60% for deload week
export const STALL_DELOAD_PERCENTAGE = 0.9;
```

### Adding a Translation

Edit `js/i18n.js` and add a new locale object:

```javascript
const translations = {
    en: { /* existing */ },
    es: {
        app: { name: 'Flexx Files', tagline: 'Rastreador de Fuerza Sin Conexion' },
        // ... all other translation keys
    }
};
```

---

## Session Data Schema

```typescript
interface Session {
    id: string;              // UUID v4
    date: string;            // ISO 8601 timestamp
    recoveryStatus: 'green' | 'yellow' | 'red';
    sessionNumber: number;   // Sequential session count
    weekNumber: number;      // Calculated from sessionNumber
    totalVolume: number;     // Sum of weight * sets * reps
    exercises: Exercise[];
    warmup: WarmupItem[];
    cardio: { type: string; completed: boolean };
    decompress: DecompressItem[];
}

interface Exercise {
    id: string;              // e.g., 'hinge', 'knee', 'push_horz'
    name: string;            // Display name
    weight: number;          // Weight in lbs
    setsCompleted: number;   // 0-3
    completed: boolean;      // All sets done
    usingAlternative: boolean;
    altName?: string;        // Alternative exercise name
    skipped?: boolean;
}
```

---

## Error Handling

- **Render Errors**: Caught and displayed in UI with recovery instructions
- **Storage Corruption**: `_isCorrupted` flag prevents further writes
- **Transaction Failures**: Automatic rollback via `Storage.Transaction`
- **Import Validation**: Strict schema validation before overwriting data

---

## Protocol Learnings (from `.jules/steward.md`)

1. **Test Mocks**: Include `window.location` with `pathname` and `href` for Logger tests
2. **Modal Accessibility**: Toggle `aria-hidden` and manage focus on open/close
3. **User Override**: No blocking states without escape hatch ("Train Anyway" buttons)
4. **Touch Targets**: Use `touch-action: manipulation` and 44x44px minimum size

---

## Version History

The app version is tracked in `js/constants.js` as `APP_VERSION` and in `sw.js` as `CACHE_NAME`.

When updating versions:
1. Update `APP_VERSION` in `js/constants.js`
2. Update `CACHE_NAME` in `sw.js` to match
3. If storage schema changes, update `STORAGE_VERSION` and add migration in `Storage.runMigrations()`
