const glob = require("glob");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs");
const { format } = require("prettier-package-json");

const semver = require("semver");
const { ensureLocalPackageVersions } = require("./ensure-local-package-versions");

const choices = [];

glob.sync(path.resolve(__dirname, "../packages/*")).forEach(packageDir => {
  const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
  const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

  if (thisPackageJson.name) {
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

  const targetPackageJsonPath = `${response.target}/package.json`;
  const targetPackageJson = JSON.parse(fs.readFileSync(targetPackageJsonPath));

  console.log(`current version: ${targetPackageJson.version}`);

  if (!targetPackageJson.version) {
    throw new Error("The target package does not have a version");
  }

  const incTypeResponse = await prompts([
    {
      type: "select",
      name: "type",
      message: "Select release type",
      choices: [
        {
          title: "major",
          value: "major"
        },
        {
          title: "premajor",
          value: "premajor"
        },
        {
          title: "minor",
          value: "minor"
        },
        {
          title: "preminor",
          value: "preminor"
        },
        {
          title: "patch",
          value: "patch"
        },
        {
          title: "prepatch",
          value: "prepatch"
        },
        {
          title: "prerelease",
          value: "prerelease"
        }
      ]
    }
  ]);

  const nextVersion = semver.inc(targetPackageJson.version, incTypeResponse.type);

  if (!nextVersion) {
    throw new Error("Failed to bump version. Please check if the package have a valid version");
  }

  targetPackageJson.version = nextVersion;

  const nextPackageJson = format(targetPackageJson);

  fs.writeFileSync(targetPackageJsonPath, nextPackageJson);

  ensureLocalPackageVersions();
})();
