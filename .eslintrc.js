const { resolve } = require('path');

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: ['@dsifford/eslint-config'],
    parserOptions: {
        project: resolve(__dirname, 'tsconfig.json'),
        tsconfigRootDir: __dirname,
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'no-undef': 'off',
            },
        },
        {
            files: ['scripts/**'],
            rules: {
                'no-console': 'off',
            },
        },
    ],
};
