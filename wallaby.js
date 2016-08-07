module.exports = function (wallaby) {
    return {
        files: [
            "lib/**/*.{tsx,ts}",
            "vendor/*.ts",
            "types/**/*.d.ts",
            "!lib/**/__tests__/*",
        ],
        tests: [
            "lib/**/__tests__/*-test.tsx",
            "lib/**/__tests__/*-test.ts",
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: "jest",
        setup: function (wallaby) {
            wallaby.testFramework.configure({
            "scriptPreprocessor": "jestPreprocessor.js",
            "testFileExtensions": [
              "ts",
              "tsx",
              "js"
            ],
            "moduleFileExtensions": [
              "js",
              "ts",
              "tsx",
              "json"
            ],
            "unmockedModulePathPatterns": [
              "react",
              "react-dom",
              "react-addons-test-utils",
              "fbjs",
              "enzyme",
              "sinon",
              "lib/js/utils/Constants",
              "lib/js/utils/Mocks"
            ],
            "verbose": true,
            "collectCoverage": true
          });
        }
    };
};
