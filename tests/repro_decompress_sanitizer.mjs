import { Sanitizer } from '../js/security.js';

console.log('Running Decompress Sanitizer Reproduction Test...');

const mockSession = {
    id: '00000000-0000-0000-0000-000000000000',
    date: new Date().toISOString(),
    recoveryStatus: 'green',
    exercises: [],
    decompress: [
        {
            id: 'hang',
            completed: true,
            val: 60,
            altUsed: 'Farmers Hold (Static)'
        }
    ]
};

const cleaned = Sanitizer.scrubSession(mockSession);

if (!cleaned || !cleaned.decompress || !cleaned.decompress[0]) {
    console.error('Failed to scrub session properly');
    process.exit(1);
}

const cleanedItem = cleaned.decompress[0];

console.log('Cleaned Item:', cleanedItem);

// We expect the bug to be present, so fields should be undefined.
if (cleanedItem.val === 60 && cleanedItem.altUsed === 'Farmers Hold (Static)') {
    console.log('Test Passed: Fields preserved.');
    process.exit(0);
} else {
    console.log('Test Failed: Fields stripped (Bug Reproduced).');
    process.exit(1);
}
