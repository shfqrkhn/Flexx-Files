
async function runVerification() {
    console.log('🚀 Verifying Configuration Integrity...');
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
        const { EXERCISES } = await import('../js/config.js');

        // Check Incline DB Press
        const incline = EXERCISES.find(e => e.id === 'push_incline');
        assert(incline, 'Incline DB Press exists');
        if (incline) {
            assert(incline.category === 'H-PUSH', 'Category is H-PUSH');
            assert(Array.isArray(incline.alternatives) && incline.alternatives.length > 0, 'Has alternatives');
            assert(incline.video.includes('youtube.com'), 'Has video link');
        }

        // Check Lat Pulldown
        const lat = EXERCISES.find(e => e.id === 'pull_vert');
        assert(lat, 'Lat Pulldown exists');
        if (lat) {
            assert(lat.category === 'PULL', 'Category is PULL');
            assert(Array.isArray(lat.alternatives) && lat.alternatives.length > 0, 'Has alternatives');
            assert(lat.video.includes('youtube.com'), 'Has video link');
        }

        console.log(`\nVerification Completed: ${passed} Passed, ${failed} Failed`);
        if (failed > 0) process.exit(1);

    } catch (e) {
        console.error('Verification Error:', e);
        process.exit(1);
    }
}

runVerification();
