module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    "react-native-reanimated/plugin",
  ],
};