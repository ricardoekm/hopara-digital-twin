import Filters from '../../filter/domain/Filters.js'
import {LayersImpl} from '../../layer/domain/LayersImpl.js'
import {
  AutoNavigation,
  EncodingScope,
  InitialPosition,
  Legend,
  VisualizationType,
  ZoomBehavior,
  ZoomBehaviorType,
} from './spec/Visualization.js'
import {QueryKeys} from '../../data/QueryKeys.js'
import {QueryKey} from '../../data/QueryKey.js'
import {randomUUID} from 'node:crypto'
import {Actions} from '../../layer/domain/spec/Action.js'
import { FixedZoomRange } from '../../layer/domain/spec/FixedZoomRange.js'
import { ThreeDLights } from '../../lights/3DLights.js'
import { Grid } from '../../grid/Grid.js'

const DEFAULT_MAP_STYLE = 'building'

let nullVisualization: Visualization

export class Visualization {
  $schema: string
  id: string
  name?: string
  group?: string
  type: VisualizationType
  encodingScope?: EncodingScope
  zoomRange?: FixedZoomRange
  initialPosition?: InitialPosition
  autoNavigation?: AutoNavigation
  filters?: Filters
  layers?: LayersImpl
  legends?: Legend[]
  zoomBehavior: ZoomBehavior
  mapStyle: string
  actions: Actions
  scope?: string
  lights?: ThreeDLights
  animationFps?: number
  bleedFactor?: number
  grids?: Grid[]
  backgroundColor?: string

  constructor(props?: Partial<Visualization>) {
    Object.assign(this, props ?? {})

    this.id = this.id ? this.id.toString() : randomUUID()

    this.filters = new Filters(...(this.filters ?? []))
    this.zoomBehavior = {
      x: this.zoomBehavior?.x ?? ZoomBehaviorType.SCALE,
      y: this.zoomBehavior?.y ?? ZoomBehaviorType.SCALE,
    }
    if (this.type === VisualizationType.GEO) {
      this.mapStyle = this.mapStyle ?? DEFAULT_MAP_STYLE
    }
    this.zoomRange = this.zoomRange ?? {min: {value: 0}, max: {value: 24}}
    this.encodingScope = this.encodingScope ?? EncodingScope.QUERY
    this.actions = this.actions ?? []
    this.animationFps = this.animationFps ?? 24
    this.bleedFactor = this.bleedFactor ?? 8
  }

  getQueryKeys(): QueryKeys {
    let queryKeys: QueryKey[] = []
    if (this.layers) {
      queryKeys = queryKeys.concat(this.layers.getQueryKeys())
    }

    if (this.filters) {
      queryKeys = queryKeys.concat(this.filters.getQueryKeys())
    }
    return new QueryKeys(...queryKeys).unique()
  }

  static null(): Visualization {
    if (!nullVisualization) {
      nullVisualization = new Visualization({
        id: 'any-id',
        name: 'null-visualization',
      })
    }
    return nullVisualization
  }

  toString(): string {
    return JSON.stringify(this)
  }

  duplicate(name: string): Visualization {
    return new Visualization({
      ...this,
      id: randomUUID(),
      name,
      group: undefined,
    })
  }
}

