import config from 'config'
export default config

// So typescript copies it on build
import hack1 from './default.json'
import hack2 from './custom-environment-variables.json'
export { hack1, hack2 }
