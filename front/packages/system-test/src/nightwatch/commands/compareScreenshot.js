const path = require('path')

exports.command = function(expectedImageName, misMatchPercentage, basePath = 'tests/golden-images/', callback) {
  const api = this
  const resultPath = path.resolve(basePath, 'temp', expectedImageName)

  api.saveScreenshot(resultPath, () => {
      api.assert.compareScreenshot(expectedImageName, misMatchPercentage, basePath, function(result) {
          if (typeof callback === 'function') {
              callback.call(api, result)
          }
      })
  })

  return this // allows the command to be chained.
}
