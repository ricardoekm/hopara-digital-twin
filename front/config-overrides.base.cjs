const path = require('path')
const {readdirSync} = require('fs')
const {override, babelInclude} = require('customize-cra')

const listPackages = () => {
  const packageDirs = readdirSync(path.resolve(__dirname, './packages'))
  return packageDirs.map((pkg) => {
    return path.resolve(__dirname, `./packages/${pkg}`)
  })
}

module.exports = {
  listPackages,
  webpack(config, env) {
    if (!config.plugins) config.plugins = []
    return Object.assign(config, override(babelInclude(listPackages()))(config, env))
  }
}
