const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PORT = 3001;

const resolvePath = (dir) => path.resolve(__dirname, dir);

module.exports = (env) => {
  const configBase = require('./base')(env);

  return merge(configBase, {
    mode: 'development',
    output: {
      path: resolvePath('../build'),
      filename: 'static/js/[name]-[hash:8].js',
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      historyApiFallback: true,
      compress: true,
      port: PORT,
    },
    plugins: [
      new CleanWebpackPlugin(['../build']),
      new webpack.DefinePlugin({
        __DEV__: true,
        __TEST__: false,
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};
