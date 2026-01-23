
// Mock browser globals
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
            delete store[key];
        }
    };
})();

global.window = {
    location: { pathname: '/test', reload: () => {} },
    crypto: {
        subtle: {
            digest: async () => new ArrayBuffer(32)
        }
    },
    matchMedia: () => ({ matches: false, addEventListener: () => {} })
};
global.navigator = {
    userAgent: 'NodeJS Test',
    platform: 'NodeJS',
    onLine: true,
    vibrate: () => {},
    language: 'en-US'
};
global.localStorage = localStorageMock;
global.document = {
    createElement: () => ({
        textContent: '',
        innerHTML: '',
        setAttribute: () => {},
        classList: { add: () => {}, remove: () => {} },
        addEventListener: () => {},
        click: () => {}
    }),
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { appendChild: () => {}, classList: { add: () => {}, remove: () => {} }, insertBefore: () => {} },
    documentElement: { setAttribute: () => {} },
    addEventListener: () => {}
};
global.performance = {
    now: () => Date.now(),
    memory: { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 }
};
global.Blob = class Blob {};
global.URL = { createObjectURL: () => '', revokeObjectURL: () => '' };

// Test Runner
async function runTests() {
    console.log('🚀 Starting Mission-Critical Validation Suite...\n');
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            failed++;
        }
    };

    try {
        // Load Modules
        const { Storage, Calculator, Validator } = await import('../js/core.js');
        const { Logger } = await import('../js/observability.js');

        // === ARCHITECTURAL RIGOR ===
        console.log('\n--- Architectural Rigor ---');

        // 1. Idempotency: Save same session twice
        Storage.reset();
        const session = {
            id: 'test-uuid-123',
            date: new Date().toISOString(),
            recoveryStatus: 'green',
            exercises: [{ id: 'hinge', name: 'Deadlift', weight: 100, setsCompleted: 3, completed: true }]
        };

        Storage.saveSession({ ...session });
        const firstSave = Storage.getSessions();
        assert(firstSave.length === 1, 'First save successful');

        Storage.saveSession({ ...session });
        const secondSave = Storage.getSessions();
        assert(secondSave.length === 1, 'Idempotency verified: Duplicate save did not create new record');
        assert(secondSave[0].id === session.id, 'Session ID preserved');

        // 2. Atomicity/Rollback: Transaction failure
        console.log('Testing Transaction Rollback...');
        const initialData = JSON.stringify(Storage.getSessions());

        // Manually trigger a transaction that fails midway (simulated)
        Storage.Transaction.begin();
        localStorage.setItem(Storage.KEYS.SESSIONS, 'CORRUPTED_DATA');
        Storage.Transaction.rollback();

        const restoredData = JSON.stringify(Storage.getSessions());
        assert(initialData === restoredData, 'Atomicity verified: Rollback restored original state');

        // 3. Determinism: Calculator
        console.log('Testing Calculator Determinism...');
        const sessions = [
            { exercises: [{ id: 'hinge', weight: 100, completed: true }] },
            { exercises: [{ id: 'hinge', weight: 105, completed: true }] }
        ];

        const rec1 = Calculator.getRecommendedWeight('hinge', 'green', sessions);
        const rec2 = Calculator.getRecommendedWeight('hinge', 'green', sessions);
        assert(rec1 === rec2, 'Determinism verified: Calculator output is constant for same input');
        assert(rec1 === 110, `Progression Logic verified: Expected 110, got ${rec1}`); // 105 + 5

        // === OPERATIONAL INTEGRITY ===
        console.log('\n--- Operational Integrity ---');

        // 4. Observability: Logging
        const initialLogs = Logger.getLogs().length;
        Logger.info('Test Log Entry');
        const newLogs = Logger.getLogs().length;
        assert(newLogs === initialLogs + 1, 'Observability verified: Logger captures events');
        assert(Logger.getLogs().pop().message === 'Test Log Entry', 'Log content verified');

        // 5. Validator
        // Case A: With recent workout (should fail)
        const recentCheck = Validator.canStartWorkout();
        assert(recentCheck.valid === false, 'Validator correctly enforces rest period');

        // Case B: Clean slate (should pass)
        Storage.reset();
        const freshCheck = Validator.canStartWorkout();
        assert(freshCheck.valid === true && freshCheck.isFirst === true, 'Validator allows first workout');

        // Summary
        console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
        if (failed > 0) process.exit(1);

    } catch (e) {
        console.error('CRITICAL TEST ERROR:', e);
        process.exit(1);
    }
}

runTests();
