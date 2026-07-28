module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/tests/**/*.test.js'],

  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  collectCoverageFrom: [
    'services/**/*.js',
    'database/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],

  coverageDirectory: 'coverage',

  clearMocks: true,
};
