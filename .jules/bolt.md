## 2024-05-22 - [JSON.parse in Hot Paths]
**Learning:** `localStorage.getItem` combined with `JSON.parse` is extremely expensive (~4ms for 1000 items) and should never be called in a render loop or frequent calculation.
**Action:** Always cache parsed `localStorage` data in memory and only invalidate on writes.

## 2025-05-25 - [Array Cloning in List Rendering]
**Learning:** `array.slice().reverse()` creates a full copy of the array. For large datasets (e.g., 5000+ sessions), this O(N) operation causes significant GC pressure and latency (120ms vs 1.5ms) just to render the top 20 items.
**Action:** Use reverse iteration (`for (let i=len-1; i>=0; i--)`) to extract only the needed items (O(limit)) instead of transforming the entire dataset.
