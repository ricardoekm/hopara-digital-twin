const {responses, httpServer, front} = require('@hopara/system-test')
const mockServer = require('mockttp').getLocal({cors: httpServer.cors})

const waitTime = () => {
  if (process.env.DEBUGGER) return 1200000
  return 1000
}

module.exports = {
  'before': async () => {
    await mockServer.start(httpServer.port)
  },
  'after': async () => {
    await mockServer.stop()
  },
  'Pan Chart': (browser) => {
    mockServer.get('/visualization/chart').thenReply(200, JSON.stringify(responses.visualization.chart))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.chart.default))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/chart`)
      .pause(waitTime())
      .waitForElementVisible('#visualization-nav-bar')
      .fpsMeterInit()
      .pan('#deckgl-wrapper', {offsetX: -400, offsetY: 300})
      .assert.fpsMeter({mean: 22, percentile80: 30})
      .end()
  },
  'Zoom Chart': (browser) => {
    mockServer.get('/visualization/chart').thenReply(200, JSON.stringify(responses.visualization.chart))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.chart.default))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/chart`)
      .pause(waitTime())
      .waitForElementVisible('#visualization-nav-bar')
      .fpsMeterInit()
      .zoom('#deckgl-overlay')
      .assert.fpsMeter({mean: 28, percentile80: 30})
      .end()
  },
  'Pan Icon': (browser) => {
    mockServer.get('/visualization/icon').thenReply(200, JSON.stringify(responses.visualization.icon))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.icon))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/icon`)
      .waitForElementVisible('#visualization-nav-bar')
      .pause(waitTime())
      .fpsMeterInit()
      .pan('#deckgl-wrapper', {offsetX: -300, offsetY: 300})
      .assert.fpsMeter({mean: 21, percentile80: 30})
      .end()
  },
  'Zoom Icon': (browser) => {
    mockServer.get('/visualization/icon').thenReply(200, JSON.stringify(responses.visualization.icon))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.icon))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/icon`)
      .waitForElementVisible('#visualization-nav-bar')
      .pause(waitTime())
      .fpsMeterInit()
      .zoom('#deckgl-overlay')
      .assert.fpsMeter({mean: 22, percentile80: 24})
      .end()
  },
  'Pan Circle': (browser) => {
    mockServer.get('/visualization/circle').thenReply(200, JSON.stringify(responses.visualization.circle))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.circle))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/circle`)
      .waitForElementVisible('#visualization-nav-bar')
      .pause(waitTime())
      .fpsMeterInit()
      .pan('#deckgl-wrapper', {offsetX: -300, offsetY: 300})
      .assert.fpsMeter({mean: 27, percentile80: 30})
      .end()
  },
  'Zoom Circle': (browser) => {
    mockServer.get('/visualization/circle').thenReply(200, JSON.stringify(responses.visualization.circle))
    mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.circle))

    browser.setWindowSize(1280, 800)
      .url(`http://localhost:${front.port}/test/circle`)
      .waitForElementVisible('#visualization-nav-bar')
      .pause(waitTime())
      .fpsMeterInit()
      .zoom('#deckgl-overlay')
      .assert.fpsMeter({mean: 28, percentile80: 28})
      .end()
  },
}
