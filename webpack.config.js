const path = require("path");
const webpack = require("webpack");

const common = {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"), // or "production"
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "public"),
    port: 3000,
    hot: true,
    open: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};

module.exports = [
  {
    ...common,
    entry: "./public/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundled_index.js",
    },
  },
  {
    ...common,
    entry: "./src/loader.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
    },
  },
];
