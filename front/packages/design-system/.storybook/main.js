import path, {dirname, join} from "path";
import {babelInclude, override} from "customize-cra";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/preset-create-react-app"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    return Object.assign(
      config,
      override(babelInclude([
        path.resolve(__dirname, '../../auth'),
        path.resolve(__dirname, '../../components'),
        path.resolve(__dirname, '../../config'),
        path.resolve(__dirname, '../../dataset'),
        path.resolve(__dirname, '../../design-system'),
        path.resolve(__dirname, '../../encoding'),
        path.resolve(__dirname, '../../FPSMeter'),
        path.resolve(__dirname, '../../http-client'),
        path.resolve(__dirname, '../../i18n'),
        path.resolve(__dirname, '../../image'),
        path.resolve(__dirname, '../../internals'),
        path.resolve(__dirname, '../../memoize'),
        path.resolve(__dirname, '../../object'),
        path.resolve(__dirname, '../../page'),
        path.resolve(__dirname, '../../projector'),
        path.resolve(__dirname, '../../spatial'),
        path.resolve(__dirname, '../../resource'),
        path.resolve(__dirname, '../'),
        path.resolve(__dirname, './'),
      ]))(config, 'development'),
      {plugins: config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'ESLintWebpackPlugin';
      })},
    )
  },
};
export default config;
