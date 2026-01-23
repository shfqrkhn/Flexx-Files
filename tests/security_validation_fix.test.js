
import { setupMocks } from './mocks.mjs';

setupMocks();

// Enhance mocks for observability.js
global.window.location.pathname = '/test';
Object.defineProperty(global.navigator, 'userAgent', {
    value: 'Node.js Test Environment',
    writable: true
});

const { Validator } = await import('../js/security.js');

console.log('--- Security Validation Regression Tests ---');

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

const baseSession = {
    id: '00000000-0000-0000-0000-000000000000',
    date: new Date().toISOString(),
    recoveryStatus: 'green',
    exercises: []
};

// 1. Valid minimal session
{
    const result = Validator.validateSession({ ...baseSession });
    assert(result.valid, 'Minimal session is valid');
}

// 2. Valid full session
{
    const session = {
        ...baseSession,
        warmup: [{ id: 'w1', completed: true }],
        cardio: { type: 'run', completed: false },
        decompress: [{ id: 'd1', completed: true }]
    };
    const result = Validator.validateSession(session);
    assert(result.valid, 'Full valid session is valid');
}

// 3. Invalid Warmup
{
    const session = { ...baseSession, warmup: "not an array" };
    const result = Validator.validateSession(session);
    assert(!result.valid, 'Warmup as string is invalid');
    assert(result.errors.includes('Warmup must be an array'), 'Correct error for warmup type');
}
{
    const session = { ...baseSession, warmup: [{ id: 'w1', completed: "not boolean" }] };
    const result = Validator.validateSession(session);
    assert(!result.valid, 'Warmup item with bad types is invalid');
}

// 4. Invalid Cardio
{
    const session = { ...baseSession, cardio: [] }; // Array instead of object
    const result = Validator.validateSession(session);
    // typeof [] is 'object', so my check "typeof session.cardio !== 'object'" passes for array.
    // But then "typeof session.cardio.type" will be undefined (not 'string').
    assert(!result.valid, 'Cardio as array (missing fields) is invalid');
}
{
    const session = { ...baseSession, cardio: { type: 123, completed: true } };
    const result = Validator.validateSession(session);
    assert(!result.valid, 'Cardio with bad type is invalid');
}

// 5. Invalid Decompress
{
    const session = { ...baseSession, decompress: 123 };
    const result = Validator.validateSession(session);
    assert(!result.valid, 'Decompress as number is invalid');
}
{
    const session = { ...baseSession, decompress: [{ id: 123, completed: true }] };
    const result = Validator.validateSession(session);
    assert(!result.valid, 'Decompress item with bad id is invalid');
}

// 6. Valid Legacy Decompress
{
    const session = { ...baseSession, decompress: { completed: true } };
    const result = Validator.validateSession(session);
    assert(result.valid, 'Legacy decompress object is valid');
}

console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
