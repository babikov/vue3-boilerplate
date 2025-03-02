'use strict'

const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const baseWebpackConfig = require('./base')
const cssWebpackConfig = require('./css')
const config = require('../project.config')
const terserOptions = require('./terserOptions')

const withReport = process.env.npm_config_withReport

module.exports = merge(baseWebpackConfig, cssWebpackConfig, {
  mode: 'production',

  output: {
    publicPath: config.build.publicPath,
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(terserOptions())],
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [withReport ? new BundleAnalyzerPlugin() : ''],
})
