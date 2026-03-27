/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const {override, babelInclude} = require('customize-cra')
const TerserPlugin = require('terser-webpack-plugin')
const {DefinePlugin} = require('webpack')
const {listPackages} = require('../../config-overrides.base.cjs')

const getOptimization = () => {
  return {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: false,
          format: {ecma: 6},
          keep_classnames: true,
          keep_fnames: true,
          mangle: false,
          module: true,
          ecma: 6,
          sourceMap: false,
        },
        extractComments: true,
      }),
    ],
  }
}

const moduleOverrides = (moduleName, config) => {
  switch (moduleName) {
    case 'client':
      return {
        entry: path.resolve(__dirname, './src/client/index.ts'),
        output: {
          path: path.resolve('build'),
          libraryTarget: 'umd',
          globalObject: 'this',
          filename: 'client.js',
        },
        optimization: getOptimization(config),
      }
    case 'view': {
      return {
        entry: path.resolve(__dirname, './src/view/index.tsx'),
      }
    }
    default:
      return {
        entry: path.resolve(__dirname, './src/demo/index.tsx'),
      }
  }
}

module.exports = {
  webpack(config, env) {
    const moduleName = process.env.MODULE_NAME ?? 'demo'

    if (!config.plugins) {
      config.plugins = []
    }

    config.plugins.push(
      new DefinePlugin({
        'process.browser': 'true',
      }),
    )

    const conf = Object.assign(
      config,
      moduleOverrides(moduleName.toLowerCase(), config),
      override(babelInclude(listPackages()))(config, env))

    return conf
  },
}
