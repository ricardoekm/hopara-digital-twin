/* eslint-disable no-invalid-this */
const path = require('path')
const {nightwatch} = require('@hopara/system-test')

const BUILD_DIR_NAME = process.env['BUILD_DIR_NAME'] || 'build'
const buildPath = path.resolve(__dirname, '../', BUILD_DIR_NAME)
const server = nightwatch.createServer(buildPath)

server.listen(3456, 'localhost', function(err) {
  // eslint-disable-next-line
  console.log('server starting...', this.address())

  if (err) throw err
  nightwatch.spawCmd(this)
})
