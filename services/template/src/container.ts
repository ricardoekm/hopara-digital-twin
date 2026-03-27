import {
    asClass, asFunction, asValue, AwilixContainer, createContainer, InjectionMode,
  } from 'awilix'
import axios from 'axios'
import 'reflect-metadata'

import {config} from './config'
import { listTemplateRoute } from './template/interface/list-template-route'
import { TemplateService } from './template/TemplateService'
import { getTemplateRoute } from './template/interface/get-template-route'
import { getVisualizationRoute } from './template/interface/get-visualization-route'
import { getQueryRoute } from './template/interface/get-query-route'
import {serverFactory} from './server-factory'
import {createLogger} from '@hopara/logger'
import { QueryService } from './query/QueryService'
import { VisualizationService } from './visualization/VisualizationService'
import { ResourceRepository } from './resource/ResourceRepository'
import { getScriptRoute } from './template/interface/get-script-route'
import { ScriptService } from './script/ScriptService'
import { IndexService } from './index/IndexService'
import { indexRoute } from './template/interface/index-route'
import { QueryIndexService } from './index/QueryIndexService'
import { ImageIndexService } from './index/ImageIndexService'
import { ScriptIndexService } from './index/ScriptIndexService'
import { FileSystemRepository } from './storage/filesystem/FileSystemRepository'
import { getMetricsRoute } from './metrics/interface/get-metrics-route'

let container: AwilixContainer

export const containerFactory = async (): Promise<AwilixContainer> => {
  if (!container) {
    container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    })

    const logger = createLogger({
      service: 'template-service',
      config: config.logger,
      version: config.version,
    })

    container.register({
      container: asValue(container),
      server: asFunction(serverFactory).singleton(),
      logger: asValue(logger),
      config: asValue(config),
      datasetConfig: asValue(config.dataset),
      resourceConfig: asValue(config.resource),

      httpClient: asFunction(() => axios.create()).singleton(),
      fsConfig: asValue(config.fs),
      storage: asClass(FileSystemRepository).singleton(),

      queryService: asClass(QueryService).singleton(),
      scriptService: asClass(ScriptService).singleton(),
      visualizationService: asClass(VisualizationService).singleton(),
      resourceRepository: asClass(ResourceRepository).singleton(),
      templateService: asClass(TemplateService).singleton(),
      indexService: asClass(IndexService).singleton(),
      queryIndexService: asClass(QueryIndexService).singleton(),
      imageIndexService: asClass(ImageIndexService).singleton(),
      scriptIndexService: asClass(ScriptIndexService).singleton(),

      routes: asFunction(() => {
        return [
          container.build(asFunction(getMetricsRoute)),
          container.build(asFunction(listTemplateRoute)),
          container.build(asFunction(getTemplateRoute)),
          container.build(asFunction(getVisualizationRoute)),
          container.build(asFunction(getQueryRoute)),
          container.build(asFunction(getScriptRoute)),
          container.build(asFunction(getTemplateRoute)),
          container.build(asFunction(indexRoute)),
        ]
      }).singleton(),
    })
  }

  return container
}
