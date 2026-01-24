import { setupMocks } from './mocks.mjs';
setupMocks();

const { Storage } = await import('../js/core.js');

console.log('--- Import Error Disclosure Test ---\n');

// Track console.error calls to verify logging
const originalConsoleError = console.error;
let errorLogs = [];
console.error = (...args) => {
    errorLogs.push(args);
    originalConsoleError(...args);
};

// Track alert calls to verify user-facing message
let alertMessages = [];
global.alert = (msg) => {
    alertMessages.push(msg);
    console.log(`[ALERT]: ${msg}`);
};

// Test Case 1: Invalid session data should show generic error
console.log('Test 1: Invalid session data (missing ID)');
const invalidData = {
    sessions: [
        {
            // Missing required 'id' field
            date: '2024-01-01T00:00:00.000Z',
            recoveryStatus: 'green',
            exercises: []
        }
    ]
};

Storage.importData(JSON.stringify(invalidData));

// Verify generic error shown to user
if (alertMessages.length === 1) {
    const message = alertMessages[0];

    // Should show the generic error from ERROR_MESSAGES.IMPORT_PARSE_ERROR
    if (message === 'Invalid file: Please ensure this is a valid Flexx Files backup file.') {
        console.log('✅ PASS: Generic error message shown to user (no technical details exposed)');
        console.log(`   Message: ${message}`);
    } else if (message.includes('Missing fields') || message.includes('Session 1:')) {
        console.log('❌ FAIL: Alert contains technical validation details');
        console.log(`   Message: ${message}`);
    } else {
        console.log('❌ FAIL: Unexpected error message');
        console.log(`   Message: ${message}`);
    }
} else {
    console.log(`❌ FAIL: Expected 1 alert, got ${alertMessages.length}`);
}

// Verify technical details logged securely
const validationErrorLog = errorLogs.find(log =>
    log[0] === 'Import validation failed' && log[1]?.errors
);

if (validationErrorLog) {
    console.log('✅ PASS: Technical validation errors logged to console.error');
    console.log(`   Logged details: ${JSON.stringify(validationErrorLog[1])}`);
} else {
    console.log('❌ FAIL: Validation errors not properly logged');
}

// Test Case 2: Valid data should not trigger error
console.log('\nTest 2: Valid session data');
errorLogs = [];
alertMessages = [];

const validData = {
    sessions: [
        {
            id: '123e4567-e89b-12d3-a456-426614174000',
            date: '2024-01-01T00:00:00.000Z',
            recoveryStatus: 'green',
            exercises: [
                {
                    id: 'hinge',
                    name: 'Deadlift',
                    weight: 135
                }
            ]
        }
    ]
};

// Mock confirm to return false (don't actually import)
global.confirm = () => {
    console.log('[CONFIRM]: Import prompt shown (validation passed)');
    return false;
};

Storage.importData(JSON.stringify(validData));

if (alertMessages.length === 0) {
    console.log('✅ PASS: No error alert for valid data');
} else {
    console.log('❌ FAIL: Error alert shown for valid data');
}

console.log('\n--- Test Complete ---');

// Restore console.error
console.error = originalConsoleError;
