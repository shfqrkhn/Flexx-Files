## 2024-05-22 - [JSON.parse in Hot Paths]
**Learning:** `localStorage.getItem` combined with `JSON.parse` is extremely expensive (~4ms for 1000 items) and should never be called in a render loop or frequent calculation.
**Action:** Always cache parsed `localStorage` data in memory and only invalidate on writes.
