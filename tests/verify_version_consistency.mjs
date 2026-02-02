import fs from 'fs';
import path from 'path';

// Helpers
const readFile = (p) => fs.readFileSync(path.resolve(process.cwd(), p), 'utf8');

try {
    console.log('Verifying version consistency...');

    // 1. Get version from constants.js
    const constants = readFile('js/constants.js');
    const versionMatch = constants.match(/APP_VERSION = '([\d\.]+)';/);
    if (!versionMatch) throw new Error('Could not find APP_VERSION in js/constants.js');
    const constVersion = versionMatch[1];
    console.log(`[CONST]  Version: ${constVersion}`);

    // 2. Get version from README.md
    const readme = readFile('README.md');
    const readmeMatch = readme.match(/\*\*Version:\*\* ([\d\.]+)/);
    if (!readmeMatch) throw new Error('Could not find Version in README.md');
    const readmeVersion = readmeMatch[1];
    console.log(`[README] Version: ${readmeVersion}`);

    // 3. Get version from sw.js
    const sw = readFile('sw.js');
    const swMatch = sw.match(/CACHE_NAME = 'flexx-v([\d\.]+)';/);
    if (!swMatch) throw new Error('Could not find CACHE_NAME version in sw.js');
    const swVersion = swMatch[1];
    console.log(`[SW]     Version: ${swVersion}`);

    // 4. Assert
    if (constVersion !== readmeVersion || constVersion !== swVersion) {
        console.error('FAIL: Version mismatch detected!');
        process.exit(1);
    }

    console.log('PASS: All versions synchronized.');

} catch (e) {
    console.error(`FAIL: ${e.message}`);
    process.exit(1);
}
