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

// Mutate the session object IN PLACE
// This simulates a bug or side-effect where an object in the cache is modified directly
// while a transaction is in progress.
const sessionsDuring = Storage.getSessions();
sessionsDuring[0].exercises[0].weight = 999;
console.log('Mutated:', sessionsDuring[0].exercises[0].weight);

// Rollback
console.log('Rolling back...');
Storage.Transaction.rollback();

// Verify state after rollback
const sessionsAfter = Storage.getSessions();
console.log('After:', sessionsAfter[0].exercises[0].weight);

if (sessionsAfter[0].exercises[0].weight === 999) {
    console.log('FAIL: Mutation persisted after rollback. Snapshot was shallow.');
    process.exit(1);
} else {
    console.log('PASS: Mutation reverted. Snapshot was deep.');
    process.exit(0);
}
