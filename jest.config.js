const NO_COVERAGE = process.env.NO_COVERAGE === '1';
const CLEAR_CONSOLE = process.env.CLEAR_CONSOLE === '1';

const notice = () => console.log('Using Jest config from `jest.config.js`');

if (CLEAR_CONSOLE) {
  require('clear')();
  console.log();
  notice();
  console.log('Clearing console due to CLEAR_CONSOLE=1');
} else {
  notice();
}

if (NO_COVERAGE) {
  console.log('Coverage not collected due to NO_COVERAGE=1');
}

console.log('Type checking is disabled during Jest for performance reasons, use `jest typecheck` when necessary.');

module.exports = {
  rootDir: __dirname,
  roots: ['<rootDir>'],
  cache: true,
  verbose: true,
  cacheDirectory: '<rootDir>/tmp/jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // preset configs
  // preset: 'ts-jest/presets/js-with-ts',
  // which files to test and which to ignore
  testMatch: ['**/src/tests/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/tmp/', '/coverage/', '/stories/', '/\\.storybook/'],
  // don't watch for file changes in node_modules
  watchPathIgnorePatterns: ['/node_modules/'],
  // jest automock settings
  automock: false,
  unmockedModulePathPatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['./jest.setup.js'],

  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  coverageThreshold: {
    "global": {
      "branches": 70,
      "functions": 85,
      "lines": 85,
      "statements": 85
    }
  },
  coveragePathIgnorePatterns: ['/node_modules/', '\\.json$', '/__tests__/', '/stories/', '/\\.storybook/'],


  transformIgnorePatterns: ['/node_modules/(?!(lodash-es|antd|[^/]+/es|rc-animate|rc-util)/).*'],
};