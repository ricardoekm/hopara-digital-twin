module.exports = {
  transform: {
    '^.+\\.(ts|tsx)?$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '.+\\.(css|png|jpg|gif|glb)$': 'identity-obj-proxy',
    '.+\\.svg': '<rootDir>../../__mocks__/svg.ts',
    '@mapbox/tiny-sdf': 'identity-obj-proxy',
    'maplibre-gl': 'identity-obj-proxy',
    'tsx-create-element': 'identity-obj-proxy',
  },
  reporters: ['<rootDir>../../silent-reporter.cjs'],
  roots: ['<rootDir>/src', '<rootDir>../../__mocks__'],
  testEnvironment: 'jsdom',
  injectGlobals: true,
  setupFiles: ['<rootDir>../../jest.setup.cjs'],
  transformIgnorePatterns: ['/node_modules/(?!@material/material-color-utilities/)'],
}
