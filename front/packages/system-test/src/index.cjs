const visualizationMocks = require('./mocks/app.cjs')
const chartResponses = require('./mocks/chart-responses.cjs')
const geoResponses = require('./mocks/geo-responses.cjs')
const nightwatchConf = require('./nightwatch.conf.cjs')
const server = require('./tasks/server.cjs')
const nightwatchTask = require('./tasks/spawnNightwatch.cjs')

module.exports = {
  front: {
    port: 3456,
  },
  httpServer: {
    port: 1234,
    cors: {
      origin: 'http://localhost:3456',
      allowedHeaders: ['tenant', 'authorization', 'session-id'],
      credentials: true,
    },
  },
  responses: {
    visualization: visualizationMocks,
    chart: {
      default: chartResponses.default,
    },
    geo: {
      circle: geoResponses.circle,
      icon: geoResponses.icon,
      polygon: geoResponses.polygon,
    },
  },
  nightwatch: {
    conf: nightwatchConf,
    createServer: server.createServer,
    spawCmd: nightwatchTask,
  },
}
