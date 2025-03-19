// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env", {targets: {node: "current"}},
    "@babel/plugin-transform-runtime",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
