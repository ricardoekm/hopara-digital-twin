import { IconLayer as DeckIconLayer, IconLayerProps } from '@deck.gl/layers'
import { DefaultProps } from '@deck.gl/core/typed'
import IconManager, { LoadIconErrorContext } from './IconManager'
import { Logger } from '@hopara/internals'
import GL from '@luma.gl/constants'
import { UNIT } from '../../animation/Constants'

const vs = `\
#version 300 es
#define SHADER_NAME icon-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;
attribute vec2 instancePixelOffset;
attribute float instanceLineWidths;
attribute vec4 instanceLineColors;

uniform float sizeScale;
uniform vec2 iconsTextureDim;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform bool billboard;
uniform int sizeUnits;
uniform float lineOpacity;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;
varying vec2 vIconSize;
varying vec2 vIconTextureDim;
varying float vLineWidth;
varying vec4 vLineColor;
varying float vLineOpacity;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;

  vec2 iconSize = instanceIconFrames.zw;
  // convert size in meters to pixels, then scaled and clamp
 
  // project meters to pixels and clamp to limits 
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits), 
    sizeMinPixels, sizeMaxPixels
  );
  
  vIconSize = iconSize;
  vIconTextureDim = iconsTextureDim;
  vLineWidth = instanceLineWidths;
  vLineColor = instanceLineColors;
  vLineOpacity = lineOpacity;

  // scale icon height to match instanceSize
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;

  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace
  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
  pixelOffset += instancePixelOffset;
  pixelOffset.y *= -1.0;

  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position); 
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }
  
  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;

  vColor = instanceColors;
  DECKGL_FILTER_COLOR(vColor, geometry);
 
  vColorMode = instanceColorModes;
}
`

const fs = `\
#version 300 es
#define SHADER_NAME icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float alphaCutoff;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 vIconSize;
varying vec2 uv;
varying vec2 vIconTextureDim;
varying float vLineWidth;
varying vec4 vLineColor;
varying float vLineOpacity;

void main(void) {
  geometry.uv = uv;
  vec4 texColor = texture2D(iconsTexture, vTextureCoords);

  // if colorMode == 0, use pixel color from the texture
  // if colorMode == 1 or rendering picking buffer, use texture as transparency mask
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
  // Take the global opacity and the alpha from vColor into account for the alpha component
  float a = texColor.a * opacity * vColor.a;
  
  if(vLineWidth == 0.0 || a == 1.0) {
    gl_FragColor = vec4(color, a);
    DECKGL_FILTER_COLOR(gl_FragColor, geometry);
    return;
  }

  bool stroke = false;
  float strokeA = 0.0;
  float borderSize0To1 = vLineWidth / vIconTextureDim.x;
  float aa = (vIconSize.x / vIconTextureDim.x)*0.05;
  
  for( float borderSizeX = 1.0; borderSizeX <= vLineWidth; borderSizeX += 1.0) {
    for( float borderSizeY = 1.0; borderSizeY <= vLineWidth; borderSizeY += 1.0) {
      for (float x = -1.0; x <= 1.0; x++) {
        for (float y = -1.0; y <= 1.0; y++) {
          if(x == 0.0 && y == 0.0) {
            continue;
          }
          vec2 offset = vec2(borderSizeX * x, borderSizeY * y);
          // vec2 relativeOffset = relativeCoords + offset;
          // if(relativeOffset.x < LOWER || relativeOffset.x > UPPER || relativeOffset.y < LOWER || relativeOffset.y > UPPER) {
          //   continue;
          // }
    
          vec2 offsetedCoords = vTextureCoords + (offset/vIconTextureDim);
          vec4 neighborColor = texture2D(iconsTexture, offsetedCoords);
    
          if (neighborColor.a > 0.0) {
             stroke = true;
             strokeA = max(strokeA, neighborColor.a);
             //
             // float dist = length(vTextureCoords - offsetedCoords);
             // float edge = smoothstep(borderSize0To1 - aa, borderSize0To1, dist);
             // strokeA = max(strokeA, 1.0-edge);
          }
        }
      }
    }
  }
  if (stroke) {
    strokeA = strokeA * vLineOpacity;
    gl_FragColor = vec4(vLineColor.rgb, strokeA);
  }
  if(a < 1.0) {
    gl_FragColor = vec4(mix(color, vLineColor.rgb, 1.0-a), min(1.0, a + strokeA));
  }
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}`

const DEFAULT_COLOR: [number, number, number, number] = [0, 0, 0, 255]

interface MyIconLayerProps<D> extends IconLayerProps<D> {
  getLineSize: ((x: D) => number) | number;
  getLineColor: ((x: D) => number[]) | number[];
  lineOpacity: number;

  onIconError: any,
  textureParameters: any,
  getIconFrames: any,
  iconManager: any
}

const defaultProps: DefaultProps<MyIconLayerProps<any>> = {
  iconAtlas: { type: 'image', value: null, async: true },
  iconMapping: { type: 'object', value: {}, async: true },
  sizeScale: { type: 'number', value: 1, min: 0 },
  billboard: true,
  sizeUnits: 'pixels',
  sizeMinPixels: { type: 'number', min: 0, value: 0 }, //  min point radius in pixels
  sizeMaxPixels: { type: 'number', min: 0, value: Number.MAX_SAFE_INTEGER }, // max point radius in pixels
  alphaCutoff: { type: 'number', value: 0.05, min: 0, max: 1 },

  getPosition: { type: 'accessor', value: (x) => x.position },
  getIcon: { type: 'accessor', value: (x) => x.icon },
  getColor: { type: 'accessor', value: DEFAULT_COLOR },
  getIconFrames: { type: 'accessor', value: (x) => x.icon },
  getSize: { type: 'accessor', value: 1 },
  getAngle: { type: 'accessor', value: 0 },
  getPixelOffset: { type: 'accessor', value: [0, 0] },

  onIconError: { type: 'function', value: null, optional: true },

  textureParameters: { type: 'object', ignore: true },

  iconManager: { type: 'object', value: null, optional: true },
  getLineSize: { type: 'accessor', value: 0 },
  getLineColor: { type: 'accessor', value: DEFAULT_COLOR },
  lineOpacity: { type: 'number', value: 1, min: 0, max: 1 }
}

/** Render raster icons at given coordinates. */
export default class IconLayer<T, P extends MyIconLayerProps<T> & {
  iconManager: IconManager
}> extends DeckIconLayer<T, P> {
  static layerName = 'IconLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.vs = vs
    shaders.fs = fs
    return shaders
  }

  initializeState() {
    super.initializeState({})

    this.state = {
      iconManager: this.props.iconManager ?? new IconManager(this.props.textureParameters?.maxTextureSize || 4096),
      lineOpacity: this.props.lineOpacity
    }

    this.state.iconManager.init(this.props.id, this.context.gl, {
      onUpdate: this.__onUpdate.bind(this),
      onError: this.__onError.bind(this)
    })

    const attributeManager = this.getAttributeManager()
    attributeManager!.addInstanced({
      instanceIconFrames: {
        size: 4,
        accessor: 'getIconFrames',
        transform: this.getInstanceIconFrame
      },
      instanceLineColors: {
        size: this.props.colorFormat?.length ?? 4,
        transition: true,
        normalized: true,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getLineColor',
        defaultValue: [0, 0, 0, 255] as number[]
      },
      instanceLineWidths: {
        size: 1,
        transition: true,
        accessor: 'getLineWidth',
        defaultValue: 1
      }
    })
  }

  draw({ uniforms }): void {
    const { sizeScale, sizeMinPixels, sizeMaxPixels, sizeUnits, billboard, alphaCutoff, lineOpacity } = this.props
    const { iconManager } = this.state

    const iconsTexture = iconManager.getTexture()
    if (iconsTexture) {
      this.state.model
        .setUniforms(uniforms)
        .setUniforms({
          iconsTexture,
          iconsTextureDim: [iconsTexture.width, iconsTexture.height],
          sizeUnits: UNIT[sizeUnits!],
          sizeScale,
          sizeMinPixels,
          sizeMaxPixels,
          billboard,
          alphaCutoff,
          lineOpacity
        })
        .draw()
    }
  }

  private __onUpdate(): void {
    const attributeManager = this.getAttributeManager()
    attributeManager!.invalidate('getIconFrames')
    this.setNeedsRedraw()
    this.setNeedsUpdate()
  }

  private __onError(evt: LoadIconErrorContext): void {
    const onIconError = this.getCurrentLayer()?.props.onIconError
    if (onIconError) {
      onIconError(evt)
    } else {
      Logger.error(evt.error)
    }
  }
}
