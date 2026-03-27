/* eslint-disable */
import axios from 'axios'
import pg from "pg";
import {asClass, asFunction, asValue, AwilixContainer, createContainer, InjectionMode,} from 'awilix'
import {createLogger} from '@hopara/logger'

import {Config, config as fileConfig} from './config/index.js'
import {FieldValidator} from "./data/domain/field-validator.js";
import {QueryValidator} from './data/domain/query-validator.js'
import {DatasetRepository} from './dataset/dataset-repository.js'
import {connectWithRetry} from "./db/connect-with-retry.js";
import {PoolManager} from "./db/pool-manager.js";
import {TenantUserBasedTable} from "./db/tenant-user-based-table.js";
import {FiltersValidator} from "./filter/domain/filters-validator.js";
import {LayersValidator} from "./layer/domain/validator/layers-validator.js";
import {LayerValidator} from "./layer/domain/validator/layer-validator.js";
import {PrimaryKeyValidator} from './layer/domain/validator/primary-key-validator.js'
import {DataSourceFactory, MigrationService} from './migration/migration-service.js'
import {SchemaRepository} from './schema/schema-repository.js'
import {serverFactory} from './server-factory.js'
import {VisualizationValidator} from "./visualization/domain/validator/visualization-validator.js";
import VisualizationRepository from './visualization/repository/visualization-repository.js'
import {VisualizationEntity} from "./visualization/repository/visualization-entity.js";
import {TemplateRepository} from './visualization/repository/TemplateRepository.js'
import {VisualizationService} from './visualization/service/visualization-service.js'
import {TemplateVisualizationService} from './visualization/service/template-visualization-service.js'
import {LegendsValidator} from './visualization/domain/validator/legends-validator.js'
import {routes} from "./routes.js";
import {NotificationService} from './notification/NotificationService.js';
import {DataSource} from 'typeorm';
import {HttpServer} from '@hopara/http-server';
import {LayerTemplateService} from "./layer-template/service/layer-template-service.js";
import {MemoryLayerTemplateRepository} from "./layer-template/memory-layer-template-repository.js";

let container: AwilixContainer

export const containerFactory = async (localConfig?: Partial<Config>): Promise<AwilixContainer> => {
  if (!container) {
    const config = {
      ...fileConfig,
      ...localConfig,
    }

    container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    })

    const logger = createLogger({
      service: 'visualization',
      config: config.logger,
      version: config.version,
    })

    const retryOptions = {
      retryAttempts: config.database.retryAttempts,
      retryDelayMs: config.database.retryDelayMs,
    }

    const dataSourceFactory = new DataSourceFactory(config)
    const dataSource = await connectWithRetry(
      () => dataSourceFactory.create(undefined, [
        VisualizationEntity,
      ], config.logger.level as any),
      retryOptions,
      logger
    )
    logger.debug(`pwd: ${process.cwd()}`)
    logger.debug(`migrations: ${dataSource.migrations.length}`)

    const pool = new pg.Pool(config.database)

    container.register({
      dataSource: asValue(dataSource),
      container: asValue(container),
      logger: asValue(logger),
      config: asValue(config),
      serverConfig: asValue(config.server),
      authConfig: asValue(config.auth),
      version: asValue(config.version),
      datasetConfig: asValue(config.dataset),
      notificationConfig: asValue(config.notification),
      templateConfig: asValue(config.template),
      tenantConfig: asValue(config.tenant),
      templateVisualizationService: asClass(TemplateVisualizationService).singleton(),
      pool: asValue(pool),
      poolManager: asClass(PoolManager).singleton(),

      server: asFunction(serverFactory).singleton(),
      httpClient: asFunction(() => axios.create()).singleton(),

      visualizationTable: asValue(new TenantUserBasedTable({
        tableName: 'hp_apps',
        Entity: VisualizationEntity,
        pool,
        logger,
      })),

      visualizationHistoryTable: asValue(new TenantUserBasedTable({
        tableName: 'hp_apps_history',
        Entity: VisualizationEntity,
        pool,
        logger,
      })),

      visualizationRepository: asFunction(() => {
        return new VisualizationRepository(
          container.resolve<TenantUserBasedTable<VisualizationEntity>>('visualizationTable'),
          container.resolve<TenantUserBasedTable<VisualizationEntity>>('visualizationHistoryTable'),
          container.resolve<PoolManager>('poolManager'),
        )
      }),
      templateRepository: asClass(TemplateRepository).singleton(),

      // Entity
      legendsValidator: asClass(LegendsValidator).singleton(),

      // Dataset
      datasetRepository: asClass(DatasetRepository).singleton(),

      // Notification
      notificationService: asClass(NotificationService).singleton(),

      // Filter
      filtersValidator: asClass(FiltersValidator).singleton(),

      // Layer
      layersValidator: asClass(LayersValidator).singleton(),
      layerValidator: asClass(LayerValidator).singleton(),

      // Layer Template
      layerTemplateService: asClass(LayerTemplateService).singleton(),
      layerTemplateRepository: asClass(MemoryLayerTemplateRepository).singleton(),

      // Migration
      migrationService: asClass(MigrationService).singleton(),

      // Source
      fieldValidator: asClass(FieldValidator).singleton(),
      primaryKeyValidator: asClass(PrimaryKeyValidator).singleton(),
      queryValidator: asClass(QueryValidator).singleton(),

      // Visualization
      visualizationValidator: asClass(VisualizationValidator).singleton(),
      visualizationService: asClass(VisualizationService).singleton(),

      // Schema
      schemaRepository: asClass(SchemaRepository).singleton(),

      routes: asFunction(() => routes
        .map(route => container.build(asFunction(route)))
      ).singleton(),
    })
  }
  return container
}

export async function destroyContainer(container: AwilixContainer): Promise<void> {
  container.resolve<HttpServer>('server').stop()
  await container.resolve<PoolManager>('poolManager').close()
  await container.resolve<DataSource>('dataSource').destroy()
}
