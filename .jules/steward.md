# The Black Box Journal

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
