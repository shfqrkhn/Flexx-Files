
export function setupMocks() {
    // Mock LocalStorage
    class MockLocalStorage {
        constructor() {
            this.store = new Map();
        }
        getItem(key) {
            return this.store.get(key) || null;
        }
        setItem(key, value) {
            this.store.set(key, String(value));
        }
        removeItem(key) {
            this.store.delete(key);
        }
        clear() {
            this.store.clear();
        }
    }

    global.localStorage = new MockLocalStorage();

    // Mock Window
    global.window = {
        location: {
            reload: () => console.log('window.location.reload called'),
            href: ''
        },
        localStorage: global.localStorage
    };

    // Mock Document
    global.document = {
        createElement: (tag) => {
            return {
                href: '',
                click: () => console.log(`Clicked created element <${tag}>`),
                download: ''
            };
        }
    };

    // Mock Navigator
    Object.defineProperty(global, 'navigator', {
        value: {
            platform: 'Node.js',
            onLine: true,
            vibrate: () => {},
            userAgent: 'Node.js Test Environment'
        },
        writable: true,
        configurable: true
    });

    // Mock URL - use native URL constructor for parsing, but mock static methods
    // Note: Node.js has native URL support, so we keep the constructor
    const OriginalURL = global.URL;
    global.URL = class URL extends OriginalURL {
        static createObjectURL(blob) {
            return `blob:${blob.size}`;
        }
        static revokeObjectURL(url) {
            // No-op
        }
    };

    // Mock Blob
    global.Blob = class Blob {
        constructor(content, options) {
            this.content = content;
            this.options = options;
            this.size = content.reduce((acc, c) => acc + c.length, 0);
        }
    };

    // Mock Alert/Confirm
    global.alert = (msg) => console.log(`[ALERT]: ${msg}`);
    global.confirm = (msg) => {
        console.log(`[CONFIRM]: ${msg}`);
        return true; // Default to YES
    };

    // Mock Date.now to be controllable
    // We will replace this in the simulation loop, but set a default here
    // global.Date.now = () => new Date().getTime(); // Keep native for now
}
