module.exports = {
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.js"],

  collectCoverageFrom: [
    "services/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
  ],

  coverageDirectory: "coverage",

  clearMocks: true,
};
