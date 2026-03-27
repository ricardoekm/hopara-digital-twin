import { LayerProps } from '@deck.gl/core/lib/layer'
import { DefaultProps, Layer, Unit, UNIT, UpdateParameters } from '@deck.gl/core/typed'
import GL from '@luma.gl/constants'
import {Model, Geometry} from '@luma.gl/engine'
import fs from './grid-layer-fragment.glsl'
import vs from './grid-layer-vertex.glsl'
import { picking, project32 } from '@deck.gl/core'

export type GridProps<D> = LayerProps<D> & {
  angle?: number;
  size: number; /** Size value in commons unit */
  strokeSize?: number;
  strokeSizeUnit?: `${Unit}`;
  strokeColor?: [number, number, number, number];
  opacity?: number;
  anchor?: [number, number];
};

const defaultProps: DefaultProps<GridProps<any>> = {
  size: 1000,
  strokeSize: 1,
  strokeSizeUnit: 'pixels',
  strokeColor: [0, 0, 0, 160],
  opacity: 1,
  anchor: [0, 0],
  angle: 0
}

type State = {
  model: Model | null;
  worldCoeffs: Float32Array | null
};

const worldAt = (viewport: any, x: number, y: number): [number, number] => {
  if (viewport.isGeospatial) {
    const [lon, lat] = viewport.unproject([x, y]) as [number, number]
    const [wx, wy] = viewport.projectPosition([lon, lat, 0])
    return [wx, wy]
  }
  // Orthographic / non-geospatial: unproject already returns world coordinates
  const [wx, wy] = viewport.unproject([x, y, 0]) as [number, number]
  return [wx, wy]
}

export default class GridLayer<DataT = any, ExtraPropsT extends {} = {}> extends Layer<ExtraPropsT & Required<GridProps<DataT>>> {
  static layerName = 'GridLayer'
  static defaultProps = defaultProps

  initializeState() {
    this.setState({model: null, worldCoeffs: null} as State)
  }

  getWorldCoeffs(viewport) {
    const vp = viewport // use the current viewport (pan/zoom aware)
    const uWorld00 = worldAt(vp, 0, 0)
    const uWorld10 = worldAt(vp, vp.width, 0)
    const uWorld01 = worldAt(vp, 0, vp.height)
    const uWorld11 = worldAt(vp, vp.width, vp.height)

    const a = uWorld00
    const b = [uWorld10[0] - uWorld00[0], uWorld10[1] - uWorld00[1]]
    const c = [uWorld01[0] - uWorld00[0], uWorld01[1] - uWorld00[1]]
    const d = [
      uWorld11[0] - uWorld10[0] - uWorld01[0] + uWorld00[0],
      uWorld11[1] - uWorld10[1] - uWorld01[1] + uWorld00[1]
    ]
    
    return new Float32Array([
      a[0], b[0], c[0], d[0],
      a[1], b[1], c[1], d[1],
      0, 0, 0, 0,
      0, 0, 0, 0
    ])
  }

  shouldUpdateState(params: UpdateParameters<Layer<ExtraPropsT & Required<GridProps<DataT>>>>): boolean {
    const {changeFlags} = params
    return Boolean(
      changeFlags.propsOrDataChanged ||
      changeFlags.updateTriggersChanged ||
      changeFlags.viewportChanged
    )
  }

  updateState() {
    if (!this.state.model) {
      this.setState({model: this._createModel(this.context.gl)})
      this.getAttributeManager()!.invalidateAll()
    }
    // Always recompute to reflect pan/zoom beyond data/world bounds
    const worldCoeffs = this.getWorldCoeffs(this.context.viewport)
    this.setState({worldCoeffs})
  }

  finalizeState() {
    this.state.model?.delete()
  }

  getShaders() {
    return super.getShaders({ vs, fs, modules: [project32, picking] })
  }

  private _createModel(gl) {
    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLES,
        attributes: {
          positions: { size: 2, value: new Float32Array([
            -1, -1,
             1, -1,
            -1, 1,
             1, 1,
          ]) }
        },
        indices: new Uint16Array([
          0, 1,
          2, 1,
          3, 2,
        ])
      }),
      isInstanced: false
    })
  }

  draw({uniforms}) {
    const {model, worldCoeffs} = this.state
    if (!model || !worldCoeffs) return

    const {
      size,
      opacity,
      strokeSize,
      strokeSizeUnit,
      strokeColor = [0, 0, 0, 160],
      angle = 0,
      anchor = [0, 0],
    } = this.props

    model
      .setUniforms(uniforms)
      .setUniforms({
        uSize: Number.isFinite(size) ? Number(size) : 1,
        uStrokeSize: Number.isFinite(strokeSize) ? Number(strokeSize) : 1,
        uStrokeSizeUnit: strokeSizeUnit ? UNIT[strokeSizeUnit] : UNIT.pixels,
        uStrokeColor: [
          strokeColor[0] / 255,
          strokeColor[1] / 255,
          strokeColor[2] / 255,
          strokeColor[3] / 255
        ],
        uOpacity: opacity ?? 1,
        uAngle: angle,
        uAnchor: anchor,
        uWorldCoeffs: worldCoeffs,
      })
      .draw()
  }
}
