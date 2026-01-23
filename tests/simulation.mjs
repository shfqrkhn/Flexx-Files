
import { setupMocks } from './mocks.mjs';

// Setup environment BEFORE imports
setupMocks();

// Dynamic imports
const { Storage, Calculator, Validator } = await import('../js/core.js');
const { EXERCISES } = await import('../js/config.js');

console.log('=== Starting Simulation ===');

// Simulation State
const START_DATE = new Date();
START_DATE.setDate(START_DATE.getDate() - 30); // Start 30 days ago
let currentSimTime = START_DATE.getTime();

// Patch Date.now()
const originalDateNow = Date.now;
Date.now = () => currentSimTime;

// Helper to format date
const fmt = (ts) => new Date(ts).toISOString().split('T')[0];

async function runSimulation() {
    console.log(`Start Date: ${fmt(currentSimTime)}`);

    let sessionsCompleted = 0;
    const history = {}; // Track weight progression: { exerciseId: [weights...] }

    // Initialize history tracking
    EXERCISES.forEach(e => history[e.id] = []);

    // Simulate 30 days (approx 720 hours)
    const END_TIME = originalDateNow();

    // Time step: 12 hours
    while (currentSimTime < END_TIME) {
        // Advance time
        currentSimTime += 12 * 60 * 60 * 1000;

        // Random variance: add 0-4 hours to avoid perfect periodicity
        currentSimTime += Math.floor(Math.random() * 4 * 60 * 60 * 1000);

        // Check if we can workout
        const check = Validator.canStartWorkout();

        if (check.valid) {
            // Decide to workout (90% chance if valid)
            if (Math.random() > 0.1) {
                await simulateWorkout();
            }
        }
    }

    // Final Reporting
    console.log('\n=== Simulation Complete ===');
    console.log(`Total Sessions: ${sessionsCompleted}`);

    const savedSessions = Storage.getSessions();
    console.log(`Saved Sessions: ${savedSessions.length}`);

    if (savedSessions.length !== sessionsCompleted) {
        console.error('ERROR: Mismatch between completed and saved sessions!');
        process.exit(1);
    }

    // Verify Progression
    console.log('\n=== Progression Report ===');
    let progressionHealthy = true;

    EXERCISES.forEach(ex => {
        const weights = history[ex.id];
        if (weights.length > 0) {
            const start = weights[0];
            const end = weights[weights.length - 1];
            const diff = end - start;
            console.log(`${ex.name.padEnd(20)}: ${start} -> ${end} (${diff >= 0 ? '+' : ''}${diff})`);

            if (diff < 0) {
                 // It's possible to decrease if we simulated failures/deloads, but generally should go up
                 console.warn(`  WARNING: Weight decreased for ${ex.name}`);
            }
        } else {
            console.warn(`  WARNING: No data for ${ex.name}`);
        }
    });

    if (sessionsCompleted < 8) {
        console.error(`ERROR: Too few sessions completed (${sessionsCompleted}). Expected ~10-15.`);
        process.exit(1);
    }

    console.log('\nSUCCESS: Simulation passed all checks.');

    async function simulateWorkout() {
        const dateStr = new Date(currentSimTime).toISOString();
        // console.log(`[${fmt(currentSimTime)}] Workout Starting...`);

        // 1. Recovery Selection
        // Mostly Green, occasional Yellow
        const recovery = Math.random() > 0.8 ? 'yellow' : 'green';

        // 2. Build Session Object
        const session = {
            id: `sim-${Date.now()}-${Math.random()}`,
            date: dateStr,
            recoveryStatus: recovery,
            warmup: [], // Skip warmup logic for now
            exercises: [],
            cardio: { type: 'Rower', completed: true },
            decompress: []
        };

        // 3. Perform Exercises
        for (const exCfg of EXERCISES) {
            // Get Recommendation
            let recWeight = Calculator.getRecommendedWeight(exCfg.id, recovery);

            // On first session, recommendation is 0 (User expected to find weight)
            // Simulate user entering a base weight
            if (recWeight === 0) {
                recWeight = 45;
            }

            // Simulate Performance
            // 95% success rate
            const success = Math.random() > 0.05;

            // If failed, maybe we did fewer reps or skipped?
            // For simplicity, let's say we did the sets but failed completion check if !success
            // Or strictly: if !success, we might not have finished all reps.

            // Current app logic: 'completed' flag on exercise means "Did all sets/reps"

            session.exercises.push({
                id: exCfg.id,
                name: exCfg.name,
                weight: recWeight,
                setsCompleted: success ? exCfg.sets : exCfg.sets - 1,
                completed: success,
                skipped: false,
                usingAlternative: false
            });

            // Track history (only track completed sessions for simplified reporting)
            if (success) {
                history[exCfg.id].push(recWeight);
            }
        }

        // 4. Save Session
        Storage.saveSession(session);
        sessionsCompleted++;
        // console.log(`[${fmt(currentSimTime)}] Workout Saved. Rec: ${recovery}`);
    }
}

runSimulation().catch(err => {
    console.error('Fatal Simulation Error:', err);
    process.exit(1);
});
