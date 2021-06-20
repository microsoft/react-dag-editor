const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const webpackConfig = require("./webpack.config.js");

webpackConfig.plugins = [];

module.exports = {
  propsParser: require("react-docgen-typescript").withCustomConfig(
    "./tsconfig.json",
    {
      propFilter: prop => {
        if (
          /^on((Node)|(Edge)|(Canvas)|(Port))[A-Z][a-zA-Z]+$/.test(prop.name)
        ) {
          return false;
        }

        return true;
      }
    }
  ).parse,
  webpackConfig
};
