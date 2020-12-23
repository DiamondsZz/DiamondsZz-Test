const path = require("path");
const webpack = require("webpack");

// vue.config.js
module.exports = {
  publicPath: "/",

  transpileDependencies: ["resize-detector", "ant-design-vue"],

  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
};
