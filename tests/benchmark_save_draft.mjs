
import { Storage } from '../js/core.js';
import * as CONST from '../js/constants.js';

// Setup Mock Environment
const localStorageMock = {
    store: {},
    setItemCalls: [],
    getItemCalls: [],
    getItem(key) {
        // this.getItemCalls.push({ time: performance.now(), key });
        return this.store[key] || null;
    },
    setItem(key, value) {
        // Simulate cost: 0.5ms per 1KB
        const strVal = String(value);
        const blockingTime = (strVal.length / 1024) * 0.5;
        const end = performance.now() + blockingTime;
        while (performance.now() < end) {} // Busy wait to simulate blocking I/O

        this.store[key] = strVal;
        this.setItemCalls.push({ time: performance.now(), key, duration: blockingTime });
    },
    removeItem(key) { delete this.store[key]; },
    length: 0,
    key: (i) => null
};
global.localStorage = localStorageMock;

global.window = global;
global.window.location = { pathname: '/test', href: 'http://localhost/test' };
global.document = {
    createElement: () => ({ textContent: '', innerHTML: '' }),
    querySelector: () => null
};
Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'Node' },
    writable: true,
    configurable: true
});
global.alert = (msg) => console.log('ALERT:', msg);
global.confirm = () => true;

// Mock requestIdleCallback
global.requestIdleCallbackCalls = 0;
global.window.requestIdleCallback = (cb) => {
    global.requestIdleCallbackCalls++;
    return setTimeout(cb, 0);
};
global.window.cancelIdleCallback = (id) => clearTimeout(id);

async function run() {
    console.log("=== SaveDraft Benchmark ===");

    const draftSession = {
        id: 'draft-uuid',
        date: new Date().toISOString(),
        recoveryStatus: 'green',
        exercises: [
            { id: 'squat', name: 'Squat', weight: 100, setsCompleted: 3, completed: true },
            { id: 'bench', name: 'Bench Press', weight: 80, setsCompleted: 3, completed: true },
            { id: 'dl', name: 'Deadlift', weight: 120, setsCompleted: 3, completed: true }
        ]
    };

    // Make it a bit larger to simulate real world draft
    for(let i=0; i<50; i++) {
        draftSession.exercises.push({ id: `ex-${i}`, weight: 100 });
    }

    console.log(`Draft size: ${JSON.stringify(draftSession).length} chars`);

    // --- TEST: Rapid Updates ---
    console.log('\n--- Testing Rapid Updates (100 calls) ---');

    localStorageMock.setItemCalls = [];
    const start = performance.now();

    for(let i=0; i<100; i++) {
        draftSession.exercises[0].weight = 100 + i;
        Storage.saveDraft(draftSession);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`100 saveDraft calls took ${duration.toFixed(2)}ms`);
    console.log(`Average time per call: ${(duration/100).toFixed(2)}ms`);
    console.log(`Total synchronous setItem calls: ${localStorageMock.setItemCalls.length}`);

    if (localStorageMock.setItemCalls.length === 100) {
        console.log('BASELINE: Synchronous behavior confirmed (100 writes).');
    } else {
        console.log(`OPTIMIZED: Only ${localStorageMock.setItemCalls.length} writes occurred.`);
    }

}

run();
