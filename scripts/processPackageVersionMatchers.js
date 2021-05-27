const path = require("path");
const globArray = require("glob-array");
const fs = require("fs");

function processPackageVersionMatchers(cb) {
  const rootPackageJson = require("../package.json");
  const patterns = rootPackageJson.workspaces;
  const localPackages = [];

  globArray.sync(patterns).forEach(packageDir => {
    const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
    const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

    if (thisPackageJson.name && thisPackageJson.version) {
      localPackages.push({ name: thisPackageJson.name, version: thisPackageJson.version, packageDir });
    }
  });

  const packageDirs = globArray.sync(patterns);

  cb(packageDirs, localPackages);
}

exports.processPackageVersionMatchers = processPackageVersionMatchers;
