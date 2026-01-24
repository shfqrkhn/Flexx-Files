import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runAccessibilityAudit() {
    console.log('🚀 Starting Accessibility & Compliance Audit...\n');
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            failed++;
        }
    };

    try {
        const htmlPath = path.resolve(__dirname, '../index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');

        // 1. Language Attribute
        assert(html.includes('<html lang="en"'), 'HTML tag has lang="en" attribute');

        // 2. Viewport
        assert(html.includes('<meta name="viewport"'), 'Viewport meta tag present');
        assert(html.includes('user-scalable=no'), 'Viewport prevents zooming (app-like feel)');

        // 3. Content Security Policy
        assert(html.includes('http-equiv="Content-Security-Policy"'), 'CSP meta tag present');
        assert(html.includes("default-src 'self'"), 'CSP is strict (default-src self)');

        // 4. ARIA Roles and Attributes
        assert(html.includes('role="main"'), 'Main content has role="main"');
        assert(html.includes('role="navigation"'), 'Navigation has role="navigation"');
        assert(html.includes('aria-live="polite"'), 'ARIA live regions present');
        assert(html.includes('aria-label='), 'ARIA labels present in static HTML');

        // 5. PWA Requirements
        assert(html.includes('manifest.json'), 'Web Manifest linked');
        assert(fs.existsSync(path.resolve(__dirname, '../manifest.json')), 'manifest.json file exists');
        assert(fs.existsSync(path.resolve(__dirname, '../sw.js')), 'Service Worker file exists');

        console.log(`\nAudit Completed: ${passed} Passed, ${failed} Failed`);
        if (failed > 0) process.exit(1);

    } catch (e) {
        console.error('AUDIT ERROR:', e);
        process.exit(1);
    }
}

runAccessibilityAudit();
