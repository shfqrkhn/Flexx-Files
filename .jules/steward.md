## 2024-02-02 - [Sentinel] - [Core UI Decoupling]
**Protocol:** Core logic modules (`core.js`, `security.js`) MUST NOT contain direct UI calls (`alert`, `confirm`, `prompt`). All UI interactions must be lifted to the application layer (`app.js`) or handled via pure return values/exceptions.

## 2024-02-02 - [Bolt] - [Observability Standardization]
**Protocol:** Use the `Logger` module for all system output. Direct `console` calls are forbidden in production code to ensure structured logging and persistence.
