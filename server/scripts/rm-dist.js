/**
 * this script deletes the `dist` directory
 * It was created to replace `rm dist` in npm scripts
 * for compatibility with Windows
 */

const fs = require('fs-extra');
const path = require('path');
const DIST_DIR = path.join(path.dirname(__dirname), 'dist');
fs.removeSync(DIST_DIR);