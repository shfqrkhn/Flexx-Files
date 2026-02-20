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

## 2026-02-15 - [Bolt] - [Cached History Lookups]
**Protocol:** All history lookup functions in `Calculator` MUST be O(1) via the `_ensureCache` mechanism. Linear scans (O(N)) are forbidden for core rendering loops.

## 2026-02-18 - [Bolt] - [Render Caching]
**Protocol:** Expensive render functions (string generation/sanitization) MUST be memoized (e.g. `WeakMap`) if they are called repeatedly on immutable data structures.

## 2026-02-23 - [Bolt] - [Storage Optimization]
**Protocol:** Cache large storage values (e.g. sessions JSON length) in memory to avoid repeated deserialization/allocation during quota checks.
