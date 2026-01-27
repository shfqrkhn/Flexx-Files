
import { performance } from 'perf_hooks';

// Mocks
global.window = {
    location: { reload: () => {} },
    crypto: { subtle: { digest: async () => {} } }
};
global.document = {
    createElement: () => ({ innerHTML: '', textContent: '' }),
    querySelector: () => null
};

// Handle navigator safely
try {
    Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Benchmark/1.0' },
        writable: true,
        configurable: true
    });
} catch (e) {
    console.warn("Could not mock navigator:", e);
}


global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    key: () => null,
    length: 0
};
global.alert = () => {};
global.confirm = () => true;

// Import module under test
import { Calculator, Storage } from '../js/core.js';
import { EXERCISES } from '../js/config.js';

console.log("Starting Benchmark...");

// Helpers
function generateSession(id, date, exerciseCount = 5) {
    const exercises = EXERCISES.slice(0, exerciseCount).map(ex => ({
        id: ex.id,
        name: ex.name,
        weight: 100 + Math.random() * 50,
        setsCompleted: 3,
        completed: true,
        skipped: false,
        usingAlternative: false
    }));

    return {
        id: `session-${id}`,
        date: new Date(date).toISOString(),
        recoveryStatus: 'green',
        exercises
    };
}

function generateHistory(count) {
    const sessions = [];
    const startDate = new Date('2023-01-01');
    for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i * 2); // Every 2 days
        sessions.push(generateSession(i, date));
    }
    return sessions;
}

// Benchmark Config
const HISTORY_SIZE = 5000;
const ITERATIONS = 100;

async function runBenchmark() {
    const history = generateHistory(HISTORY_SIZE);

    // Warmup
    Calculator._ensureCache(history);

    // 1. Initial Scan (Simulate page load / first calc)
    // We clear cache to force scan
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;
    Calculator._lastLookup = null;

    let start = performance.now();
    Calculator._ensureCache(history);
    let end = performance.now();
    console.log(`Initial Full Scan (${HISTORY_SIZE} sessions): ${(end - start).toFixed(3)} ms`);

    // 2. Incremental Update (Append 1 session)
    // This represents adding a new workout
    const newSession = generateSession(HISTORY_SIZE, new Date());
    const newHistory = [...history, newSession];

    // Reset to "Before Append" state
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;
    Calculator._lastLookup = null;
    Calculator._ensureCache(history);

    start = performance.now();
    Calculator._ensureCache(newHistory);
    end = performance.now();
    console.log(`Incremental Append (1 session): ${(end - start).toFixed(3)} ms`);

    // 3. Non-Incremental Update (e.g. modify old session)
    // This forces full rescan in current implementation
    const modifiedHistory = [...history];
    modifiedHistory[0] = { ...modifiedHistory[0], recoveryStatus: 'red' }; // Change something

    // Reset to initial state
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;
    Calculator._lastLookup = null;
    Calculator._ensureCache(history);

    start = performance.now();
    Calculator._ensureCache(modifiedHistory);
    end = performance.now();
    console.log(`Non-Incremental Update (Modify 1st session): ${(end - start).toFixed(3)} ms`);

    // 4. Remove Last Session (Undo)
    const shortHistory = history.slice(0, -1);

    // Reset to initial state
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;
    Calculator._lastLookup = null;
    Calculator._ensureCache(history);

    start = performance.now();
    Calculator._ensureCache(shortHistory);
    end = performance.now();
    console.log(`Remove Last Session (Undo): ${(end - start).toFixed(3)} ms`);

    // 5. Stress Test: Rapid toggling (which creates new arrays)
    // Simulate toggling "completed" on the last session multiple times
    // Current implementation: changing last session should technically TRIGGER INCREMENTAL UPDATE?
    // Let's check the logic:
    // sessions.length === this._lastSessions.length + 1
    // If we MODIFY last session, length is SAME. So it falls back to full scan.

    console.log(`\nStress Test: 100 rapid updates to last session...`);
    let currentHistory = history;

    // Setup initial state
    Calculator._cache = new WeakMap();
    Calculator._lastSessions = null;
    Calculator._lastLookup = null;
    Calculator._ensureCache(currentHistory);

    start = performance.now();
    for (let i = 0; i < 100; i++) {
        // Create new array with modified last session
        const lastSession = currentHistory[currentHistory.length - 1];
        const updatedLast = { ...lastSession, completed: !lastSession.completed };
        const nextHistory = [...currentHistory];
        nextHistory[nextHistory.length - 1] = updatedLast; // Same length

        Calculator._ensureCache(nextHistory);
        currentHistory = nextHistory;
    }
    end = performance.now();
    console.log(`Rapid Updates Total Time: ${(end - start).toFixed(3)} ms`);
    console.log(`Average per update: ${((end - start) / 100).toFixed(3)} ms`);
}

runBenchmark().catch(console.error);
