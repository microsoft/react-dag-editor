const path = require("path");
const typescript = require("rollup-plugin-typescript2");
const autoExternal = require("rollup-plugin-auto-external");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const postcss = require("rollup-plugin-postcss");
const json = require("@rollup/plugin-json");

const outputConfig = (name, root) => {
  return [
    {
      format: "es",
      sourcemap: true,
      dir: path.resolve(root, "dist"),
      entryFileNames: "[name].esm.js"
    },
    {
      format: "umd",
      sourcemap: true,
      dir: path.resolve(root, "dist"),
      entryFileNames: "[name].js",
      name
    },
    {
      format: "umd",
      sourcemap: true,
      dir: path.resolve(root, "dist"),
      entryFileNames: "[name].min.js",
      plugins: [terser()],
      name
    }
  ];
};

const commonConfig = root => {
  return {
    plugins: [
      autoExternal({
        dependencies: false
      }),
      typescript({
        clean: true,
        tsconfigDefaults: {
          compilerOptions: {
            declarationDir: path.resolve(root, "dist")
          }
        },
        useTsconfigDeclarationDir: true
      }),
      nodeResolve({
        browser: true
      }),
      commonjs(),
      postcss({
        minimize: true,
        autoModules: false,
        modules: {
          generateScopedName: "[local]_[hash:8]",
          localsConvention: "camelCase"
        }
      }),
      json()
    ],
    onwarn: (msg, warn) => {
      if (/Circular/.test(msg)) {
        throw new Error(msg);
      }

      warn(msg);
    }
  };
};

exports.commonConfig = commonConfig;
exports.outputConfig = outputConfig;
