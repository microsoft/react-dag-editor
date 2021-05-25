# Guide

## Tech stack

- [typescript](https://www.typescriptlang.org/)
- [nodejs](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/)
- [React.js](https://reactjs.org/)
- [rollup.js](https://rollupjs.org/)
- [jest](https://jestjs.io/)
- [storybook](https://storybook.js.org/)

## Setting up your develop environment

- Install nodejs(version >= 12.*): https://nodejs.org/en/
- Install yarn(version >= 1.12.*): https://classic.yarnpkg.com/
- Clone the repository to your dev machine.
- Run ```yarn``` at root directory.
- Enjoy working.

## Creating a new component package

Run:

```yarn new```

Then follow the prompts. 

## Yarn commands available in default package template.

### Build

``` 
yarn build
```

Using src/index.ts as the entry point, to bundle all source files, including typescript(.ts), sass(.scss) and json(.json), into 3 bundled files: ESM + UMD(unminifiled) + UMD(minifiled).

### Test

```
yarn test
```

Using jest for unit testing. Test suites under ./test folder.

### Lint

```
yarn lint
```

Using eslint for code linting. If you'd prefer to see only errors and ignore all warnings. Run

```
yarn lint --quite
```

### Start

```
yarn start
```

Starting local storybook demos and docs at http://localhost:5000

## Full build

Run "yarn build" at root directory for full build.

```
yarn build
```

- Run the build script in each package. Thus, in case you create some packages without using the default package template, make sure to specify the "build" script in your package.json.


## Start demo

Run "yarn start" at root directory and follow the prompt to select the target package for demo.

- All local packages will be linked together in the setup steps. There is alias configs in common storybook config will resolve all local dependencies to source file. So every local editing will trigger the demo reloading.


## Test and lint

At root directory, run

```
yarn test
```

```
yarn lint
```

- "-u" option is not available at root directory. Change the working directory to target package to update jest snapshots.

## Versioning

- All local dependencies should match the local version. Run "yarn updatePackageJson" to ensure that.
- Common external dependencies should have the same version exactly.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
