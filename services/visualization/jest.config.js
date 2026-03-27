export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '<rootDir>/out',
    '<rootDir>/vega-lite',
  ],
  detectOpenHandles: true,
  testRegex: '^(?!.*.integration.test.ts$).*.test.ts$',
  reporters: ['<rootDir>./silent-reporter.js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^axios$': 'axios/dist/node/axios.cjs'
  },
}
