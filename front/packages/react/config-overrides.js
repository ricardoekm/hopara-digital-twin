/* eslint-disable */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {override, babelInclude} = require('customize-cra')
const webpack = require('webpack')
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
        },
        extractComments: true,
      }),
    ],
  }
}

const getReactExternalMap = () => ({
  react: 'react',
  'react-dom': 'react-dom',
  'react/jsx-runtime': 'react/jsx-runtime',
  'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
})

const getExternals = () => {
  return [
    nodeExternals({
      additionalModuleDirs: listPackages().map((packageDir) => `${packageDir}/node_modules`),
      allowlist: [new RegExp('@hopara/*')],
    }),
    getReactExternalMap(),
  ]
}

const getPlugins = (config) => {
  const ignoredPlugins = [
    'HtmlWebpackPlugin',
    'InlineChunkHtmlPlugin',
    'InterpolateHtmlPlugin',
    'ModuleNotFoundPlugin',
    'MiniCssExtractPlugin',
    'ManifestPlugin',
  ]

  const plugins = config.plugins.filter((plugin) => {
    return ignoredPlugins.indexOf(plugin.constructor.name) < 0
  })

  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
    new webpack.DefinePlugin({
      process: {env: {}}
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  )

  return plugins
}

module.exports = {
  webpack(config, env) {
    return Object.assign(
        config,
        override(babelInclude(listPackages()))(config, env),
        {
          entry: './src/index.ts',
          output: {
            path: path.resolve('build'),
            filename: 'index.js',
            libraryTarget: 'commonjs2',
          },
          optimization: getOptimization(config),
          externals: getExternals(config),
          plugins: getPlugins(config),
        })
  },
}
