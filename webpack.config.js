const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"), // or "production"
    }),
  ],
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
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
