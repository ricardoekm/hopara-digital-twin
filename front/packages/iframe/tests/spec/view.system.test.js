const path = require('path')
const {responses, httpServer, front} = require('@hopara/system-test')
const mockServer = require('mockttp').getLocal({cors: httpServer.cors})

const waitTime = () => {
  if (process.env.DEBUGGER) return 1200000
  return 2000
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
      .url(`http://localhost:${front.port}/`)
      .execute(() => {
        window.postMessage({
          toolbar: false,
          visualizationId: 'circle',
          tenant: 'hopara.io',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ0ZW5hbnRzIjpbImhvcGFyYS5pbyJdLCJzY29wZSI6ImFwcDpsaXN0IGFwcDpyZWFkIHJlc291cmNlOnJlYWQgcm93OnJlYWQgdGVuYW50OnJlYWQgcmVzb3VyY2U6d3JpdGUgcm93OndyaXRlIGRhdGEtc291cmNlOnJlYWQgYXBwOndyaXRlIHRhYmxlOndyaXRlIGRhdGEtc291cmNlOndyaXRlIHZpZXc6d3JpdGUiLCJleHAiOjIwMzM5MjU2NTV9.wr6kuk3y42nT9V19U8kNMTp5iPSqJuds7IQp03ILH18',
          targetElementId: 'embedded-target-element',
          __hopara__eventType__: 'init',
        }, '*')
      })
      .pause(waitTime())
      .waitForElementVisible('#visualization-nav-bar')
      .compareScreenshot('circle-layer.png', mismatchPercentage, goldenImagesDir)
  },
  // 'Circle Layer With Entites': (browser) => {
  //   mockServer.get('/visualization/circle').thenReply(200, JSON.stringify(responses.visualization.circleWithEntities))
  //   mockServer.get('/view/queryName/row').thenReply(200, JSON.stringify(responses.geo.circle))
  //
  //   browser.setWindowSize(1280, 800)
  //     .url(`http://localhost:${front.port}/`)
  //     .execute(() => {
  //       window.postMessage({
  //         visualizationId: 'circle',
  //         tenant: 'hopara.io',
  //         accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ0ZW5hbnRzIjpbImhvcGFyYS5pbyJdLCJzY29wZSI6ImFwcDpsaXN0IGFwcDpyZWFkIHJlc291cmNlOnJlYWQgcm93OnJlYWQgdGVuYW50OnJlYWQgcmVzb3VyY2U6d3JpdGUgcm93OndyaXRlIGRhdGEtc291cmNlOnJlYWQgYXBwOndyaXRlIHRhYmxlOndyaXRlIGRhdGEtc291cmNlOndyaXRlIHZpZXc6d3JpdGUiLCJleHAiOjIwMzM5MjU2NTV9.wr6kuk3y42nT9V19U8kNMTp5iPSqJuds7IQp03ILH18',
  //         targetElementId: 'embedded-target-element',
  //         __hopara__eventType__: 'init'
  //       }, '*')
  //     })
  //     .pause(waitTime())
  //     .waitForElementVisible('#_hopara_main_view_')
  //     .compareScreenshot('circle-layer-with-entities.png', mismatchPercentage)
  // },
}
