import { setupMocks } from './mocks.mjs';
setupMocks();

const { Sanitizer } = await import('../js/security.js');

console.log('--- URL Sanitization Hardening Tests ---\n');

let passed = 0;
let failed = 0;

const test = (name, url, expectedSafe) => {
    const result = Sanitizer.sanitizeURL(url);
    const isSafe = result === '#';
    const shouldBeSafe = expectedSafe === 'blocked';

    if ((isSafe && shouldBeSafe) || (!isSafe && !shouldBeSafe)) {
        console.log(`✅ PASS: ${name}`);
        console.log(`   Input: ${url}`);
        console.log(`   Output: ${result}\n`);
        passed++;
    } else {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Input: ${url}`);
        console.log(`   Expected: ${shouldBeSafe ? 'blocked (#)' : 'allowed'}`);
        console.log(`   Got: ${result}\n`);
        failed++;
    }
};

// Test dangerous protocols are blocked
test('javascript: protocol', 'javascript:alert(1)', 'blocked');
test('data: protocol', 'data:text/html,<script>alert(1)</script>', 'blocked');
test('vbscript: protocol', 'vbscript:alert(1)', 'blocked');
test('file: protocol', 'file:///etc/passwd', 'blocked');
test('about: protocol', 'about:blank', 'blocked');

// Test encoding bypasses are blocked
test('javascript with tab', 'java\tscript:alert(1)', 'blocked');
test('javascript with newline', 'java\nscript:alert(1)', 'blocked');
test('javascript with null byte', 'java\x00script:alert(1)', 'blocked');
test('javascript uppercase', 'JAVASCRIPT:alert(1)', 'blocked');
test('javascript mixed case', 'JaVaScRiPt:alert(1)', 'blocked');

// Test valid URLs are allowed
test('https URL', 'https://www.youtube.com/watch?v=123', 'allowed');
test('http URL', 'http://example.com/video', 'allowed');

// Test edge cases are handled safely
test('empty string', '', 'blocked');
test('null value', null, 'blocked');
test('undefined value', undefined, 'blocked');
test('non-string type', 123, 'blocked');
test('malformed URL', 'not a url at all', 'blocked');
test('protocol-relative URL', '//evil.com/payload', 'blocked');

console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
process.exit(failed > 0 ? 1 : 0);
