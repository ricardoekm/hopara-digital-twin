import {Layer} from '../Layer'
import {Layers} from '../Layers'
import {Queries} from '@hopara/dataset'
import Visualization from '../../visualization/Visualization'

export interface LayerEditorOwnProps {
  layer: Layer
  layers: Layers
  queries: Queries
  visualization: Visualization
}
