import hoparaConfig from '@hopara/eslint-config/eslint.config.js'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import {fixupPluginRules} from '@eslint/compat'

const baseConfig = [
  ...hoparaConfig,

  // Allow underscore-prefixed args for polymorphic base class signatures
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    },
  },
  
  // Storybook
  {
    files: ['**/*.stories.jsx', '**/*.stories.tsx'],
    rules: {
      'no-unused-vars': 'off',
      'react/prop-types': 'off'
    },
  },
  
  // iframe
  {
    files: ['**/packages/iframe/**/*.ts', '**/packages/iframe/**/*.tsx'],
    plugins: {
      'react-hooks': fixupPluginRules(pluginReactHooks),
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]

export {baseConfig}
export default baseConfig 
