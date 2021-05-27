const CircularDependencyPlugin = require("circular-dependency-plugin");
const WorkerPlugin = require("worker-plugin");
const path = require("path");
const glob = require("glob");
const fs = require("fs");

function getStorybookConfig({ tsconfig, stories }) {
  const addons = [
    {
      name: "@storybook/addon-docs",
      options: {
        actions: false,
        controls: false
      }
    }
  ];

  return {
    stories,
    addons,
    webpackFinal(config) {
      config.module.rules.push(
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: require.resolve("ts-loader"),
              options: {
                configFile: tsconfig
              }
            }
          ]
        },
        {
          test: /\.m\.scss$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]_[hash:8]",
                  exportLocalsConvention: "camelCase"
                }
              }
            },
            "sass-loader"
          ]
        }
      );
      config.plugins.push(
        new WorkerPlugin({
          globalObject: "self"
        }),
        new CircularDependencyPlugin({
          exclude: /node_modules/
        })
      );

      glob.sync(path.resolve(__dirname, "../../packages/*")).forEach(packageDir => {
        const thisPackageJsonPath = path.resolve(__dirname, "../../", packageDir, "package.json");
        const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

        if (thisPackageJson.name) {
          config.resolve.alias[thisPackageJson.name] = `${packageDir}/src/index.ts`;
        }
      });

      return config;
    }
  };
}

exports.getStorybookConfig = getStorybookConfig;
