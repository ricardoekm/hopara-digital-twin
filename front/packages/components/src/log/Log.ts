import {Config} from '@hopara/config'
import {Debug, Logger} from '@hopara/internals'

export const logVisualizationInfo = () => {
  if (!Debug.isDebugging()) return
  const envs = ['HOPARA_ENV', 'PACKAGE_VERSION', 'BUILD_NUMBER', 'VISUALIZATION_API_ADDRESS', 'BFF_API_ADDRESS', 'DATASET_API_ADDRESS']
  return envs.forEach((env) => Logger.info(env, '=', Config.getValue(env as any)))
}
