import { setupMocks } from './mocks.mjs';
setupMocks();

import { Storage } from '../js/core.js';

// Setup initial state
const initialSessions = [
    { id: 's1', exercises: [{ id: 'ex1', weight: 100 }] }
];
localStorage.setItem('flexx_sessions_v3', JSON.stringify(initialSessions));

// Verify initial state
const sessionsBefore = Storage.getSessions();
console.log('Before:', sessionsBefore[0].exercises[0].weight);

// Start Transaction
console.log('Starting Transaction...');
Storage.Transaction.begin();

// Simulate a failed save operation that writes bad data to localStorage
// NOTE: We no longer protect against in-place mutation of cache objects for performance reasons.
// We trust that saveSession() creates new array/objects and does not mutate cache in-place.
// We verify here that Transaction can restore localStorage from the snapshot.
console.log('Simulating localStorage corruption/change...');
localStorage.setItem('flexx_sessions_v3', 'CORRUPTED_JSON_DATA');

// Rollback
console.log('Rolling back...');
Storage.Transaction.rollback();

// Verify state after rollback
// Verify localStorage content directly
const rawStored = localStorage.getItem('flexx_sessions_v3');
if (rawStored === JSON.stringify(initialSessions)) {
     console.log('PASS: localStorage restored correctly.');
     process.exit(0);
} else {
     console.log('FAIL: localStorage not restored.');
     console.log('Expected:', JSON.stringify(initialSessions));
     console.log('Actual:', rawStored);
     process.exit(1);
}
