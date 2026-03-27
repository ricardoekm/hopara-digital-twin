import fs from './cube-layer-fragment.glsl'
import vs from './cube-layer-vertex.glsl'
import { LayerProps } from '@deck.gl/core/lib/layer'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Accessor, DefaultProps, Layer, UNIT, UpdateParameters } from '@deck.gl/core/typed'
import { picking, project32 } from '@deck.gl/core'
import { CubeGeometry, Model } from '@luma.gl/core'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'
import GL from '@luma.gl/constants'
import { isNumber } from 'lodash/fp'

/**
* Cuboid information. The cube does not need to have equal dimensions.
*/
export interface Cube {
  
  /**
  * Ordinal position.
  */
  ordinal?: number;
  
  /**
  * Flag whether this cube is a "placeholder" and is not to be rendered nor contains cube data.
  */
  isEmpty?: boolean;
  
  color: RGBAColor;
  lineColor?: RGBAColor;
  position: [number, number, number];
  size: [number, number, number];
}

export interface CubeLayerDefaultProps<DataT> {
  getFillColor?: Accessor<DataT, RGBAColor>;
  getSize?: Accessor<DataT, number[] | number>;
  getLineColor?: Accessor<DataT, RGBAColor>;
  getLineWidth?: Accessor<DataT, number>;
  getPosition?: Accessor<DataT, number[]>;
  getPositionAnchor?: Accessor<DataT, 'start' | 'middle' | 'end'>;
  sizeMaxPixels?: number[] | number;
  sizeMinPixels?: number[] | number;
  sizeUnits?: SizeUnits;
  lineWidthUnits?: SizeUnits;
  filled?: boolean;
  stroked?: boolean;
  padding?: number;
  paddingRelativeToSize?: boolean;
}

export type CubeLayerProps<DataT = any> = LayerProps<Cube> & CubeLayerDefaultProps<DataT> & LayerProps<DataT>;
const DEFAULT_COLOR: RGBAColor = [255, 0, 255, 255]

const defaultProps: DefaultProps<CubeLayerDefaultProps<any>> = {
  getSize: {type: 'accessor', value: (x) => x.size},
  getPosition: {type: 'accessor', value: (x) => x.position},
  getFillColor: {type: 'accessor', value: (x) => x.color},
  getLineColor: {type: 'accessor', value: [108, 56, 222, 255]},
  getLineWidth: {type: 'accessor', value: 1},
  getPositionAnchor: {type: 'accessor', value: () => 'middle'},
  sizeMaxPixels: {type: 'number', value: Number.MAX_SAFE_INTEGER, min: 0},
  sizeMinPixels: {type: 'number', value: 0, min: 0},
  sizeUnits: SizeUnits.METERS,
  lineWidthUnits: SizeUnits.METERS,
  filled: true,
  stroked: false,
  padding: 0,
  paddingRelativeToSize: false,
}

export class CubeLayer<DataT = any, ExtraPropsT extends {} = {}> extends Layer<
ExtraPropsT & Required<CubeLayerProps<DataT>>
> {
  static layerName = 'CubeLayer'
  static defaultProps = defaultProps
  
  getShaders() {
    return super.getShaders({vs, fs, modules: [project32, picking]})
  }
  
  formatInstanceSizes(size) {
    if (isNumber(size)) {
      return [size, size, 0]
    }

    return size
  }

  formatInstanceAnchors(anchor) {
    if (isNumber(anchor)) return anchor > 1 || anchor < -1 ? 0 : anchor
    return anchor === 'start' ? 1 : anchor === 'middle' ? 0 : -1
  }
  
  initializeState() {
    this.getAttributeManager()!.addInstanced({
      instancePositions: {
        size: 3,
        type: GL.DOUBLE,
        fp64: this.use64bitPositions(),
        transition: true,
        accessor: 'getPosition',
      },
      instanceAnchors: {
        size: 1,
        accessor: 'getPositionAnchor',
        transform: this.formatInstanceAnchors,
        defaultValue: 0,
      },
      instanceSizes: {
        size: 3,
        transition: true,
        accessor: 'getSize',
        transform: this.formatInstanceSizes,
      },
      instanceFillColors: {
        size: this.props.colorFormat.length,
        transition: true,
        normalized: true,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getFillColor',
        defaultValue: DEFAULT_COLOR as number[],
      },
      instanceLineColors: {
        size: this.props.colorFormat.length,
        transition: true,
        normalized: true,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getLineColor',
        defaultValue: [0, 0, 0, 255] as number[],
      },
      instanceLineWidths: {
        size: 1,
        transition: true,
        accessor: 'getLineWidth',
        defaultValue: 1,
      },
    })
  }
  
  updateState(params: UpdateParameters<this>) {
    super.updateState(params)

    if (params.changeFlags.extensionsChanged) {
      const {gl} = this.context
      this.state.model?.delete()
      this.state.model = this._getModel(gl)
      this.getAttributeManager()!.invalidateAll()
    }
  }
  
  _getModel(gl) {
    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: new CubeGeometry(),
      isInstanced: true,
    })
  }

  numberToArr(num: number | number[]): number[] {
    if (Array.isArray(num)) {
      return num
    }
    return [num, num, num]
  }

  formatMinSize(size: number | number[]): number[] {
    if (Array.isArray(size)) {
      return size.map((s) => (s > 0 ? s : 0))
    }
    return this.numberToArr(size > 0 ? size : 0)
  }

  formatMaxSize(size: number | number[]): number[] {
    if (Array.isArray(size)) {
      return size.map((s) => (s > 0 ? s : Number.MAX_SAFE_INTEGER))
    }
    return this.numberToArr(size)
  }
  
  draw({ uniforms }) {
    this.state.model
    .setUniforms(uniforms)
    .setUniforms({
      sizeUnits: UNIT[this.props.sizeUnits!],
      sizeMaxPixels: this.formatMaxSize(this.props.sizeMaxPixels),
      sizeMinPixels: this.formatMinSize(this.props.sizeMinPixels),
      lineWidthUnits: UNIT[this.props.lineWidthUnits!],
      filled: this.props.filled,
      stroked: this.props.stroked ? 1 : 0,
      withPadding: this.props.padding > 0 ? 1 : 0,
      paddingSize: this.props.padding ?? 0,
      paddingRelativeToSize: this.props.paddingRelativeToSize ? 1 : 0,
    })
    .draw()
  }
}
