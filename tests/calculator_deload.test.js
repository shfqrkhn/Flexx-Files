
// Mock imports
global.window = {
    location: { pathname: '/test' }
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

async function runTests() {
    console.log('🚀 Testing Calculator Deload Logic...');
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
        const { Calculator } = await import('../js/core.js');
        const { SESSIONS_PER_WEEK, DELOAD_WEEK_INTERVAL } = await import('../js/constants.js');

        const SESSIONS_PER_WEEK_VAL = SESSIONS_PER_WEEK || 3;
        const DELOAD_WEEK_INTERVAL_VAL = DELOAD_WEEK_INTERVAL || 6;

        console.log(`Config: ${SESSIONS_PER_WEEK_VAL} sessions/week, Deload every ${DELOAD_WEEK_INTERVAL_VAL} weeks`);

        // Case 1: Normal Week (Week 1, Session 1)
        // sessions.length = 0 -> Week 1
        assert(Calculator.isDeloadWeek([]) === false, 'Week 1 is not deload');

        // Case 2: Normal Week (Week 5, Session 15)
        // 14 completed -> Next is 15. ceil(15/3) = 5.
        const week5Sessions = Array(14).fill({});
        assert(Calculator.isDeloadWeek(week5Sessions) === false, 'Week 5 is not deload');

        // Case 3: Deload Week Start (Week 6, Session 16)
        // 15 completed -> Next is 16. ceil(16/3) = 6. 6 % 6 === 0.
        const deloadStartSessions = Array(15).fill({});
        assert(Calculator.isDeloadWeek(deloadStartSessions) === true, 'Week 6 (Start) is deload');

        // Case 4: Deload Week End (Week 6, Session 18)
        // 17 completed -> Next is 18. ceil(18/3) = 6.
        const deloadEndSessions = Array(17).fill({});
        assert(Calculator.isDeloadWeek(deloadEndSessions) === true, 'Week 6 (End) is deload');

        // Case 5: Post Deload (Week 7, Session 19)
        // 18 completed -> Next is 19. ceil(19/3) = 7.
        const postDeloadSessions = Array(18).fill({});
        assert(Calculator.isDeloadWeek(postDeloadSessions) === false, 'Week 7 is not deload');

        // Summary
        console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
        if (failed > 0) process.exit(1);

    } catch (e) {
        console.error('Test Error:', e);
        process.exit(1);
    }
}

runTests();
