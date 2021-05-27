const { exec } = require("child_process");
const dts = require("dts-bundle");

function buildDts() {
  exec("tsc --declaration --emitDeclarationOnly", (error) => {
    console.log(error || "Build declaration success！");

    if (!error) {
      dts.bundle({
        name: "index",
        main: "dist/index.d.ts",
        outputAsModuleFolder: true,
      });
    }
  });
}

module.exports = buildDts;
