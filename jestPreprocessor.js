/* eslint-env node, es6 */
const tsc = require('typescript');
const fs = require('fs');
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
function transpile(src, path, debugFile) {
    if (!debugFile) {
        return (
            tsc.transpile(
                src, {
                    module: tsc.ModuleKind.CommonJS,
                    jsx: tsc.JsxEmit.React,
                },
                path, []
            )
            .replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2')
            .replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */')
            .replace(/(var __assign = \(this && this.__assign\) \|\| Object.assign)/g, '$1 /* istanbul ignore next */')
        );
    }

    const fs = require('fs');
    const code = tsc.transpile(
        src, {
            module: tsc.ModuleKind.CommonJS,
            jsx: tsc.JsxEmit.React,
        },
        path, []
    )
    .replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2')
    .replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */')
    .replace(/(var __assign = \(this && this.__assign\) \|\| Object.assign)/g, '$1 /* istanbul ignore next */');


    if (path.endsWith(debugFile)) fs.writeFileSync('DEBUG_FILE.js', code);
    return code;

}
