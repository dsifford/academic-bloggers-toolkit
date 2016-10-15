/* eslint-env node, es6 */
const tsc = require('typescript');
const fs = require('fs');
const tsconfig = require('../tsconfig.json').compilerOptions;

const DEBUG_FILE = false;

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            return transpile(src, path, DEBUG_FILE);
        }
        return src;
    },
};


// Debug function to help weed out transpiled nonsense that negatively affects testing
function transpile(s, path, debugFile) {
    const src = s.replace(/^import '.+?\.css';/gm, '');
    const code = tsc.transpile(
        src, tsconfig,
        path, []
    )
    .replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2')
    .replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */')
    .replace(/(var __assign = \(this && this.__assign\) \|\| Object.assign)/g, '$1 /* istanbul ignore next */')
    .replace(/(var __decorate = \(this && this.__decorate\) \|\|)/g, '$1 /* istanbul ignore next */')
    .replace(/(^__decorate\(\[$)/gm, ' /* istanbul ignore next */\n$1');
    // var __decorate = (this && this.__decorate) || function (decorators, target, key, desc)

    if (!debugFile) return code;

    if (path.endsWith(debugFile)) fs.writeFileSync('./tmp/DEBUG_FILE.js', code);
    return code;
}
