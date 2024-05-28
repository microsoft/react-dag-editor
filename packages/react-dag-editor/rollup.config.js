const getNxReactConfig = require("@nx/react/plugins/bundle-rollup");
const { bundledDependencies = [] } = require("./package.json");

function getRollupConfig(original) {
  const config = getNxReactConfig(original);
  const external = config.external;
  config.external = (id) => {
    if (bundledDependencies.includes(id)) {
      return false;
    }
    return external(id);
  };
  return config;
}

module.exports = getRollupConfig;
