
// Mock browser globals
global.window = {
    location: { pathname: '/test' },
    crypto: { subtle: {} }
};
global.navigator = {
    userAgent: 'NodeJS Test'
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};
global.document = {
    createElement: () => ({ textContent: '', innerHTML: '' }),
    querySelector: () => null
};

import('../js/security.js').then(({ Sanitizer }) => {
    console.log('Verifying fix logic...');

    const x = {
        id: "malicious'id\\quote\"test",
        recoveryStatus: "<script>alert(1)</script>",
        cardio: { type: "<img src=x onerror=alert(1)>" }
    };
    const w = { altUsed: "<svg/onload=alert(1)>" };

    // Simulating usage in app.js
    const safeId = x.id.replace(/['"\\]/g, '');
    const safeRecovery = Sanitizer.sanitizeString(x.recoveryStatus);
    const safeCardio = Sanitizer.sanitizeString(x.cardio.type);
    const safeWarmup = Sanitizer.sanitizeString(w.altUsed);

    console.log(`Original ID: ${x.id}`);
    console.log(`Safe ID: ${safeId}`);
    console.log(`Safe Recovery: ${safeRecovery}`);

    // Verify ID safety for onclick
    // onclick="window.del('SAFE_ID')"
    if (safeId.includes("'") || safeId.includes('"') || safeId.includes("\\")) {
        console.error('FAIL: ID sanitization failed to remove quotes/backslashes');
        process.exit(1);
    }

    // Verify content safety
    if (safeRecovery.includes('<') || safeCardio.includes('<') || safeWarmup.includes('<')) {
        console.error('FAIL: Content sanitization failed');
        process.exit(1);
    }

    console.log('PASS: Fix logic verified');

}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
