import {PathLayer} from '@deck.gl/layers'
import {UNIT} from '@deck.gl/core/typed'
import {AnimationEngine, isSameAnimationDataList} from '../../../../animation/AnimationEngine'
import GL from '@luma.gl/constants'

const functions = `
vec4 hsla2rgba(vec4 hsla) {
  float h = hsla.x;
  float s = hsla.y;
  float l = hsla.z;
  float a = hsla.w;
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float x = c * (1.0 - abs(mod(h / 60.0, 2.0) - 1.0));
  float m = l - 0.5 * c;
  vec3 rgb;
  if (h < 60.0) {
    rgb = vec3(c, x, 0.0);
  } else if (h < 120.0) {
    rgb = vec3(x, c, 0.0);
  } else if (h < 180.0) {
    rgb = vec3(0.0, c, x);
  } else if (h < 240.0) {
    rgb = vec3(0.0, x, c);
  } else if (h < 300.0) {
    rgb = vec3(x, 0.0, c);
  } else {
    rgb = vec3(c, 0.0, x);
  }
  return vec4(rgb + m, a);
}

vec4 rgba2hsla(vec4 rgba) {
  float r = rgba.x;
  float g = rgba.y;
  float b = rgba.z;
  float a = rgba.w;
  float max = max(r, max(g, b));
  float min = min(r, min(g, b));
  float h = 0.0;
  float s = 0.0;
  float l = (max + min) / 2.0;
  float d = max - min;
  if (max != min) {
    if (max == r) {
      h = 60.0 * (g - b) / d;
    } else if (max == g) {
      h = 60.0 * (b - r) / d + 120.0;
    } else {
      h = 60.0 * (r - g) / d + 240.0;
    }
    if (l > 0.5) {
      s = d / (2.0 - max - min);
    } else {
      s = d / (max + min);
    }
  }
  return vec4(h, s, l, a);
}

// function that receives a rgba color and returns a new rgba color with lightness increased by 20%
vec4 lighten(vec4 color, float lightness) {
  float h, s, l, a;
  vec4 hsla = rgba2hsla(color);
  h = hsla.x;
  s = hsla.y;
  l = hsla.z;
  a = hsla.w;
  l = l + lightness;
  if (l > 1.0) {
    l = 1.0;
  }
  return hsla2rgba(vec4(h, s, l, a));
}
`

export class LineLayer extends PathLayer<any> {
  static layerName = 'LineLayer'
  static defaultProps = {
    ...PathLayer.defaultProps,
    getIsAnimated: {type: 'accessor', value: [0]},
    animations: {type: 'array', value: [], compare: false, optional: true, equal: isSameAnimationDataList},
    getTimestamps: {type: 'accessor', value: [0, 0]},
    animationType: {type: 'string', value: undefined, optional: true},
  }

  initializeState() {
    super.initializeState({})

    const attributeManager = this.getAttributeManager()
    attributeManager.addInstanced({
      instanceTimestamps: {
        size: 2,
        accessor: 'getTimestamps',
        type: GL.FLOAT,
      },
      instanceIsAnimated: {
        size: 1,
        accessor: 'getIsAnimated',
      },
    })

    if ((this.props as any).animationType) {
      Object.assign(this.state, {
        animationEngine: new AnimationEngine({redrawFn: this.setNeedsRedraw.bind(this)}),
      })
    }
  }

  finalizeState() {
    if (this.state.animationEngine) {
      this.state.animationEngine.finalize()
    }
    super.finalizeState()
  }

  shouldCreateAnimationEngineOnUpdate(params: any) {
    return params.changeFlags.propsChanged && !this.state.animationEngine && !!params.props.animationType
  }

  shouldUpdateKeyFrames(params: any) {
    return params.changeFlags.propsChanged && this.state.animationEngine
  }

  updateState(params: any) {
    super.updateState(params)

    if (this.shouldCreateAnimationEngineOnUpdate(params)) {
      this.state.animationEngine = new AnimationEngine({redrawFn: this.setNeedsRedraw.bind(this)})
    }

    if (this.shouldUpdateKeyFrames(params)) {
      this.state.animationEngine.createKeyFrames(params.props.animations, params.context.timeline)
    }
  }

  draw(opts) {
    let animationUniforms = {}
    if (this.state.animationEngine) {
      animationUniforms = this.state.animationEngine.getUniforms()
    }

    const {
      jointRounded,
      capRounded,
      billboard,
      miterLimit,
      widthUnits,
      widthScale,
      widthMaxPixels,
    } = this.props as any

    this.state.model
      .setUniforms(opts.uniforms)
      .setUniforms({
        jointType: Number(jointRounded),
        capType: Number(capRounded),
        billboard,
        widthUnits: UNIT[widthUnits],
        widthScale,
        miterLimit,
        widthMaxPixels,
        segmentLength: (this.props as any).segmentLength / (this.props as any).speed,
      })
      .setUniforms(animationUniforms)
      .draw()
  }

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `\

  uniform float segmentLength;
  attribute vec2 instanceTimestamps;
  attribute float instanceIsAnimated;
  varying float vTime;
  varying float isAnimated;
  `,
      'vs:#main-end': `\

  vTime = instanceTimestamps[0] + (instanceTimestamps[1] - instanceTimestamps[0]) * vPathPosition.y / vPathLength;
  isAnimated = instanceIsAnimated;
          
  `,
      'fs:#decl': `\

  uniform float currentTime;
  uniform float segmentLength;
  varying float vTime;
  varying float isAnimated;
  ${functions}
  
  `,

      'fs:DECKGL_FILTER_COLOR': `\

  int currentStep = 0;
  if (isAnimated > 0.0) {       
    currentStep = int((currentTime - vTime) / segmentLength);
  } else {
    currentStep = int(vTime / segmentLength);
  }
  if(segmentLength > 0.0) {
    if (mod(float(currentStep), 2.0) > 0.0) {
      vec4 rgba = lighten(vec4(color.r, color.g, color.b, color.a), 0.1);
      color.r = rgba.x;
      color.g = rgba.y;
      color.b = rgba.z;
      color.a = rgba.a;
    }
  }
      `,
    }
    return shaders
  }
}
