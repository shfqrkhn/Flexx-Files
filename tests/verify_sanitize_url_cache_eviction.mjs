
import { Sanitizer } from '../js/security.js';

// Mock Logger
global.console = {
    ...console,
    warn: () => {},
    info: () => {},
    error: () => {},
    debug: () => {}
};

// Mock localStorage
const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
};
global.localStorage = localStorageMock;

console.log("Testing Sanitizer URL Cache Eviction Strategy...");

// Spy on URL constructor
let urlConstructorCalls = 0;
const OriginalURL = global.URL;
global.URL = class MockURL extends OriginalURL {
    constructor(url) {
        super(url);
        urlConstructorCalls++;
    }
};

// 1. Fill cache to 100
// Note: Sanitizer cache limit is 100.
// Adding 100 items fills it.
// Adding 101st item triggers the limit check.
for (let i = 0; i < 100; i++) {
    Sanitizer.sanitizeURL(`https://example.com/${i}`);
}

console.log(`Calls after filling 100 items: ${urlConstructorCalls}`);

// 2. Add 101st item to trigger eviction logic
Sanitizer.sanitizeURL(`https://example.com/101`);
console.log(`Calls after 101st item: ${urlConstructorCalls}`);

// 3. Verify Strategy
// Strategy A (Current/Old): `_urlCache.clear()` -> All items gone.
// Strategy B (Proposed/New): `_urlCache.delete(oldest)` -> Only oldest gone.

// We check if item 1 (which was the second item added) is still in cache.
// If Strategy A: Cache cleared -> Item 1 gone -> Re-computation -> Calls increment.
// If Strategy B: Only Item 0 evicted -> Item 1 present -> No re-computation -> Calls stable.

const callsBeforeCheck = urlConstructorCalls;
Sanitizer.sanitizeURL(`https://example.com/1`);
const callsAfterCheck = urlConstructorCalls;

if (callsAfterCheck > callsBeforeCheck) {
    console.log("VERDICT: Cache was CLEARED (Item 1 re-computed).");
    console.log("Current Behavior: Mass Eviction.");
} else {
    console.log("VERDICT: Cache PRESERVED Item 1.");
    console.log("New Behavior: LRU Eviction.");
}
