import hoparaConfig from '@hopara/eslint-config/eslint.config.js'

const baseConfig = [
  {
    ignores: [
      'out/'
    ]
  },
  ...hoparaConfig
]

export {baseConfig}
export default baseConfig