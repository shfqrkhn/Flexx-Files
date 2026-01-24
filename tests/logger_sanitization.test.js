
// Mock browser globals
global.window = {
    location: { pathname: '/test' },
    crypto: { subtle: {} }
};
Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'NodeJS Test' },
    writable: true,
    configurable: true
});

const localStorageStore = {};
global.localStorage = {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, val) => { localStorageStore[key] = val; },
    removeItem: (key) => { delete localStorageStore[key]; }
};

// Mock document for Sanitizer
global.document = {
    createElement: () => ({ textContent: '', innerHTML: '' })
};

async function runTest() {
    console.log('🚀 Testing Logger Sanitization...');
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
        // We need to mock Sanitizer.sanitizeString because we can't easily run the real one in Node (no DOM)
        // However, the Sanitizer module imports Logger, creating a circular dependency.
        // The real Sanitizer relies on document.createElement('div'), which we've rudimentarily mocked.
        // But a robust test should verify the integration.

        // Let's rely on the module loader to handle the circular dependency (ESM handles this well).
        // We need to override the real Sanitizer's behavior OR ensure our mock DOM works enough.

        // Better approach: Mock the Sanitizer.sanitizeString method AFTER import but BEFORE Logger uses it?
        // No, Logger imports Sanitizer.

        // Let's implement a working mock DOM for sanitizeString
        global.document.createElement = () => {
            const el = {
                _text: '',
                set textContent(val) {
                    this._text = val
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#x27;')
                        .replace(/\//g, '&#x2F;');
                },
                get innerHTML() {
                    return this._text;
                }
            };
            return el;
        };

        // Re-import to ensure fresh state if possible, but ESM caches.
        // We will just assume the modules are loaded fresh or we can manipulate the Logger.

        const { Logger } = await import('../js/observability.js');
        const { STORAGE_PREFIX } = await import('../js/constants.js');

        // Test Case 1: Malicious Message
        const maliciousMsg = '<script>alert(1)</script>';
        Logger.error(maliciousMsg);

        const storedErrors = JSON.parse(global.localStorage.getItem(`${STORAGE_PREFIX}errors`) || '[]');
        const lastError = storedErrors[storedErrors.length - 1];

        assert(lastError.message.includes('&lt;script&gt;'), 'Message sanitized in storage');
        assert(!lastError.message.includes('<script>'), 'Raw script tag removed from message');

        // Test Case 2: Malicious Context
        Logger.critical('System Failure', {
            details: '<img src=x onerror=alert(1)>',
            safe: 'valid'
        });

        const newStoredErrors = JSON.parse(global.localStorage.getItem(`${STORAGE_PREFIX}errors`) || '[]');
        const lastCritical = newStoredErrors[newStoredErrors.length - 1];

        assert(lastCritical.context.details.includes('&lt;img'), 'Context string sanitized');
        assert(lastCritical.context.safe === 'valid', 'Safe context preserved');

        console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
        if (failed > 0) process.exit(1);

    } catch (e) {
        console.error('Test Error:', e);
        process.exit(1);
    }
}

runTest();
