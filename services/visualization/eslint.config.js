import hoparaConfig from '@hopara/eslint-config/eslint.config.js'

const baseConfig = [
  ...hoparaConfig,
  {
    ignores: [
      'out/'
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      // Disable default ESLint rule for TypeScript files
      'no-undef': 'off',
      'import/extensions': 'off',
    },
  },
]

export {baseConfig}
export default baseConfig
