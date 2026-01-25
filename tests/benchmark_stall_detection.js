import { Calculator } from '../js/core.js';
import { EXERCISES } from '../js/config.js';
import * as CONST from '../js/constants.js';

// Mock browser globals if needed by imports
if (typeof global.window === 'undefined') {
    global.window = {};
}
if (typeof global.localStorage === 'undefined') {
    global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        length: 0,
        key: () => null
    };
}
if (typeof global.document === 'undefined') {
    global.document = {
        createElement: () => ({ innerHTML: '' }),
        querySelector: () => null
    };
}
if (typeof global.navigator === 'undefined') {
    global.navigator = { userAgent: 'node' };
}

function generateSessions(count) {
    const sessions = [];
    const exerciseIds = EXERCISES.map(e => e.id);
    const startDate = new Date('2023-01-01');

    for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i * 2);

        const sessionExercises = [];
        // Add random exercises
        for (const id of exerciseIds) {
            // Make the first exercise ('hinge') very rare (only in first session)
            if (id === 'hinge' && i > 0) continue;

            // Randomly skip or complete
            const r = Math.random();
            if (r > 0.1) { // 90% chance to do exercise
                 sessionExercises.push({
                    id: id,
                    weight: 100 + (i % 10) * 5, // varying weight
                    setsCompleted: 3,
                    completed: r > 0.2, // 80% completion rate
                    skipped: false,
                    usingAlternative: false
                 });
            }
        }

        sessions.push({
            id: `session-${i}`,
            date: date.toISOString(),
            exercises: sessionExercises
        });
    }
    return sessions;
}

const SESSION_COUNT = 10000;
const ITERATIONS = 1000;

console.log(`Generating ${SESSION_COUNT} sessions...`);
const sessions = generateSessions(SESSION_COUNT);
console.log('Sessions generated.');

console.log(`Benchmarking detectStall over ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
    for (const ex of EXERCISES) {
        Calculator.detectStall(ex.id, sessions);
    }
}

const end = performance.now();
const totalTime = end - start;
console.log(`Total time: ${totalTime.toFixed(2)}ms`);
console.log(`Average time per iteration: ${(totalTime / ITERATIONS).toFixed(4)}ms`);
