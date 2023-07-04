import path from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../(components|stories)/**/*.mdx", "../(components|stories)/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {
        postCss: {
          implementation: require.resolve("postcss"),
        },
      },
    },
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: (config) => {
    if (!config.resolve) config.resolve = {};
    config.resolve.alias = {
      ...config.resolve?.alias,
      "@": [path.resolve(__dirname, "../src/"), path.resolve(__dirname, "../")],
    };

    return config;
  },
};
export default config;
