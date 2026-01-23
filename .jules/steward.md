# The Black Box Journal

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

**Protocol:**
- NEVER expose raw error messages from exceptions in user-facing alerts
- ALWAYS use pre-sanitized ERROR_MESSAGES constants for user communication
- ALWAYS log technical details via secure Logger system for debugging
- Sensitive paths: data import/export, migrations, authentication flows

**Files Modified:**
- `js/core.js:161` - Migration error handling
- `js/core.js:356` - Import error handling

**Verification:** Security tests pass; no sensitive data exposure in user alerts.
