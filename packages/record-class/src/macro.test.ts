import plugin from "babel-plugin-macros";
import pluginTester from "babel-plugin-tester";

pluginTester({
  plugin,
  pluginName: "macro-record-class",
  filename: __filename,
  babelOptions: {
    plugins: [["@babel/plugin-syntax-decorators", { legacy: true }]],
    presets: [
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
        },
      ],
    ],
  },
  snapshot: true,
  tests: [
    {
      title: "simple",
      fixture: "./__fixtures__/1.ts",
    },
    {
      title: "ignore fields that are not public readonly",
      fixture: "./__fixtures__/2.ts",
    },
  ],
});
