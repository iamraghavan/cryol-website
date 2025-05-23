const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: './public/assets/js/main.js',
      plugins: './public/assets/js/plugins/plugins.min.js',
      vendor: './public/assets/js/vendor/vendor.min.js',
      style: './public/assets/css/style.css',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public/dist'),
      clean: true,  // Clean old files on build
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin(),
      ],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
  };
};
