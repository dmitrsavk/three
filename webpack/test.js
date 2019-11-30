const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const resolvePath = (dir) => path.resolve(__dirname, dir);

module.exports = (env) => {
  const configBase = require('./base')(env);

  return merge(configBase, {
    mode: 'production',
    output: {
      path: resolvePath('../build'),
      filename: 'static/js/[name]-[hash:8].js',
      publicPath: '/',
      pathinfo: false,
    },
    plugins: [
      new UglifyJsPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        __DEV__: false,
        __TEST__: true,
      }),
      new CleanWebpackPlugin(['../build']),
    ],
  });
};
