import { getType } from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import { Reducer } from '@hopara/state'
import { Grid } from './Grid'
import { ColorEncoding, EncodingConfig, Encodings, SizeEncoding, SizeUnits } from '@hopara/encoding'
import { SizeTranslator } from '../layer/factory/SizeTranslator'
import { Store } from '../state/Store'
import { plainToClass } from 'class-transformer'
import ViewState from '../view-state/ViewState'

const getDefaultEncodings = (globalState: Store, layerId: string) => {
  const viewState = globalState.viewState!
  const referenceLayer = globalState.layerStore.layers.getById(layerId)
  const minReferenceZoom = referenceLayer?.visible.zoomRange.getMin() ?? viewState!.zoomRange.getMin()
  const maxReferenceZoom = referenceLayer?.visible.zoomRange.getMax() ?? viewState!.zoomRange.getMax()
  
  return new Encodings({
    angle: new SizeEncoding({value: 90}),
    size: new SizeEncoding({
      value: 50,
      referenceZoom: minReferenceZoom,
      sizeTranslator: new SizeTranslator(viewState, false, SizeUnits.COMMON, minReferenceZoom)
    }),
    strokeSize: new SizeEncoding({
      value: 1,
      referenceZoom: maxReferenceZoom,
      sizeTranslator: new SizeTranslator(viewState, false, SizeUnits.COMMON, maxReferenceZoom)
    }),
    strokeColor: new ColorEncoding({value: '#000', opacity: 0.6}),
    config: new EncodingConfig({units: SizeUnits.COMMON})
  })
}

class GridState extends Array<Grid> {
  clone() {
    return new GridState(...this)
  }

  removeGrid(grid: Partial<Grid>) {
    const cloned = this.clone()
    const currentIndex = cloned.findIndex((d) => d.layerId === grid.layerId)
    cloned.splice(currentIndex, 1)
    return cloned
  }

  addGrid(grid: Grid) {
    const cloned = this.clone()
    cloned.push(grid)
    return cloned
  }

  getByLayerId(layerId:string) {
    return this.find((grid) => grid.layerId === layerId)
  }

  updateSizeEncoding(layerId: string, encodingName: string, encoding: SizeEncoding) {
    const grid = this.getByLayerId(layerId)
    if (!grid) return this
 
    const cloned = this.clone()
    const currentIndex = cloned.findIndex((d) => d.layerId === grid.layerId)
    cloned.splice(currentIndex, 1, {
      ...grid,
      encoding: new Encodings({
        ...grid.encoding,
        [encodingName]: encoding
      })
    })

    return cloned
  }

  fillSizeTranslator(viewState: ViewState) {
    if ( !viewState ) {
      return this
    }

    const cloned = this.clone()
    cloned.forEach((grid) => {
      grid.encoding.size = new SizeEncoding({
        ...grid.encoding.size,
        sizeTranslator: new SizeTranslator(viewState, false, grid.encoding.config?.units, grid.encoding.size?.referenceZoom)
      })

      grid.encoding.strokeSize = new SizeEncoding({
        ...grid.encoding.strokeSize,
        sizeTranslator: new SizeTranslator(viewState, false, grid.encoding.config?.units, grid.encoding.strokeSize?.referenceZoom)
      })
    })
    return cloned
  }
}

export const gridReducer: Reducer<GridState, ActionTypes> = (state = new GridState(), action, globalState): GridState => {
  switch (action.type) {
    case getType(actions.visualization.fetch.success):
      return new GridState(...action.payload.grids).fillSizeTranslator(globalState.viewState)
    case getType(actions.view.viewLoaded): 
      return state.fillSizeTranslator(globalState.viewState)  
    case getType(actions.grid.enable): {
      if (state.getByLayerId(action.payload.layerId)) return state.removeGrid({layerId: action.payload.layerId})
      return state.addGrid({layerId: action.payload.layerId, encoding: getDefaultEncodings(globalState, action.payload.layerId)})
    }
    case getType(actions.grid.sizeChanged): {
      return state.updateSizeEncoding(action.payload.layerId, 'size', action.payload.encoding)
    }
    case getType(actions.grid.strokeSizeChanged): {
      return state.updateSizeEncoding(action.payload.layerId, 'strokeSize', action.payload.encoding)
    }
    case getType(actions.grid.codeChanged): {
      return new GridState(...plainToClass(Grid, action.payload.code)).fillSizeTranslator(globalState.viewState)
    }
    default:
      return state
  }
}
