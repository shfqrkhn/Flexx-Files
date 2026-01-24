# The Black Box Journal

## 2026-01-23 - [⚡ Bolt] - Uncleaned Interval Causing Resource Leak

**Insight:** The draft auto-save interval (line 790) was created during app initialization but never cleaned up, causing progressive memory/resource leaks. The interval continued running indefinitely even after page navigation, errors, or tab backgrounding, wasting CPU cycles every 30 seconds checking `State.activeSession`.

**Protocol:**
- ALWAYS store interval/timeout IDs when created in initialization code
- ALWAYS register cleanup handlers using `beforeunload` event for page-level intervals
- Perform final critical operations (like draft save) in cleanup handler to prevent data loss
- Pattern: `const intervalId = setInterval(...); window.addEventListener('beforeunload', () => clearInterval(intervalId));`

**Files Modified:**
- `js/app.js:790-805` - Stored interval ID and added beforeunload cleanup handler

**Verification:** Syntax check passes; regression tests pass (10/10); resource properly cleaned on page unload.

---

## 2026-01-23 - [🛡️ Sentinel] - Insufficient URL Protocol Validation

**Insight:** The `Sanitizer.sanitizeURL()` function relied solely on `new URL()` parsing followed by protocol allowlist checking. This created bypass vulnerabilities through encoding attacks (e.g., `java\tscript:`, `java\nscript:`) and dangerous data URIs that could execute code when users clicked video links. The function protects 15+ call sites throughout the app—a single bypass point with wide blast radius.

**Protocol:**
- ALWAYS perform pre-validation of URL protocols BEFORE URL parsing using regex extraction
- Normalize whitespace and control characters (`\x00-\x1F\x7F`) that could hide malicious protocols
- Use lowercase protocol matching to prevent case-sensitivity bypasses
- Maintain explicit denylist of dangerous protocols: `javascript`, `data`, `vbscript`, `file`, `about`
- Double-check protocol after parsing (defense-in-depth)
- Return normalized `parsed.href` instead of raw input to prevent residual encoding issues

**Files Modified:**
- `js/security.js:67-105` - Enhanced sanitizeURL with pre-validation and normalization
- `tests/mocks.mjs:56-62` - Fixed URL constructor mock for test compatibility
- `tests/url_sanitization.test.js` - Added 18-test suite covering encoding bypasses

**Verification:** All 18 URL sanitization tests pass; dangerous protocols blocked before parsing; encoding bypasses prevented.

---

## 2026-01-23 - [🛡️ Sentinel] - Missing Session Validation in saveSession()

**Insight:** The `saveSession()` function in core.js performed NO validation on session data before persisting to localStorage. It immediately executed `.reduce()` on `session.exercises` (line 228) without verifying the session structure, required fields, or data types. This created a critical integrity gap where malformed or malicious session objects could corrupt storage or crash the application.

**Protocol:**
- ALWAYS validate session data structure using `SecurityValidator.validateSession()` BEFORE any storage operation
- Defense-in-depth: validate at BOTH import boundaries AND runtime save operations
- Fail-fast: reject invalid sessions at transaction entry point before any mutations
- Critical validation points: saveSession(), importData(), and any direct storage writes

**Files Modified:**
- `js/core.js:211-217` - Added validation guard with SecurityValidator

**Verification:** Security validation test suite passes (10/10); invalid sessions now rejected before storage corruption.

---

## 2026-01-23 - [🛡️ Sentinel] - Information Disclosure in Error Messages

**Insight:** Error messages were exposing technical implementation details (`${e.message}`) directly to users via `alert()` in critical data handling paths (migration and import functions). This leaks internal system information that could aid attackers in reconnaissance.

**Update (Cycle #3):** Discovered line 351 was exposing validation error details: `alert(\`Invalid file:\\n\${validation.errors.join('\\n')}\`)`. This leaked session data structure requirements, field validation rules, and internal error handling logic—critical reconnaissance information.

**Protocol:**
- NEVER expose raw error messages from exceptions in user-facing alerts
- ALWAYS use pre-sanitized ERROR_MESSAGES constants for user communication
- ALWAYS log technical details via console.error for debugging (secure logging)
- Sensitive paths: data import/export, migrations, authentication flows
- Pattern: Generic user message + detailed console.error logging

**Files Modified:**
- `js/core.js:161` - Migration error handling
- `js/core.js:351-353` - Import validation error handling (Cycle #3 fix)
- `tests/import_error_disclosure.test.js` - Added test suite verifying generic errors shown to users

**Verification:** Import error disclosure test passes (3/3); technical details logged securely, generic message shown to users.

## 2026-01-23 - [🛡️ Sentinel] - Unvalidated Optional Session Fields

**Insight:** While session structure was validated, optional fields in exercises (`setsCompleted`, `completed`, `usingAlternative`, `altName`, `skipped`) and warmup (`altUsed`) were not type-checked. This allowed malformed data (e.g. string for `setsCompleted`) to persist, potentially leading to data corruption or unexpected behavior.

**Protocol:**
- ALWAYS validate optional fields with strict type checks if they are present.
- Use explicit type guards (`typeof x === 'number'`) for all data properties.
- Ensure regression tests cover invalid optional fields.

**Files Modified:**
- `js/security.js:168-174, 221-238` - Added strict type checks for optional fields in Validator
- `tests/validation_suite.test.js` - Fixed regression test execution environment
- `tests/security_validation_fix.test.js` - Added test cases for invalid optional fields

**Verification:** Regression tests pass (10/10); new security validation tests pass (15/15); bad data confirmed rejected.

---

## 2026-01-24 - [🛡️ Sentinel] - Inconsistent URL Sanitization at Render Boundaries

**Insight:** URL sanitization was applied inconsistently across the codebase. Dynamic URL update functions (`swapAlt()` at line 460, `swapCardioLink()` at line 484) correctly used `Sanitizer.sanitizeURL()`, but initial render functions (`renderWarmup()`, `renderLifting()`, `renderCardio()`, `renderDecompress()`) directly injected config URLs into href attributes without sanitization. This created a defense-in-depth vulnerability where config tampering (supply chain attack, code injection) could inject malicious `javascript:` protocol URLs that bypass CSP via user clicks.

**Protocol:**
- ALWAYS apply URL sanitization at ALL render boundaries, not just dynamic updates
- Defense-in-depth principle: sanitize even "trusted" config data at output boundaries
- Pattern: Use `Sanitizer.sanitizeURL()` for EVERY href attribute assignment, regardless of data source
- Security controls must be applied systematically, not selectively based on perceived trust level
- Code review focus: verify sanitization is consistent across initial renders AND dynamic updates

**Files Modified:**
- `js/app.js:217` - Warmup video links now sanitized
- `js/app.js:249` - Exercise video links now sanitized
- `js/app.js:277` - Cardio video links now sanitized
- `js/app.js:291` - Decompression video links now sanitized

**Verification:** URL sanitization test suite passes (18/18); all video href attributes now use Sanitizer.sanitizeURL(); defense-in-depth enforced consistently.

---

## 2026-01-24 - [⚡ Bolt] - Incomplete Service Worker Cache Breaking Offline Capability

**Insight:** The service worker cache (sw.js:2-6) only included 3 of 8 JS modules required by the app. Missing modules: `accessibility.js`, `constants.js`, `i18n.js`, `observability.js`, `security.js`. When users went offline, the app would load index.html and app.js successfully from cache, but fail when app.js attempted to import the missing modules, causing complete app failure. The app claimed "Offline-first" capability but was critically broken offline.

**Protocol:**
- ALWAYS audit service worker ASSETS array against actual dependency graph
- NEVER assume cache completeness - verify ALL transitive dependencies are included
- When adding new JS modules to the app, ALWAYS update sw.js ASSETS array
- Pattern: Run dependency analysis (`grep -h "^import.*from" js/*.js | sort -u`) to verify all imports are cached
- ALWAYS bump cache version (CACHE_NAME) when updating ASSETS to force refresh on existing installations
- Test offline: Use DevTools Network → Offline mode to verify app loads without network

**Files Modified:**
- `sw.js:1-7` - Added 5 missing modules to ASSETS array, bumped cache version to v3.9.3

**Verification:** Manual verification in DevTools Network Offline mode; all ES6 module imports resolve from cache; app functions completely offline.

---

## 2026-01-24 - [🛡️ Sentinel] - XSS Vulnerability via Inline Event Handlers with Insufficient Sanitization

**Insight:** The history view delete button (app.js:328) used an inline `onclick` handler with string interpolation: `onclick="window.del('${x.id.replace(/['"\\]/g, '')}')"`. The `.replace(/['"\\]/g, '')` sanitization was critically insufficient—it only stripped quotes and backslashes but could be bypassed with:
- Unicode escape sequences (`\u0027` = single quote)
- Template literal context breaks
- Hex escapes (`\x27` = single quote)

This created a CRITICAL XSS vector where a crafted session ID could execute arbitrary JavaScript. The inline onclick pattern undermines CSP protections (requires `unsafe-inline`) and creates injection points throughout the template string rendering.

**Protocol:**
- NEVER use inline event handlers (`onclick`, `onload`, etc.) with dynamic data
- ALWAYS use event delegation with data attributes for user-generated or dynamic content
- Pattern: `data-*` attributes + `addEventListener` on container element
- For delete/action buttons: `<button data-id="${id}" class="action-btn">` + `container.addEventListener('click', e => { const btn = e.target.closest('.action-btn'); if (btn) handle(btn.dataset.id); })`
- Defense-in-depth: This pattern also enables CSP without `unsafe-inline`, further hardening XSS protections
- Code review focus: grep for `onclick=.*\${` patterns and replace with event delegation

**Files Modified:**
- `js/app.js:328` - Removed inline onclick, added `btn-delete-session` class and `data-session-id` attribute
- `js/app.js:356-363` - Added event delegation listener for delete buttons in renderHistory()

**Verification:** JavaScript syntax check passes; delete functionality preserved; XSS vector eliminated through architectural change from inline handlers to event delegation.
