const { getStorybookConfig } = require("@react-flow-editor-common/demo");
const path = require("path");

module.exports = getStorybookConfig({
  tsconfig: path.resolve(__dirname, "../tsconfig.stories.json"),
  stories: ["../stories/**/*.stories.tsx"]
});
