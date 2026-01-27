
import { performance } from 'perf_hooks';

// Simulate EXERCISES
const EXERCISES = Array.from({length: 10}, (_, i) => ({ id: `ex-${i}`, name: `Exercise ${i}` }));
const ITERATIONS = 100000;

function methodMapJoin() {
    return EXERCISES.map(ex => `
        <div class="card" id="card-${ex.id}">
            <div class="flex-row">
                <h2>${ex.name}</h2>
            </div>
            <div class="controls">
                <button>Action</button>
            </div>
            <details>
                <summary>More</summary>
                <p>Content</p>
            </details>
        </div>
    `).join('');
}

function methodForLoop() {
    let html = '';
    for (const ex of EXERCISES) {
        html += `
        <div class="card" id="card-${ex.id}">
            <div class="flex-row">
                <h2>${ex.name}</h2>
            </div>
            <div class="controls">
                <button>Action</button>
            </div>
            <details>
                <summary>More</summary>
                <p>Content</p>
            </details>
        </div>
    `;
    }
    return html;
}

console.log(`Running benchmark with ${ITERATIONS} iterations...`);

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) methodMapJoin();
let end = performance.now();
const timeMap = end - start;
console.log(`Map Join: ${timeMap.toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) methodForLoop();
end = performance.now();
const timeLoop = end - start;
console.log(`For Loop: ${timeLoop.toFixed(2)}ms`);

console.log(`Loop vs Map: ${(timeMap / timeLoop).toFixed(2)}x faster`);
