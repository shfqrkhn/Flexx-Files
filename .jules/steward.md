# The Black Box Journal

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
