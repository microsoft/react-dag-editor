const fs = require("fs");
const path = require("path");

const { processPackageVersionMatchers } = require("../scripts/processPackageVersionMatchers");

const ignoredPackages = new Set([
  "packages/SourcemapStackMapper"
]);

const notIgnoredPackages = (dir) => !ignoredPackages.has(dir);

describe("Ensure versions in local packages match each other's", () => {
  it("There should not be any changes after running 'yarn updatePackageJson'", done => {
    processPackageVersionMatchers((packageDirs, localPackages) => {
      packageDirs.filter(notIgnoredPackages).forEach(packageDir => {
        const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
        const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

        localPackages.forEach(it => {
          if (thisPackageJson.dependencies && thisPackageJson.dependencies[it.name]) {
            expect(thisPackageJson.dependencies[it.name]).toBe(it.version);
          }
        });
      });

      done();
    });
  });

  it("External dependencies should have consistent versions in each package", done => {
    const versionMap = new Map();

    processPackageVersionMatchers((packageDirs, localPackages) => {
      packageDirs.filter(notIgnoredPackages).forEach(packageDir => {
        const thisPackageJsonPath = path.resolve(__dirname, "../", packageDir, "package.json");
        const thisPackageJson = JSON.parse(fs.readFileSync(thisPackageJsonPath));

        ["dependencies", "devDependencies", "peerDependencies"].forEach(depType => {
          if (!thisPackageJson[depType]) {
            return;
          }

          Object.keys(thisPackageJson[depType]).forEach(depName => {
            if (versionMap.has(depName)) {
              expect(versionMap.get(depName)).toBe(thisPackageJson[depType][depName]);
            } else {
              versionMap.set(depName, thisPackageJson[depType][depName]);
            }
          });
        });
      });

      done();
    });
  });
});
