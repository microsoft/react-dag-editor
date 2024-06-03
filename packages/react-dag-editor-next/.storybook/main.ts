import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    "@chromatic-com/storybook",
  ],
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [
        tsconfigPaths({
          projects: ["../../tsconfig.base.json"],
        }),
      ],
    });
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: "vite.config.ts",
      },
    },
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
