
import { Storage } from '../js/core.js';

// === MOCK ENV ===
const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    length: 0,
    key: (i) => Object.keys(store)[i]
};

global.window = {
    requestIdleCallback: (cb) => cb(),
    cancelIdleCallback: () => {},
    setTimeout: (cb) => { cb(); return 1; },
    clearTimeout: () => {},
    location: { reload: () => {}, pathname: '/test', href: 'http://localhost/test' },
    alert: (msg) => {
        console.error('FAIL: window.alert called:', msg);
        process.exit(1);
    },
    confirm: (msg) => {
        console.error('FAIL: window.confirm called:', msg);
        process.exit(1);
    }
};

global.console = console;

// Mock crypto for UUIDs
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'uuid-' + Math.random()
    },
    writable: true
});

console.log('Starting UI Decoupling Verification...');

// 1. Test saveSession (should throw, not alert)
try {
    console.log('Testing saveSession failure...');
    Storage.saveSession({});
    console.error('FAIL: saveSession did not throw');
    process.exit(1);
} catch (e) {
    console.log('PASS: saveSession threw error as expected:', e.message);
}

// 2. Test deleteSession (should throw, not alert)
try {
    console.log('Testing deleteSession failure...');

    // Seed a session
    const sid = 'uuid-test';
    Storage._sessionCache = [{ id: sid }];

    // Mock schedulePersistence to throw
    const originalSchedule = Storage.schedulePersistence;
    Storage.schedulePersistence = () => { throw new Error('Persistence Fail'); };

    try {
        Storage.deleteSession(sid);
        console.error('FAIL: deleteSession did not throw on Persistence error');
        process.exit(1);
    } catch(e) {
        console.log('PASS: deleteSession threw on Persistence error:', e.message);
    }
    Storage.schedulePersistence = originalSchedule;
} catch (e) {
    console.error('Unexpected error in test harness:', e);
    process.exit(1);
}

// 3. Test exportData (should throw, not alert)
try {
    console.log('Testing exportData failure...');
    try {
        Storage.exportData();
        console.error('FAIL: exportData did not throw');
    } catch (e) {
        console.log('PASS: exportData threw:', e.message);
    }
} catch (e) {
    console.error('Unexpected error:', e);
}

// 4. Test validateImport (should return object, not alert)
try {
    console.log('Testing validateImport...');
    const result = Storage.validateImport('invalid json');
    if (result.valid === false && result.error) {
        console.log('PASS: validateImport handled invalid JSON:', result.error);
    } else {
        console.error('FAIL: validateImport did not return error object');
        process.exit(1);
    }
} catch(e) {
    console.error('FAIL: validateImport threw error:', e);
    process.exit(1);
}

console.log('SUCCESS: Core logic is decoupled from window.alert/confirm');
