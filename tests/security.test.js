
// Mock browser globals
global.window = {
    location: { pathname: '/test' },
    crypto: { subtle: {} }
};
Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'NodeJS Test' },
    writable: true,
    configurable: true
});
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};
global.document = {
    createElement: () => ({ textContent: '', innerHTML: '' }), // Mock for sanitizeHTML if needed
    querySelector: () => null
};

// Use dynamic import to load module
import('../js/security.js').then(({ Sanitizer }) => {
    console.log('Testing Sanitizer.sanitizeString...');
    const malicious = '<script>alert(1)</script>';
    const sanitized = Sanitizer.sanitizeString(malicious);

    console.log(`Original: ${malicious}`);
    console.log(`Sanitized: ${sanitized}`);

    if (sanitized === '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;') {
        console.log('PASS: String sanitization works');
    } else {
        console.error('FAIL: String sanitization failed');
        console.error(`Expected: &lt;script&gt;alert(1)&lt;&#x2F;script&gt;`);
        process.exit(1);
    }
}).catch(err => {
    console.error('Error importing module:', err);
    process.exit(1);
});
