import webpack from 'webpack'
import WriteFilePlugin from 'write-file-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

import paths from './paths'

const DEFAULT_HOST = "'localhost'"
const DEFAULT_PORT = 3004
const devHotClient = require.resolve('./webpackHotDevClient')

process.traceDeprecation = true

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    background: [
      devHotClient,
      paths.backgroundSrc
    ],
    popup: [
      devHotClient,
      paths.popupSrc
    ],
    content: [
      devHotClient,
      paths.contentSrc
    ]
  },
  output: {
    path: paths.devBuild,
    pathinfo: true,
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js?$/,
      exclude: /node_modules/,
      include: [paths.source],
      loader: 'standard-loader'
    }, {
      test: /\.js?$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: [paths.source]
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: [paths.source]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.popupHtml,
      filename: 'popup.html',
      excludeChunks: ['content', 'background']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.HOST': process.env.HOST || DEFAULT_HOST,
      'process.env.PORT': process.env.PORT || DEFAULT_PORT
    }),
    /* new WriteFilePlugin({
      test: /\.bundle(\.js|\.js\.map)$|\.html$|manifest\.json|messages\.json|\.png/
    }), */
    new CopyWebpackPlugin({ patterns: [
      {
        from: paths.extension,
        to: paths.devBuild
      }
    ] })
  ]
}
