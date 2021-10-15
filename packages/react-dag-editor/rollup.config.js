const path = require("path");
const deepmerge = require("deepmerge");
const { commonConfig, outputConfig } = require("@react-dag-editor-common/builder");

const mainConfig = deepmerge(
  {
    input: {
      index: "./src/index.ts"
    },
    output: outputConfig("ReactFlowEditorEngine", process.cwd())
  },
  commonConfig(process.cwd())
);

const vendorConfig = deepmerge(
  {
    input: {
      vendor: "./src/libs/index.ts"
    },
    output: {
      format: "amd",
      sourcemap: true,
      dir: path.resolve(process.cwd(), "dist"),
      entryFileNames: "[name].js"
    }
  },
  commonConfig(process.cwd())
);

const config = [mainConfig, vendorConfig];

module.exports = config;
