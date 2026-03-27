const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

const appVersion = () => {
  if (!process.env.BUILD_NUMBER) return pkg.version
  return `${pkg.version}+${process.env.BUILD_NUMBER}`
}

const getGTMKey = () => {
  if (process.env.BUILD_ENV === 'production') return 'GTM-5HS5GGJQ'
  return 'GTM-PSBHVD56'
}

const gtagKey = () => {
  if (process.env.BUILD_ENV === 'production') return 'G-F9QZ8QCDRJ'
  return 'G-Y4316S1X9E'
}

const resolvePath = (resourcePath) => {
  return path.resolve(__dirname, '..', resourcePath)
}

const readFile = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return reject(err)
    return resolve(data)
  })
})

const saveFile = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) return reject(err)
    return resolve()
  })
})

const replaceIn = (replaceCases, str) => {
  return replaceCases.reduce((str, c) => {
    return str.replace(new RegExp(c[0], 'g'), c[1])
  }, str)
}

module.exports.main = () => {
  const HTML_VERSION = process.env['HTML_VERSION'] || 'default'
  const srcPath = resolvePath(HTML_VERSION === 'test' ? './resources/index-test.html' : './resources/index.html')
  const destPath = resolvePath('./public/index.html')

  const CONFIG = {
    gmtKey: process.env.GTM_KEY || getGTMKey(),
    gtagKey: process.env.GTAG_KEY || gtagKey(),
    appName: process.env.GTAG_APP_NAME || 'Kyrix',
    appVersion: appVersion(),
  }
   
  const replaceCases = [
    ['%VERSION%', appVersion()],
    ['%GTM_KEY%', CONFIG.gmtKey],
    ['%GTAG_KEY%', CONFIG.gtagKey],
    ['%GTAG_APP_NAME%', CONFIG.appName],
    ['%GTAG_APP_VERSION%', CONFIG.appVersion],
  ]

  readFile(srcPath)
      .then((fileString) => {
        const replacedFileString = replaceIn(replaceCases, fileString)
        return saveFile(destPath, replacedFileString)
      })
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
}

// execute script
// eslint-disable-next-line no-invalid-this
this.main()
