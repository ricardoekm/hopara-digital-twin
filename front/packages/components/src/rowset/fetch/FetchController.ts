import { Query } from '@hopara/dataset'
import { Layers } from '../../layer/Layers'
import ViewState from '../../view-state/ViewState'
import { Rowsets } from '../Rowsets'
import { Box } from '@hopara/spatial'
import { VisualizationType } from '../../visualization/Visualization'
import { Rowset } from '../Rowset'

export type Prefetch = {
  rowset?: Rowset,
  targetViewState: ViewState
}

export const FetchControllerToken = Symbol('FetchController')

export interface FetchController {
  getFetchBox(fetchQuery: Query | undefined, visualizationType: VisualizationType, bleedFactor: number, visibleWorld?: Box): Box | undefined;
  getPrefetchs(layers:Layers, rowsets:Rowsets, viewState:ViewState) : Prefetch[];
  getRowsetsToFetch(layers:Layers, rowsets:Rowsets, viewState:ViewState) : Rowsets;
}
