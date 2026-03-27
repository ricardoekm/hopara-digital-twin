import {
  asClass, asFunction, asValue, AwilixContainer, createContainer, InjectionMode,
} from 'awilix'
import axios from 'axios'
import http from 'http'
import https from 'https'
import 'reflect-metadata'
import {Client as MapsClient} from '@googlemaps/google-maps-services-js'

import {config} from './config'
import {serverFactory} from './server-factory'
import {createLogger} from '@hopara/logger'
import { VisualizationService } from './visualization/VisualizationService'
import { VisualizationRepository } from './visualization/VisualizationRepository'
import {getVisualizationRoute} from './visualization/interface/get-visualization-route'
import { DatasetRepository } from './query/DatasetRepository'
import { TemplateService } from './template/TemplateService'
import { saveVisualizationRoute } from './visualization/interface/save-visualization'
import {listIconLibrariesRoute} from './resource/interface/list-icon-libraries'
import {ResourceService} from './resource/ResourceService'
import {ResourceRepository} from './resource/ResourceRepository'
import { LayerRepository } from './layer/LayerRepository'
import {getVisualizationsQueryKeys} from './visualization/interface/get-visualizations-views'
import {LayerTemplateRepository} from './layer-template/LayerTemplateRepository'
import { rollback } from './rollback/interface/rollback'
import { RollbackService } from './rollback/RollbackService'
import { getRoomsRoute } from './room/interface/get-rooms'
import { RoomService } from './room/RoomService'
import { LayerService } from './layer/LayerService'
import { getLayerDataRoute } from './layer/interface/get-layer-data'
import { getSuggestionsRoute } from './place/routes/get-suggestions'
import { getPlaceRoute } from './place/routes/get-place'
import { PlaceRepository } from './place/place-repository'
import { PlaceService } from './place/place-service'
import { TemplateRepository } from './template/TemplateRepository'
import { getMetricsRoute } from './metrics/interface/get-metrics-route'
import { saveSampleVisualizationsRoute } from './visualization/interface/save-sample-visualizations'

let container: AwilixContainer

export const containerFactory = async (): Promise<AwilixContainer> => {
  if (!container) {
    container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    })

    const logger = createLogger({
      service: config.service.name,
      config: config.logger,
      version: config.version,
    })

    container.register({
      container: asValue(container),
      server: asFunction(serverFactory).singleton(),
      logger: asValue(logger),
      config: asValue(config),
      visualizationConfig: asValue(config.visualization),
      resourceConfig: asValue(config.resource),
      datasetConfig: asValue(config.dataset),
      templateConfig: asValue(config.template),
      authConfig: asValue(config.auth),

      httpClient: asFunction(() => axios.create({
        timeout: config.http.timeout,
        httpAgent: new http.Agent(config.http),
        httpsAgent: new https.Agent(config.http),
      })).singleton(),

      visualizationService: asClass(VisualizationService).singleton(),
      visualizationRepository: asClass(VisualizationRepository).singleton(),
      layerRepository: asClass(LayerRepository).singleton(),
      datasetRepository: asClass(DatasetRepository).singleton(),
      templateService: asClass(TemplateService).singleton(),
      templateRepository: asClass(TemplateRepository).singleton(),
      resourceService: asClass(ResourceService),
      resourceRepository: asClass(ResourceRepository),
      layerTemplateRepository: asClass(LayerTemplateRepository).singleton(),
      rollbackService: asClass(RollbackService).singleton(),
      roomService: asClass(RoomService).singleton(),
      layerService: asClass(LayerService).singleton(),
      placeRepository: asClass(PlaceRepository).singleton(),
      placeService: asClass(PlaceService).singleton(),

      googleMapsClient: asValue(new MapsClient({config: {params: {key: config.google.key}}})),

      routes: asFunction(() => {
        return [
          container.build(asFunction(getMetricsRoute)),
          container.build(asFunction(getVisualizationsQueryKeys)),
          container.build(asFunction(getVisualizationRoute)),
          container.build(asFunction(saveVisualizationRoute)),
          container.build(asFunction(saveSampleVisualizationsRoute)),
          container.build(asFunction(listIconLibrariesRoute)),
          container.build(asFunction(getRoomsRoute)),
          container.build(asFunction(getLayerDataRoute)),
          container.build(asFunction(rollback)),
          container.build(asFunction(getSuggestionsRoute)),
          container.build(asFunction(getPlaceRoute)),
        ]
      }).singleton(),
    })
  }

  return container
}
