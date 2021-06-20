# technology stack

- [React.js](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)
- [Jest](https://jestjs.io/)
- [Storybook](https://storybook.js.org/)

# Dev Environment set up

1. Check out the package.json file under the root directory and install the correct version for Node.js and Yarn according to the "engine" field.

2. Clone the repository.

3. Optional: if you are a VSCode user, check out the extensions recommendation and install.

4. Authentication for private NPM feed

- For Windows user, just run `yarn auth`
- Otherwise, follow the [steps](https://docs.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops&tabs=windows#linux-or-mac) to connect to this [feed](https://msdata.visualstudio.com/Vienna/_packaging?_a=feed&feed=vienna-shared-ux)

5. Run `yarn`

6. Run `yarn build` and make sure no errors.

7. Run `yarn start` and verify the demo site renders correctly at http://localhost:5000 and live reloading works.

# Versioning

- [Semantic versioning](https://semver.org/)
- Run `yarn updatePackageJson` every time if you bump versions of some sub packages'

# Testing

## Unit test

1. Run `yarn test` at root directory will run whole set of the test suites.
2. `yarn test` is available under packages/Core and packages/StepsVisualizer for unit tests. You can add `-t` to select test cases or `-u` for jest snapshot updates.

## Playwright tests

1. Run `yarn test-demo` for visual and interaction testing against the storybook.

# Documentation

(TBD)

# Pipelines

- PR gated build: https://msdata.visualstudio.com/Vienna/_build?definitionId=8775
- CI build: https://msdata.visualstudio.com/Vienna/_build?definitionId=10122
- Rolling build to run full tests: https://msdata.visualstudio.com/Vienna/_build?definitionId=14104
