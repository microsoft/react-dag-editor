const fs = require("fs");
const path = require("path");
const { format } = require("prettier-package-json");
const { processPackageVersionMatchers } = require("./processPackageVersionMatchers");

function ensureLocalPackageVersions() {
  processPackageVersionMatchers((packageDirs, localPackages) => {
    packageDirs.forEach(packageDir => {
      const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
      const thisPackageJson = require(thisPackageJsonPath);

      localPackages.forEach(it => {
        if (thisPackageJson.dependencies && thisPackageJson.dependencies[it.name]) {
          thisPackageJson.dependencies[it.name] = it.version;
        }
      });

      const nextPackageJson = format(thisPackageJson);

      fs.writeFileSync(thisPackageJsonPath, nextPackageJson);
    });
  });
}

exports.ensureLocalPackageVersions = ensureLocalPackageVersions;
