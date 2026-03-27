export const validateConfig = (config: any) => {
  if (!config.authorization.accessToken) {
    throw new Error('Missing access token')
  }
  if (!config.visualizationId && !config.visualization && !config.app && !config.fallbackVisualizationId) {
    throw new Error('Missing visualization id')
  }
  if (config.dataLoaders?.length) {
    config.dataLoaders.forEach((dataLoader: any) => {
      if (!dataLoader.query) {
        throw new Error('Missing dataLoader query')
      }
      if (!dataLoader.source) {
        throw new Error('Missing dataLoader source')
      }
    })
  }
  if (config.filters?.length) {
    config.filters.forEach((filter: any) => {
      if (!filter.field) {
        throw new Error('Missing filter type')
      }
      if (!filter.values) {
        throw new Error('Missing filter values')
      }
    })
  }
}
