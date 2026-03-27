const jestConfigBase = require('../../jest.config.base.cjs')
module.exports = {
  ...jestConfigBase,
  moduleNameMapper: {
    ...jestConfigBase.moduleNameMapper,
    '@material/material-color-utilities': 'identity-obj-proxy',
  },
}
