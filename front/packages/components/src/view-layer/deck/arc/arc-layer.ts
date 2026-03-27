import {Geometry, Model} from '@luma.gl/engine'
import {
  Accessor,
  Color,
  DefaultProps,
  Layer,
  LayerDataSource,
  LayerProps,
  picking,
  Position,
  project32,
  UNIT,
  UpdateParameters,
} from '@deck.gl/core/typed'
import GL from '@luma.gl/constants'

import vs from './arc-layer-vertex.glsl'
import fs from './arc-layer-fragment.glsl'

const DEFAULT_COLOR: [number, number, number, number] = [0, 0, 0, 255]

export type ArcLayerProps<DataT = any> = _ArcLayerProps<DataT> & LayerProps;

type _ArcLayerProps<DataT> = {
  data: LayerDataSource<DataT>;
  billboard?: boolean;
  radiusUnits?: keyof typeof UNIT;
  antialiasing?: boolean;
  getPosition?: Accessor<DataT, Position>;
  getOuterRadius?: Accessor<DataT, number>;
  getInnerRadius?: Accessor<DataT, number>;
  getStartAngle?: Accessor<DataT, number>;
  getEndAngle?: Accessor<DataT, number>;
  getFillColor?: Accessor<DataT, Color>;
};

const defaultProps: DefaultProps<ArcLayerProps> = {
  billboard: true,
  radiusUnits: 'common',
  antialiasing: true,
  getPosition: {type: 'accessor', value: (x) => x.position},
  getOuterRadius: {type: 'accessor', value: 1},
  getInnerRadius: {type: 'accessor', value: 0},
  getStartAngle: {type: 'accessor', value: 0},
  getEndAngle: {type: 'accessor', value: Math.PI * 2},
  getFillColor: {type: 'accessor', value: DEFAULT_COLOR},
}

/** Render circles at given coordinates. */
export default class ArcLayer<DataT = any, ExtraPropsT extends {} = {}> extends Layer<
  ExtraPropsT & Required<_ArcLayerProps<DataT>>
> {
  static defaultProps = defaultProps
  static layerName = 'ArcLayer'

  getShaders() {
    return super.getShaders({vs, fs, modules: [project32, picking]})
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
      instanceOuterRadius: {
        size: 1,
        transition: true,
        type: GL.FLOAT,
        accessor: 'getOuterRadius',
        defaultValue: 1,
      },
      instanceInnerRadius: {
        size: 1,
        transition: true,
        type: GL.FLOAT,
        accessor: 'getInnerRadius',
        defaultValue: 1,
      },
      instanceStartAngles: {
        size: 1,
        transition: true,
        type: GL.FLOAT,
        accessor: 'getStartAngle',
        defaultValue: 0,
      },
      instanceEndAngles: {
        size: 1,
        transition: true,
        type: GL.FLOAT,
        accessor: 'getEndAngle',
        defaultValue: Math.PI * 2,
      },
      instanceFillColors: {
        size: this.props.colorFormat.length,
        transition: true,
        normalized: true,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getFillColor',
        defaultValue: [0, 0, 0, 255],
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

  draw({uniforms}: any) {
    const {
      billboard,
      radiusUnits,
    } = this.props

    this.state.model
      .setUniforms(uniforms)
      .setUniforms({
        billboard,
        radiusUnits: UNIT[radiusUnits],
        antialiasing: true,
      })
      .draw()
  }

  protected _getModel(gl: any) {
    const positions = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]

    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLE_FAN,
        vertexCount: 4,
        attributes: {
          positions: {size: 3, value: new Float32Array(positions)},
        },
      }),
      isInstanced: true,
    })
  }
}
