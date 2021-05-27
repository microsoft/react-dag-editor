// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, "../../"),
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/higherOrderComponents/**",
    "!<rootDir>/src/testAPI/**",
    "!<rootDir>/src/collections/**"
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/vendor/"],
  coverageDirectory: "<rootDir>/test/unit/coverage",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./test/unit/test-result/",
        outputName: "test-results.xml"
      }
    ]
  ],
  setupFiles: ["<rootDir>/test/unit/testSetup.js"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      },
      tsconfig: "<rootDir>/test/tsconfig.json"
    }
  },
  testMatch: ["<rootDir>/test/unit/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "\\.scss$": "<rootDir>/test/unit/__mocks__/css.mock.js"
  }
};
