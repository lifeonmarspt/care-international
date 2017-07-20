const path = require("path");
const process = require("process");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VirtualModulePlugin = require("virtual-module-webpack-plugin");

// given a layerid id, get a cartodb layer url
const layerURL = (id) => `https://careinternational.carto.com/api/v2/viz/${id}/viz.json`;

// stop if required env variables aren't found

["CARTODB_ACCOUNT", "BASE_LAYER_ID", "LABEL_LAYER_ID"].forEach((k) => {
  if (!process.env[k]) {
    throw new Error(`Undefined required env variable ${k}`);
  }
});

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
        layer: {
          base: layerURL(process.env.BASE_LAYER_ID),
          label: layerURL(process.env.LABEL_LAYER_ID),
        },
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
      { test: /\.cartoscss$/, use: ["raw-loader", "cartocss-loader", {
        loader: "sass-loader",
        options: {
          outputStyle: "compressed",
        },
      }], exclude: /node_modules/ },
      { test: /\.s(c|a)ss$/, use: ["style-loader", "css-loader", {
        loader: "sass-loader",
        options: {
          includePaths: [path.resolve(__dirname, "app")],
        },
      }], exclude: /node_modules/ },
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
