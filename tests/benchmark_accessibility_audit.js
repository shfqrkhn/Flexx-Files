
const { performance } = require('perf_hooks');

// === MOCK DOM ENVIRONMENT ===
const NodeFilter = {
    SHOW_ELEMENT: 1,
    FILTER_ACCEPT: 1,
    FILTER_SKIP: 3
};

class Node {
    constructor(type) {
        this.nodeType = type;
        this.childNodes = [];
        this.parentNode = null;
    }
    appendChild(node) {
        this.childNodes.push(node);
        node.parentNode = this;
    }
}

class Element extends Node {
    constructor(tagName) {
        super(1);
        this.tagName = tagName;
        this.style = {};
    }
    get textContent() {
        // Expensive recursive operation simulating browser layout reflow/calculation
        return this.childNodes.map(c => c.textContent).join('');
    }
    get innerText() {
        return this.textContent;
    }
}

class TextNode extends Node {
    constructor(text) {
        super(3);
        this.nodeValue = text;
    }
    get textContent() {
        return this.nodeValue;
    }
}

// Global Environment Mocks
global.NodeFilter = NodeFilter;
global.window = {
    getComputedStyle: (el) => {
        // Simulate style calculation cost
        return { color: 'rgb(0,0,0)', backgroundColor: 'rgb(255,255,255)' };
    }
};

global.document = {
    body: new Element('BODY'),

    // Naive implementation of querySelectorAll('*')
    querySelectorAll: (selector) => {
        const nodes = [];
        const traverse = (node) => {
            if (node.nodeType === 1) { // Element
                nodes.push(node);
                node.childNodes.forEach(traverse);
            }
        };
        // querySelectorAll('*') usually finds descendants, not self (unless rooted at document)
        // document.querySelectorAll searches from root
        global.document.body.childNodes.forEach(traverse);
        return nodes;
    },

    createTreeWalker: (root, whatToShow, filter) => {
        const walker = {
            currentNode: root,
            nextNode: () => {
                // Simplified DFS traversal that respects the filter
                // Note: A real TreeWalker is lazy. We need to implement lazy traversal here.

                // For benchmark purposes, we can just pre-traverse or implement a simple stack-based iterator
                // But let's try to be reasonably accurate to the 'lazy' nature

                // Actually, for this benchmark, we can just traverse everything and apply filter
                // The cost savings come from NOT calling getComputedStyle and NOT calling textContent

                // Let's implement a simple generator-like approach using a stack
                if (!walker._stack) {
                    walker._stack = [...root.childNodes].reverse();
                }

                while (walker._stack.length > 0) {
                    const node = walker._stack.pop();

                    if (node.nodeType === 1) { // ELEMENT
                        // Apply filter
                        let result = NodeFilter.FILTER_ACCEPT;
                        if (filter && filter.acceptNode) {
                            result = filter.acceptNode(node);
                        }

                        // If SKIP or ACCEPT, we still visit children
                        if (result !== NodeFilter.FILTER_REJECT) {
                            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                                walker._stack.push(node.childNodes[i]);
                            }
                        }

                        if (result === NodeFilter.FILTER_ACCEPT) {
                            walker.currentNode = node;
                            return true;
                        }
                        // If SKIP, continue loop
                    }
                }
                return false;
            }
        };
        return walker;
    }
};

global.Logger = {
    info: () => {},
    debug: () => {}
};

// === BUILD LARGE DOM ===
function buildDOM() {
    console.log("Building DOM...");
    // 5^6 = 15625 nodes.
    // Let's go for breadth 4, depth 6 -> 4^6 = 4096 nodes
    const depth = 6;
    const breadth = 4;

    let count = 0;

    function createTree(parent, level) {
        count++;
        if (level === 0) {
            parent.appendChild(new TextNode("Content"));
            return;
        }

        for (let i = 0; i < breadth; i++) {
            const div = new Element('DIV');
            parent.appendChild(div);
            createTree(div, level - 1);
        }
    }

    createTree(global.document.body, depth);
    console.log(`DOM built with ~${count} elements.`);
}

buildDOM();

// === FUNCTIONS TO TEST ===

const ContrastChecker = {
    auditPage_Original() {
        const results = [];
        // Original Logic
        global.document.querySelectorAll('*').forEach(el => {
            const text = el.textContent.trim(); // Expensive O(N)
            if (text.length === 0) return;

            const computed = global.window.getComputedStyle(el); // Expensive
            const fg = computed.color;
            const bg = computed.backgroundColor;

            if (fg && bg) {
                 // Check
            }
        });
        return results;
    },

    auditPage_Optimized() {
        const results = [];
        // Optimized Logic: TreeWalker + Direct Text Check
        const walker = global.document.createTreeWalker(
            global.document.body,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node) => {
                    // Check for direct text node children with content
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const child = node.childNodes[i];
                        if (child.nodeType === 3 && child.nodeValue.trim().length > 0) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        while (walker.nextNode()) {
            const el = walker.currentNode;
            const computed = global.window.getComputedStyle(el);
            const fg = computed.color;
            const bg = computed.backgroundColor;

            if (fg && bg) {
                // Check
            }
        }

        return results;
    }
};

// === RUN BENCHMARK ===

// Warmup
ContrastChecker.auditPage_Optimized();

console.log("Starting Benchmark (average of 5 runs)...");

let totalOriginal = 0;
for(let i=0; i<5; i++) {
    const start = performance.now();
    ContrastChecker.auditPage_Original();
    totalOriginal += (performance.now() - start);
}

let totalOptimized = 0;
for(let i=0; i<5; i++) {
    const start = performance.now();
    ContrastChecker.auditPage_Optimized();
    totalOptimized += (performance.now() - start);
}

const avgOriginal = totalOriginal / 5;
const avgOptimized = totalOptimized / 5;

console.log(`Original:  ${avgOriginal.toFixed(2)}ms`);
console.log(`Optimized: ${avgOptimized.toFixed(2)}ms`);
console.log(`Improvement: ${(avgOriginal / avgOptimized).toFixed(2)}x faster`);
