
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
    location: { pathname: '/test' },
    addEventListener: () => {}
};

Object.defineProperty(global, 'navigator', {
    value: {
        userAgent: 'NodeJS Test',
        platform: 'NodeJS'
    },
    writable: true,
    configurable: true
});

global.localStorage = localStorageMock;
global.performance = {
    now: () => Date.now(),
    memory: { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 }
};

// Test Runner
async function runTest() {
    console.log('🚀 Starting Stack Leak Reproduction...\n');

    try {
        const { Logger } = await import('../js/observability.js');

        // Clear previous logs
        localStorage.clear();

        // 1. Log an error with a stack trace
        const sensitiveStack = 'Error: Boom\n    at User.secrets (user.js:42)';
        Logger.error('Test Error', { stack: sensitiveStack });

        // 2. Check localStorage
        const persisted = localStorage.getItem('flexx_errors');
        if (!persisted) {
            console.error('❌ FAIL: No errors persisted');
            process.exit(1);
        }

        const errors = JSON.parse(persisted);
        const lastError = errors[errors.length - 1];

        console.log('Persisted Error:', JSON.stringify(lastError, null, 2));

        if (lastError.context && lastError.context.stack === sensitiveStack) {
            console.log('⚠️ VULNERABILITY CONFIRMED: Stack trace persisted in localStorage');
        } else {
            console.log('✅ SAFE: Stack trace NOT persisted');
        }

    } catch (e) {
        console.error('CRITICAL TEST ERROR:', e);
        process.exit(1);
    }
}

runTest();
