const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, "../../"),
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/collections/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/vendor/"],
  coverageDirectory: "<rootDir>/test/collections/coverage",
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
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      },
      tsconfig: "<rootDir>/test/tsconfig.json"
    }
  },
  testMatch: ["<rootDir>/test/collections/**/*.test.{ts,tsx}"]
};
