module.exports = [
  {
    files: ["**/*.js"],

    ignores: ["node_modules/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },

    rules: {
      eqeqeq: "error",
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
    },
  },
];
