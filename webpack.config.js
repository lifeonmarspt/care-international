const path = require("path");
const process = require("process");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VirtualModulePlugin = require("virtual-module-webpack-plugin");

const basePlugins = [
  new HtmlWebpackPlugin({
    template: "./app/index.html",
    inject: "body",
    title: "Care International",
    filename: "index.html",
  }),
  new VirtualModulePlugin({
    moduleName: "app/config.json",
    contents: {
      cartodb: {
        account: process.env.CARTODB_ACCOUNT,
        apikey: process.env.CARTODB_API_KEY,
      },
    },
  }),
];

const productionPlugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production"),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    output: {
      comments: false,
      semicolons: true,
    },
    sourceMap: true,
  }),
];

let plugins = (process.env.NODE_ENV || "production") === "production" ?
  [].concat(basePlugins, productionPlugins) :
  [].concat(basePlugins);

module.exports = {
  entry: "./app/index.jsx",
  resolveLoader: {
    modules: [path.resolve(__dirname, "loaders"), "node_modules"],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [path.resolve(__dirname, "app"), "node_modules"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.s(c|a)ss$/, use: ["style-loader", "css-loader", "sass-loader"], exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.png$|.jpg$/, use: "file-loader?name=[name].[ext]" },
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.otf$/, loader: "file-loader" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
    ],
  },
  plugins: plugins,
};
