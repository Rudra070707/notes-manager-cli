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

  coverageProvider: 'v8',

  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],

  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],

  clearMocks: true,

  resetMocks: true,

  restoreMocks: true,
};
