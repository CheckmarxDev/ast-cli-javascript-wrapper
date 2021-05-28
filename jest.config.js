const {defaults} = require('jest-config');
module.exports = {
  // ...
  //moduleFileExtensions: [...defaults.moduleFileExtensions, './src/tests/CxAuthCall.test.js', 'tsx'],
  "testMatch": [
      "**/.tests./**/*.+(ts|tsx)",
      "**/?(*.)+(spec|test).+(ts|tsx)"
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
  // ...
};


// module.exports = {
//   "roots": [
//     "<rootDir>/src"
//   ],
//   "testMatch": [
//     "**/__tests__/**/*.+(ts|tsx|js)",
//     "**/?(*.)+(spec|test).+(ts|tsx|js)"
//   ],
//   "transform": {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
// }