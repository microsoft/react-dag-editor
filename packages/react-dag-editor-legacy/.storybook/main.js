module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "packages/react-dag-editor/vite.config.ts"
      }
    }
  }
};
