
import { AVAILABLE_PLATES } from '../js/constants.js';

// Mock window and localStorage for core.js dependencies
global.window = {
    crypto: { subtle: {} },
    location: { reload: () => {} }
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    key: () => null,
    length: 0
};
global.document = {
    createElement: () => ({ click: () => {}, focus: () => {} }),
    querySelector: () => null
};

Object.defineProperty(global, 'navigator', {
    value: {
        userAgent: 'node',
        platform: 'linux',
        onLine: true
    },
    writable: true,
    configurable: true
});

// Import Calculator AFTER mocking
const { Calculator } = await import('../js/core.js');

console.log('Available Plates:', AVAILABLE_PLATES);

const weight = 47.5;
const load = Calculator.getPlateLoad(weight);
console.log(`Weight: ${weight} lbs -> Load: ${load}`);

if (load === 'Empty Bar') {
    console.log('FAIL: 47.5 lbs calculated as Empty Bar (45 lbs)');
    process.exit(1);
} else {
    console.log('PASS: Correctly calculated load');
}
