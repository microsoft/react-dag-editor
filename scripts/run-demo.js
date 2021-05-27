const glob = require("glob");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs");

const execa = require("execa");

const choices = [];

glob.sync(path.resolve(__dirname, "../packages/*")).forEach(packageDir => {
  const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
  const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

  if (thisPackageJson.name && thisPackageJson.scripts.start) {
    choices.push({ title: thisPackageJson.name, value: packageDir });
  }
});

(async () => {
  const response = await prompts([
    {
      type: "select",
      name: "target",
      message: "Select one demo",
      choices
    }
  ]);

  await execa(`yarn --cwd ${response.target} start`, [], { stdio: "inherit", shell: true });
})();
