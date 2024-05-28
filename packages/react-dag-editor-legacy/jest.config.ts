/* eslint-disable */
export default {
  displayName: "react-dag-editor",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/react-dag-editor",
  setupFiles: ["<rootDir>/src/test/unit/testSetup.js"],
};
