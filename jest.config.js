module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(node-fetch|other-esm-dependency)/)'
    ],
    testTimeout: 20000,
    globals: {
      'ts-jest': {
        isolatedModules: true
      }
    },
    setupFiles: ['./jest.setup.js'],
  };
  