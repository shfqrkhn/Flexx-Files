
import { DateFormatter } from './js/i18n.js';

if (DateFormatter && typeof DateFormatter.format === 'function') {
    console.log('PASS: DateFormatter is exported and has format method');
} else {
    console.error('FAIL: DateFormatter is NOT exported correctly');
    process.exit(1);
}
