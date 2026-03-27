import {Rowsets} from '../rowset/Rowsets'
import {Layer} from './Layer'

type LayerToBooleanFn = (layer: Layer) => boolean

export function fromZoom(zoom:number): LayerToBooleanFn {
  return (layer:Layer) => layer.belongsToZoom(zoom)
}

export const hasData = (layer:Layer) => layer.hasData()

export function isDataLoaded(rowsets: Rowsets):LayerToBooleanFn {
  return (layer:Layer) => {
    return rowsets.withData(layer.getData()).length > 0
  }
}

export function withDataLoaded(rowsets:Rowsets): LayerToBooleanFn {
  return (layer:Layer) => {
    return isDataLoaded(rowsets)(layer)
  }
}
