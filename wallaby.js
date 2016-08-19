module.exports = {
    files: [
        'src/**/*.{tsx,ts}',
        'types/**/*.d.ts',
        './package.json',
        {
            pattern: 'scripts/*.js',
            instrument: false,
        },
        '!src/lib/js/utils/Externals.ts',
        '!src/**/__tests__/*',
        '!src/**/index.{ts,tsx}',
        '!src/lib/js/Frontend.ts',
        '!src/lib/js/utils/TinymceFunctions.ts',
    ],
    tests: [
        'src/**/__tests__/*-test.{ts,tsx}',
    ],
    env: {
        type: 'node',
        runner: 'node',
    },
    testFramework: 'jest',
    setup(wallaby) {
        wallaby.testFramework.configure(require('./package.json').jest);
    },
};
