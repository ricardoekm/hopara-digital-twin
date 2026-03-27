const resemble = require('resemblejs')
const config = require('config')
const fs = require('fs')
const path = require('path')

const saveDiff = (filePath, data) => {
    try {
        const dirname = path.dirname(filePath)
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, {recursive: true})
        }
        fs.writeFileSync(filePath, data)
    } catch (e) {
        /* eslint-disable-next-line no-console */
        console.error('generate diff error', e)
    }
  }

exports.assertion = function(expectedImageName, misMatchPercentage, basePath = 'tests/golden-images') {
    const diffPath = path.resolve(basePath, 'diff')
    const expectedImage = path.resolve(basePath, expectedImageName)
    const tempPath = path.resolve(basePath, 'temp')
    const resultImage = path.resolve(tempPath, expectedImageName)

    this.message = 'Unexpected compareScreenshot error.'
    this.expected = misMatchPercentage || 0 // misMatchPercentage tolerance default 0%

    this.command = function(callback) {
        try {
            resemble(expectedImage)
                .compareTo(resultImage)
                .scaleToSameSize()
                .ignoreAntialiasing()
                .outputSettings({
                    errorColor: {
                      red: 255,
                      green: 0,
                      blue: 255,
                    },
                    outputDiff: true,
                  })
                .onComplete((data) => {
                  if (data.error) {
                      // eslint-disable-next-line no-console
                      console.log('onCompleteError', data.error)
                      throw new Error(data.error) 
                    }
                    if (data.getBuffer) saveDiff(`${diffPath}/${expectedImageName}`, data.getBuffer())
                    return callback({value: data}) // calls this.value with the result
                })
        } catch (err) {
          callback(err)
        }

        return this
    }

    this.value = function(result) {
      return result.value.rawMisMatchPercentage // value this.pass is called with
    }

    this.pass = function(value) {
       // this is not what you think it's :) used to generate all new screenshots for a test
       if (config.has('test.ignoreErrors') &&
            config.get('test.ignoreErrors') === 'true') {
            return true
       }

       // image not found
        if (!value && value !== 0) {
           return false
        }

        const pass = value <= this.expected
        this.message = `Comparing screenshot ${expectedImage} (diff: ${value}, max expected: ${this.expected})`
        return pass
    }
}
