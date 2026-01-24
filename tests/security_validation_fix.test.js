
// Mock globals
global.window = {};
global.localStorage = { getItem: () => null };

// Mock dependencies
const mockLogger = {
    error: () => {},
    warn: () => {},
    info: () => {}
};

async function runRepro() {
    try {
        const { Validator } = await import('../js/security.js');
        let failed = false;

        console.log('--- Testing NaN Validation ---');

        // Test 1: NaN Weight
        const exWeight = { id: 'test', name: 'test', weight: NaN };
        const resWeight = Validator.validateExercise(exWeight);
        if (resWeight.valid) {
            console.error('FAIL: NaN weight accepted');
            failed = true;
        } else {
            console.log('PASS: NaN weight rejected');
        }

        // Test 2: NaN SetsCompleted
        const exSets = { id: 'test', name: 'test', weight: 100, setsCompleted: NaN };
        const resSets = Validator.validateExercise(exSets);
        if (resSets.valid) {
            console.error('FAIL: NaN setsCompleted accepted');
            failed = true;
        } else {
            console.log('PASS: NaN setsCompleted rejected');
        }

        if (failed) process.exit(1);
        console.log('All security checks passed.');
    } catch (e) {
        console.error('Import error:', e);
        process.exit(1);
    }
}

runRepro();
