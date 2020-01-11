const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const resolvePath = (value) => path.resolve(__dirname, value);

module.exports = (env) => {
  const isProd = env === 'prod';
  const isTest = env === 'test';
  console.log('[ACTUAL DIR]', __dirname);
  return {
    entry: ['@babel/polyfill', resolvePath('../src/index')],
    resolve: {
      alias: {
        components: resolvePath('../src/components'),
        config: resolvePath('../src/config'),
        core: resolvePath('../src/core'),
        services: resolvePath('../src/services'),
        store: resolvePath('../src/store'),
        assets: resolvePath('../src/assets'),
      },
      extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
        },
        {
          test: /\.(png|jp?g|gif|svg|hdr)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/icons',
              },
            },
          ],
        },
        {
          test: /\.(mtl|obj)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/models',
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff|woff2)(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/fonts',
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        production: isProd || isTest,
        minify: (isProd || isTest) && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new CopyPlugin([{ from: 'src/assets', to: 'static/', toType: 'dir' }]),
    ],
  };
};
