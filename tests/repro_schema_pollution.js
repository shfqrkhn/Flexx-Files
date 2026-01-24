
import fs from 'fs';
import { Storage } from '../js/core.js';
import { Security } from '../js/security.js';

// Mock Browser Environment
global.window = { location: { reload: () => {} }, crypto: { randomUUID: () => 'uuid-' + Date.now() } };
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; },
    removeItem(k) { delete this._data[k]; },
    key(i) { return Object.keys(this._data)[i]; },
    get length() { return Object.keys(this._data).length; }
};
global.console = console;
global.alert = (msg) => console.log('ALERT:', msg);

// Initialize Security
Security.init();

console.log('--- Starting Schema Pollution Test ---');

// 1. Create a session with malicious/extra fields
// Use a valid UUID to pass validation
const validUUID = '12345678-1234-1234-1234-1234567890ab';

const pollutedSession = {
    id: validUUID,
    date: new Date().toISOString(),
    recoveryStatus: 'green',
    exercises: [
        {
            id: 'bench',
            name: 'Bench Press',
            weight: 100,
            _hidden_payload: 'exploit'
        }
    ],
    _malicious_root: 'root_exploit'
};

// 2. Save it
try {
    Storage.saveSession(pollutedSession);
    console.log('Session saved.');
} catch (e) {
    console.error('Save failed:', e);
}

// 3. Retrieve and inspect
const sessions = Storage.getSessions();
const saved = sessions.find(s => s.id === validUUID);

if (!saved) {
    console.error('FAIL: Session not found');
    process.exit(1);
}

let leaked = false;
if (saved._malicious_root) {
    console.log('FAIL: _malicious_root persisted');
    leaked = true;
}

if (saved.exercises[0]._hidden_payload) {
    console.log('FAIL: _hidden_payload in exercises persisted');
    leaked = true;
}

if (leaked) {
    console.log('VULNERABILITY CONFIRMED: Schema pollution possible');
} else {
    console.log('PASS: No extra fields found (unexpected for reproduction)');
}
