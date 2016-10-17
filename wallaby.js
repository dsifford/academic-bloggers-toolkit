module.exports = {
    files: [
        {
            pattern: 'src/**/index.{ts,tsx}',
            instrument: false,
            load: true,
        },
        {
            pattern: 'src/lib/js/utils/resolvers/*',
            instrument: false,
            load: true,
        },
        {
            pattern: 'scripts/*.js',
            instrument: false,
            load: true,
        },
        {
            pattern: 'src/lib/js/utils/{DevTools,TinymceFunctions}.ts',
            instrument: false,
            load: true,
        },
        'src/**/*.{ts,tsx}',
        'types/**/*.d.ts',
        './package.json',
        '!src/**/__tests__/*',
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
        wallaby.testFramework.configure(require('./package.json').jest); // eslint-disable-line
    },
};
