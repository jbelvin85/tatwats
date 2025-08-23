// jest.config.js
module.exports = {
  // The test environment that will be used for testing.
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test.
  clearMocks: true,

  // Setup files to run after each test file in the suite
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // This will load our .env.test
};