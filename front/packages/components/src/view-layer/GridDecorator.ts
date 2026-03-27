import { BaseViewLayerProps } from './LayerFactory'
import { LayerFactoryChain } from './LayerFactoryChain'
import GridLayer from './deck/grid/grid-layer'
import { Grid } from '../grid/Grid'
import { SizeLiteralAccessor } from '@hopara/encoding/src/size/accessor/SizeLiteralAccessor'
import { ColorEncoding, ColorLiteralAccessor, SizeEncoding } from '@hopara/encoding'
import { BaseFactory } from './deck/factory/BaseFactory'
import { DeckLayerFactoryProps } from './DeckLayerFactory'
import { Layer } from '../layer/Layer'

export class GridDecorator<P extends BaseViewLayerProps> extends LayerFactoryChain<P> {
  grid?: Grid

  constructor(factoryProps: DeckLayerFactoryProps, layer: Layer) {
    super()
    this.grid = this.getLayerGrid(factoryProps, layer)
  }

  getLayerGrid(factoryProps: DeckLayerFactoryProps, layer: Layer) {
    // should preserve the layers order and visibility
    const layerGrids = factoryProps.layers
      ?.map((l) => {
        const grid = factoryProps.grids?.find((grid) => grid.layerId === l.getId())
        return { ...grid, visible: grid && l?.visible?.value } as Grid & {visible: boolean}
      })
      .filter((grid) => grid.visible)

    if (!layerGrids?.length || layerGrids[0].layerId !== layer.getId()) return
    
    const layerGrid = layerGrids[0]
    if ( factoryProps.isOnObjectEditor || factoryProps.isOnSettingsEditor ) {
      return layerGrid
    }

    if ( layerGrid.alwaysVisible ) {
      return layerGrid
    }

    return
  }

  shouldRender(props: P) {
    return this.grid && props.visible?.value
  }

  getAccessor(encoding: SizeEncoding) {
    return new SizeLiteralAccessor(encoding)
  }

  getColorAccessor(encoding: ColorEncoding) {
    return new ColorLiteralAccessor(encoding)
  }
  
  create(props: P) {
    if (!this.shouldRender(props)) return this.chain(props)

    const gridLayer = new GridLayer({
    id: `${props.layerId}-grid`,
    size: this.getAccessor(this.grid!.encoding.size!).getSize(),
    angle: this.grid!.encoding.angle?.getRenderValue(),
    strokeSize: this.getAccessor(this.grid!.encoding.strokeSize!).getSize(),
    strokeSizeUnits: this.grid!.encoding.getUnits(),
    strokeColor: this.getColorAccessor(this.grid!.encoding.strokeColor!).getColor(),
    updateTriggers: {
      size: BaseFactory.createEncodingTriggers(this.grid!.encoding.size, undefined),
      strokeSize: BaseFactory.createEncodingTriggers(this.grid!.encoding.strokeSize, undefined),
      color: BaseFactory.createEncodingTriggers(this.grid!.encoding.strokeColor, undefined)
    },
    pickable: false,
  } as any)

    const layers = this.chain(props)
    layers.unshift(gridLayer)
    return layers
  }
}
