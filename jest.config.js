module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'isomorphic-fetch': 'isomorphic-fetch',
    'mongodb-memory-server-global': 'mongodb-memory-server-global',
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(node-fetch|isomorphic-fetch|other-esm-dependency)/)'
  ],
  testTimeout: 30000, // Increase the default test timeout
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  setupFiles: ['./jest.setup.js'],
};
