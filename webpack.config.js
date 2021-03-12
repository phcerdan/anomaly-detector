const webpack = require("webpack");
const path = require("path");
const hwp = require("html-webpack-plugin");
// const ESLintPlugin = require('eslint-webpack-plugin');

const dev = process.env.NODE_ENV !== "production";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const imageRegex = /\.(woff2?|jpe?g|png|gif|ico|svg)$/;
const dataRegex = /\.(vtu|vtp|nrrd)$/;
const outputFolder = path.join(__dirname, "/dist");
const nodeModulesFolder = path.join(__dirname, "node_modules");

module.exports = {
  entry: path.join(__dirname, "/src/index.js"),
  output: {
    filename: "build.js",
    path: outputFolder,
  },
  devtool: dev ? "eval-cheap-module-source-map" : "none",

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve("babel-loader"),
        exclude: nodeModulesFolder,
      },
      {
        test: [cssRegex],
        use: [
          {
            loader: require.resolve("style-loader"),
          },
          {
            loader: require.resolve("css-loader"),
          },
        ],
      },
      {
        test: [imageRegex],
        type: "asset/resource", // old: loader: 'file-loader'
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: [dataRegex],
        type: "asset/resource", // old: loader: 'file-loader'
        generator: {
          filename: "assets/data/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new hwp({ template: path.join(__dirname, "/src/index.html") }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    // new ESLintPlugin(/*options*/),
  ],
  resolve: {
    alias: {
      // Needed when library is linked via `npm link` to app
      react: path.resolve("./node_modules/react"),
    },
  },
  devServer: {
    writeToDisk: true,
  },
};
