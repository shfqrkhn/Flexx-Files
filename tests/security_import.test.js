
import { Validator, Security } from '../js/security.js';
import { Storage } from '../js/core.js';

// Mock Logger
global.Logger = {
    error: console.error,
    warn: console.warn,
    info: console.log,
    debug: console.log
};

// Mock alert
global.alert = (msg) => {
    console.log('🚨 ALERT CALLED:', msg);
};

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: function(key) { return store[key] || null; },
        setItem: function(key, value) {
            console.log('💾 SET ITEM CALLED:', key);
            store[key] = value.toString();
        },
        clear: function() { store = {}; },
        removeItem: function(key) { delete store[key]; }
    };
})();
global.localStorage = localStorageMock;

// Mock window/document for Storage
global.window = {
    location: { reload: () => {} },
    confirm: () => true
};
global.confirm = () => true;

async function runTest() {
    console.log('🛡️ Testing for Import XSS Vulnerability...');

    const maliciousPayload = {
        sessions: [{
            id: "00000000-0000-0000-0000-000000000000",
            date: "2024-01-01T12:00:00.000Z",
            recoveryStatus: "green",
            exercises: [
                {
                    id: "bench",
                    name: "Bench Press",
                    weight: "<img src=x onerror=alert('XSS')>" // Malicious non-number weight
                }
            ]
        }]
    };

    // 1. Check if Validator allows this payload (it should reject now)
    const result = Validator.validateImportData(maliciousPayload);

    if (result.valid) {
        console.log('❌ VULNERABILITY CONFIRMED: Validator accepted malicious payload!');
    } else {
        console.log('✅ Validator rejected malicious payload.');
        console.log('Errors:', result.errors);
    }

    // 2. Check if Storage imports it
    console.log('Attempting Storage.importData...');
    Storage.importData(JSON.stringify(maliciousPayload));

    const stored = Storage.getSessions();
    if (stored.length > 0) {
        const storedWeight = stored[0].exercises[0].weight;
        console.log('Stored weight value:', storedWeight);

        if (typeof storedWeight === 'string' && storedWeight.includes('<img')) {
            console.log('❌ VULNERABILITY CONFIRMED: Malicious string stored in database!');
        } else {
            console.log('✅ Malicious data not stored as is.');
        }
    } else {
        console.log('✅ No data stored. Import aborted successfully.');
    }
}

runTest();
