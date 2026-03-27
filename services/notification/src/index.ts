process.env['NODE_CONFIG_DIR'] = __dirname + '/config'
import * as server from './server'
import container from './container'


server.start(container.appConfig, container.logger)
