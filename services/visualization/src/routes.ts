import {createTemplateVisualizationRoute} from './visualization/interface/create-template-visualization-route.js'
import {getVisualizationRoute} from './visualization/interface/get-visualization-route.js'
import {getVisualizationsRoute} from './visualization/interface/get-visualizations-route.js'
import {getVisualizationSchemaRoute} from './visualization/interface/get-visualization-schema-route.js'
import {getVisualizationHistoryRoute} from './visualization/interface/get-visualization-history-route.js'
import {deleteVisualizationRoute} from './visualization/interface/delete-visualization-route.js'
import {migrateVisualizationRoute} from './visualization/interface/migrate-visualization-route.js'
import {updateVisualizationNameRoute} from './visualization/interface/update-visualization-name-route.js'
import {patchVisualizationRoute} from './visualization/interface/patch-visualization-route.js'
import {putVisualizationRoute} from './visualization/interface/put-visualization-route.js'
import {rollbackVisualizationRoute} from './visualization/interface/rollback-visualization-route.js'
import {duplicateVisualizationRoute} from './visualization/interface/duplicate-visualization-route.js'
import {migrateRoute} from './migration/interface/migrate-route.js'
import {createFilterRoute} from './filter/interface/create-filter-route.js'
import {RouteFactory} from '@hopara/http-server'
import {getLayerDefaults} from './layer/interface/get-layer-defaults.js'
import {getVisualizationFiltersRoute} from './visualization/interface/get-visualization-filters-route.js'
import {listLayerTemplatesRoute} from './layer-template/interface/list-layer-templates-route.js'
import {getMetricsRoute} from './metrics/interface/get-metrics-route.js'

export const routes = [
  getMetricsRoute,
  deleteVisualizationRoute,
  getVisualizationSchemaRoute,
  getVisualizationRoute,
  getVisualizationsRoute,
  getVisualizationHistoryRoute,
  putVisualizationRoute,
  updateVisualizationNameRoute,
  migrateRoute,
  patchVisualizationRoute,
  getLayerDefaults,
  rollbackVisualizationRoute,
  migrateVisualizationRoute,
  createTemplateVisualizationRoute,
  duplicateVisualizationRoute,
  createFilterRoute,
  getVisualizationFiltersRoute,
  listLayerTemplatesRoute,
] as RouteFactory<any, any, any>[]
