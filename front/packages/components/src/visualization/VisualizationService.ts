import {classToPlain} from 'class-transformer'
import * as VisualizationRepository from './VisualizationRepository'
import Visualization from './Visualization'
import {Authorization} from '@hopara/authorization'
import {Layers} from '../layer/Layers'
import {Filters} from '../filter/domain/Filters'
import {Legends} from '../legend/Legends'
import ViewState from '../view-state/ViewState'
import {httpGet} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Floors} from '../floor/Floors'
import { Grid } from '../grid/Grid'

export const saveVisualization = async (
  visualizationId: string,
  visualization: Visualization,
  viewState: ViewState,
  layers: Layers,
  filters: Filters,
  legends: Legends,
  floors: Floors,
  grids: Grid[],
  authorization: Authorization,
): Promise<any> => {
  const plainVisualization = classToPlain(visualization)
  const payload = {
    ...plainVisualization,
    layers: layers.toRaw(),
    filters: classToPlain(filters),
    legends: classToPlain(legends),
    initialPosition: viewState.initialPosition,
    zoomRange: classToPlain(viewState.zoomRange),
    zoomBehavior: viewState.zoomBehavior,
    floors: classToPlain(floors),
    grids: classToPlain(grids),
  }

  return VisualizationRepository.put(visualizationId, payload, authorization)
}

export const listFilters = async (visualizationId: string, authorization: Authorization) => {
  const res = await httpGet(Config.getValue('VISUALIZATION_API_ADDRESS'), `/visualization/${visualizationId}/filters`, {}, authorization)
  return res.data
}
