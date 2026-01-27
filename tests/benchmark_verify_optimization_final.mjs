
import { performance } from 'perf_hooks';

// Mocks
global.window = { location: { reload: () => {} }, crypto: { subtle: { digest: async () => {} } } };
global.document = { createElement: () => ({ innerHTML: '', textContent: '' }), querySelector: () => null };
try { Object.defineProperty(global, 'navigator', { value: { userAgent: 'Benchmark/1.0' }, writable: true, configurable: true }); } catch (e) {}
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, key: () => null, length: 0 };
global.alert = () => {}; global.confirm = () => true;

import { Calculator } from '../js/core.js';
import { EXERCISES } from '../js/config.js';

function generateSession(id, date, exerciseCount = 5) {
    const exercises = EXERCISES.slice(0, exerciseCount).map(ex => ({
        id: ex.id, name: ex.name, weight: 100, setsCompleted: 3, completed: true, skipped: false, usingAlternative: false
    }));
    return { id: `session-${id}`, date: new Date(date).toISOString(), recoveryStatus: 'green', exercises };
}

function generateHistory(count) {
    const sessions = [];
    const startDate = new Date('2023-01-01');
    for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        sessions.push(generateSession(i, date));
    }
    return sessions;
}

const HISTORY_SIZE = 1000;

async function runBenchmark() {
    const history = generateHistory(HISTORY_SIZE);
    const newSession = generateSession(HISTORY_SIZE, new Date());
    const newHistory = [...history, newSession];

    // Scenario 2: With Optimization (Stable Cache Parent Lookup)
    Calculator._cache = new WeakMap();
    Calculator._stableCache = new Map();
    Calculator._lastSessions = null;

    // Warmup: Process 'history'. This populates _stableCache with { lookup, lastRef }.
    Calculator._ensureCache(history);

    // Context Switch: Clear WeakMap and LastSessions, BUT KEEP _stableCache.
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;

    const start = performance.now();
    Calculator._ensureCache(newHistory); // Should hit Parent Lookup
    const end = performance.now();
    console.log(`[Optimized] Append with Context Lost: ${(end - start).toFixed(3)} ms`);
}

runBenchmark().catch(console.error);
