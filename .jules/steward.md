## 2024-02-02 - [Sentinel] - [Core UI Decoupling]
**Protocol:** Core logic modules (`core.js`, `security.js`) MUST NOT contain direct UI calls (`alert`, `confirm`, `prompt`). All UI interactions must be lifted to the application layer (`app.js`) or handled via pure return values/exceptions.

## 2024-02-02 - [Bolt] - [Observability Standardization]
**Protocol:** Use the `Logger` module for all system output. Direct `console` calls are forbidden in production code to ensure structured logging and persistence.

## 2026-02-08 - [Sentinel] - [Error Persistence Integrity]
**Protocol:** When serializing or logging `Error` objects, explicitly capture non-enumerable properties (`name`, `message`) before iteration. `for..in` loops are insufficient for native Errors.

## 2026-02-09 - [Palette] - [Transient State Resilience]
**Protocol:** Progression logic MUST distinguish between permanent regression (injury, stall) and transient constraint (recovery, scheduling). Temporary constraints should not permanently degrade the baseline performance metric once the constraint is lifted.

## 2026-02-09 - [Bolt] - [Interpolation Efficiency]
**Protocol:** Interpolation logic MUST bypass complex operations (Regex) for static inputs (empty params) to maintain O(1) performance in render loops.
