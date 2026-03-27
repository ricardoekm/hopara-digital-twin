import VisualizationRepository from '../repository/visualization-repository.js'
import {Logger} from '@hopara/logger'
import {BadRequestError, NotFoundError, UserInfo} from '@hopara/http-server'
import {SchemaMigration} from '../../schema/schema-updater.js'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'
import {InitialPosition, Legends, VisualizationSpec, VisualizationType} from '../domain/spec/Visualization.js'
import {Visualization} from '../domain/Visualization.js'
import {VisualizationValidator} from '../domain/validator/visualization-validator.js'
import {DatasetRepository} from '../../dataset/dataset-repository.js'
import {VisualizationSanitizer} from './visualization-sanitizer.js'
import {LayersFactory} from '../../layer/domain/factory/layers-factory.js'
import {FiltersFactory} from '../../filter/domain/filters-factory.js'
import {LayerSpec} from '../../layer/domain/spec/Layer.js'
import {FilterSpec} from '../../filter/domain/spec/Filter.js'
import { NotificationService } from '../../notification/NotificationService.js'
import { ValidationError } from '../../validation.js'

export interface VisualizationServiceResponse {
  id: string,
  message: string,
  name?: string,
  warnings?: ValidationError[]
  _link: string
}

export class VisualizationService {
  constructor(
    private readonly visualizationRepository: VisualizationRepository,
    private readonly logger: Logger,
    private readonly visualizationValidator: VisualizationValidator,
    private readonly datasetRepository: DatasetRepository,
    private readonly notificationService: NotificationService
  ) {
  }

  async get(appId: string, version: number | undefined, userInfo: UserInfo): Promise<Visualization> {
    this.logger.debug('handling get visualization', appId, version)
    let visualization
    if (version) {
      visualization = await this.visualizationRepository.getVersion(appId, version, userInfo)
    } else {
      visualization = await this.visualizationRepository.get(appId, userInfo)
    }
    if (!visualization) {
      throw new NotFoundError('Visualization not found')
    }
    return visualization
  }

  async list(group:string | undefined, userInfo: UserInfo): Promise<{ id: string, name: string, group: string, type: VisualizationType }[]> {
    this.logger.debug('handling get visualization')
    return this.visualizationRepository.list(group, userInfo)
  }

  async upsert(visualizationSpec: VisualizationSpec, validate = true, userInfo: UserInfo): Promise<VisualizationServiceResponse> {
    this.logger.debug('handling upsert visualization', visualizationSpec)
    if (!visualizationSpec.id) {
      throw new BadRequestError('Cannot upsert an visualization with no id')
    }

    const migratedSpec = SchemaMigration.migrate(visualizationSpec)

    let visualization = VisualizationFactory.fromSpec(migratedSpec)
    const columns = await this.datasetRepository.getColumns(visualization.getQueryKeys(), userInfo)
    visualization = VisualizationSanitizer.sanitize(visualization, columns)
    const warnings = await this.visualizationValidator.validate(visualization, validate, columns, userInfo)
    await this.visualizationRepository.upsert(visualization, userInfo)
    await this.notificationService.notify(visualization.id, userInfo.tenant, userInfo.sessionId)

    return {
      message: 'Visualization saved',
      id: visualization.id,
      name: visualizationSpec.name,
      _link: `/visualization/${visualization.id}`,
      warnings,
    }
  }

  async changeName(id: string, name: string, userInfo: UserInfo): Promise<VisualizationServiceResponse> {
    this.logger.debug('handling update visualization', id)

    const visualization = await this.visualizationRepository.get(id, userInfo)
    if (!visualization) {
      throw new NotFoundError('Visualization not found')
    }
    visualization.name = name
    await this.visualizationRepository.upsert(visualization, userInfo)
    return {
      message: 'Visualization name changed',
      id,
      name,
      _link: `/visualization/${id}`,
    }
  }

  async duplicate(sourceId: string, name: string, userInfo: UserInfo): Promise<VisualizationServiceResponse> {
    this.logger.debug('handling duplicate visualization', sourceId)
    const sourceApp = await this.visualizationRepository.get(sourceId, userInfo)
    if (!sourceApp) {
      throw new NotFoundError('Visualization not found')
    }
    const visualization = sourceApp.duplicate(name)
    await this.visualizationRepository.upsert(visualization, userInfo)
    return {
      message: 'Visualization duplicated',
      id: visualization.id,
      name: visualization.name,
      _link: `/visualization/${visualization.id}`,
    }
  }

  async delete(appId: string, userInfo: UserInfo): Promise<VisualizationServiceResponse> {
    this.logger.debug('handling update visualization', appId)
    await this.visualizationRepository.delete(appId, userInfo)

    return {
      message: 'Visualization deleted',
      id: appId,
      _link: `/visualization/${appId}`,
    }
  }

  async listHistory(appId: string, userInfo: UserInfo): Promise<any> {
    this.logger.debug(`handling list visualization history`, appId)
    return this.visualizationRepository.listHistory(appId, userInfo)
  }

  async rollback(id: string, version: number, userInfo: UserInfo): Promise<VisualizationServiceResponse> {
    this.logger.debug(`handling rollback visualization ${id} to version ${version}`)
    await this.visualizationRepository.rollback(id, version, userInfo)
    return {
      message: 'Visualization rolled back',
      id,
      _link: `/visualization/${id}`,
    }
  }

  async migrate(spec: VisualizationSpec): Promise<VisualizationSpec> {
    this.logger.debug('handling migrate visualization', spec)
    return SchemaMigration.migrate(spec)
  }

  updateVisualizationProps(visualization: Visualization, updatingVisualization: Record<any, any>): Visualization {
    Object.keys(updatingVisualization).forEach((key) => {
      let data = updatingVisualization[key]
      if (key === 'layers') data = LayersFactory.fromSpec(data)
      if (key === 'filters') data = FiltersFactory.fromSpec(data)
      visualization[key] = data
    })
    return visualization
  }

  async update(
    visualizationId: string,
    updatingVisualization: {
      layers: LayerSpec[]
      filters: FilterSpec[]
      legends: Legends
      initialPosition: InitialPosition
      mapStyle: string
    },
    userInfo: UserInfo
  ): Promise<any> {
    const visualization = await this.visualizationRepository.get(visualizationId, userInfo)
    if (!visualization) {
      throw new NotFoundError('Visualization not found')
    }
    this.updateVisualizationProps(visualization, updatingVisualization)
    const columns = await this.datasetRepository.getColumns(visualization.getQueryKeys(), userInfo)
    const warnings = await this.visualizationValidator.validate(visualization, true, columns, userInfo)
    await this.visualizationRepository.upsert(visualization, userInfo)
    return {message: 'Visualization updated', _link: `/visualization/${visualizationId}`, warnings}
  }

  async getFilters(id: string, userInfo: UserInfo): Promise<FilterSpec[]|undefined> {
    const visualization = await this.visualizationRepository.get(id, userInfo)
    if (!visualization) {
      throw new NotFoundError('Visualization not found')
    }
    return visualization.filters
  }
}
