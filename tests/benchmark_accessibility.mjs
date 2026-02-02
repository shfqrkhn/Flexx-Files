
import { performance } from 'perf_hooks';
import { AriaLabels } from '../js/accessibility.js';

// === MOCK DOM ===
class MockElement {
    constructor(tagName, classes = [], text = '') {
        this.tagName = tagName.toUpperCase();
        this._classes = new Set(classes);
        this.textContent = text;
        this.attributes = {};
        this.classList = {
            contains: (c) => this._classes.has(c),
            add: (c) => this._classes.add(c),
            remove: (c) => this._classes.delete(c)
        };
    }
    getAttribute(name) { return this.attributes[name] || null; }
    setAttribute(name, val) { this.attributes[name] = val; }
    hasAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name); }
}

const elements = [];

// Populate DOM with many buttons
// 1. Nav items (Buttons with text, no aria-label initially) - High volume
for (let i = 0; i < 1000; i++) {
    elements.push(new MockElement('BUTTON', ['nav-item'], 'Navigation Item ' + i));
}

// 2. Stepper buttons (Target for optimization) - fewer
for (let i = 0; i < 100; i++) {
    // Some empty, some with text
    elements.push(new MockElement('BUTTON', ['stepper-btn'], ''));
    elements.push(new MockElement('BUTTON', ['stepper-btn'], '+'));
}

// 3. Set buttons (Target for optimization) - fewer
for (let i = 0; i < 100; i++) {
    elements.push(new MockElement('BUTTON', ['set-btn'], ''));
    elements.push(new MockElement('BUTTON', ['set-btn'], '1'));
}

// 4. Other random buttons
for (let i = 0; i < 500; i++) {
    elements.push(new MockElement('BUTTON', ['btn'], 'Click me'));
}

global.document = {
    querySelectorAll: (selector) => {
        // Naive implementation of selector matching for the benchmark
        // This simulates the cost of browser finding elements + return size
        const results = elements.filter(el => {
            if (el.tagName !== 'BUTTON') return false;

            // :not([aria-label])
            if (el.hasAttribute('aria-label')) return false;

            if (selector === 'button:not([aria-label])') {
                return true;
            }

            if (selector.includes('stepper-btn') || selector.includes('set-btn')) {
                // Approximate matching for the optimized selector
                const isStepper = selector.includes('stepper-btn') && el.classList.contains('stepper-btn');
                const isSet = selector.includes('set-btn') && el.classList.contains('set-btn');
                return isStepper || isSet;
            }

            return false;
        });
        return results;
    }
};

// Mock Logger
const noop = () => {};
global.Logger = { info: noop, debug: noop, warn: noop, error: noop };

// === BENCHMARK ===
console.log('Running enhanceButtons benchmark...');
console.log(`Total elements: ${elements.length}`);

const ITERATIONS = 1000;
const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
    // Reset attributes for each iteration to ensure work is done
    elements.forEach(el => el.attributes = {});
    AriaLabels.enhanceButtons();
}

const end = performance.now();
console.log(`Total time for ${ITERATIONS} iterations: ${(end - start).toFixed(2)}ms`);
console.log(`Average time per call: ${((end - start) / ITERATIONS).toFixed(4)}ms`);

// Verify correctness on last run
const stepperEmpty = elements.find(el => el.classList.contains('stepper-btn') && el.textContent === '');
const setEmpty = elements.find(el => el.classList.contains('set-btn') && el.textContent === '');
const navItem = elements.find(el => el.classList.contains('nav-item'));

console.log('Verification:');
console.log('Stepper (empty) aria-label:', stepperEmpty.getAttribute('aria-label')); // Should be set
console.log('Set (empty) aria-label:', setEmpty.getAttribute('aria-label')); // Should be set
console.log('Nav item aria-label:', navItem.getAttribute('aria-label')); // Should be null (not touched)
