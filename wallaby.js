module.exports = {
    files: [
        'src/**/*.{tsx,ts}',
        'types/**/*.d.ts',
        './package.json',
        {
            pattern: 'scripts/*.js',
            instrument: false,
        },
        {
            pattern: 'src/lib/js/utils/resolvers',
            instrument: false,
        },
        {
            pattern: 'src/lib/js/utils/resolvers/*.ts',
            instrument: false,
        },
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
