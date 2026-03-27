const path = require('path')
const {responses, httpServer, front} = require('@hopara/system-test')
const mockServer = require('mockttp').getLocal({cors: httpServer.cors})

const waitTime = () => {
  if (process.env.DEBUGGER) return 1200000
  return 5000
}

const mismatchPercentage = 0.2

const goldenImagesDir = path.resolve(__dirname, '..', 'golden-images')

module.exports = {
  'before': async () => await mockServer.start(httpServer.port),
  'after': async () => await mockServer.stop(),

  'Circle Layer': (browser) => {
    mockServer.get('/visualization/circle').thenReply(200, JSON.stringify(responses.visualization.circle))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.circle))

    browser.setWindowSize(1280, 800)
           .url(`http://localhost:${front.port}/test/circle`)
           .pause(waitTime())
           .compareScreenshot('circle-layer.png', mismatchPercentage, goldenImagesDir)
  },
  'Polygon Layer': (browser) => {
    mockServer.get('/visualization/polygon').thenReply(200, JSON.stringify(responses.visualization.polygon))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.polygon))

    browser.setWindowSize(1280, 800)
           .url(`http://localhost:${front.port}/test/polygon`)
           .pause(waitTime())
           .compareScreenshot('polygon-layer.png', mismatchPercentage, goldenImagesDir)
           .end()
  },
  'Chart': (browser) => {
    mockServer.get('/visualization/chart').thenReply(200, JSON.stringify(responses.visualization.chart))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.chart.default))

    browser.setWindowSize(1280, 800)
           .url(`http://localhost:${front.port}/test/chart`)
           .pause(waitTime())
           .compareScreenshot('chart-line-layer.png', mismatchPercentage, goldenImagesDir)
           .end()
  },
}
