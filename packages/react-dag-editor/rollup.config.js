const path = require("path");
const getNxReactConfig = require("@nrwl/react/plugins/bundle-rollup");
const { bundledDependencies } = require("./package.json");

function getRollupConfig(original) {
  const config = getNxReactConfig(original);
  const external = config.external;
  config.external = (id) => {
    if (bundledDependencies.includes(id)) {
      return false;
    }
    return external(id);
  };
  config.plugins = config.plugins.filter((plugin) => plugin.name !== "rpt2");
  config.plugins.push({
    resolveId(importee) {
      if (importee === "records") {
        return path.resolve(
          __dirname,
          "../../dist/packages/records/src/index.js"
        );
      }
    },
  });
  return config;
}

module.exports = getRollupConfig;
