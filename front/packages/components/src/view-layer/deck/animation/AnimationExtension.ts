import {LayerExtension} from '@deck.gl/core'
import { AnimationData, AnimationEngine, isSameAnimationDataList } from '../../../animation/AnimationEngine'
import { isEqual } from 'lodash/fp'
import { CircleLayer } from '../factory/CircleFactory/CircleLayer'
import IconLayer from '../factory/IconFactory/IconLayer'
import { SolidPolygonLayer } from '@deck.gl/layers'
import { ScenegraphLayer } from 'deck.gl'

interface AnimationExtensionOpts {
  sizeAnimations: AnimationData[]
  colorAnimations: AnimationData[]
  colorAnimationUniforms: string[]
  sizeAnimationUniforms: string[]
  animationFps?: number
  enabled?: boolean
}

const AnimatedLayerScaleUniforms = {
  circleLayer: ['radiusScale'],
  iconLayer: ['sizeScale'],
}

const AnimatedLayerColorUniforms = {
  circleLayer: ['opacity'],
  iconLayer: ['opacity'],
  polygon: ['opacity'],
  model: ['opacity'],
}

export class AnimationExtension extends LayerExtension {
  opts: AnimationExtensionOpts

  constructor(opts: AnimationExtensionOpts) {
    super()
    this.opts = opts
    if (!opts.colorAnimationUniforms) this.opts.colorAnimationUniforms = []
    if (!opts.sizeAnimationUniforms) this.opts.sizeAnimationUniforms = []
  }
  
  // eslint-disable-next-line no-restricted-syntax
  static get componentName() {
    return 'AnimationExtension'
  }

  equals(extension: any): boolean {
    const isSameColorUniforms = isEqual(this.opts.colorAnimationUniforms, extension.opts.colorAnimationUniforms)
    const isSameSizeUniforms = isEqual(this.opts.sizeAnimationUniforms, extension.opts.sizeAnimationUniforms)
    const isSameSizeAnimations = isSameAnimationDataList(this.opts.sizeAnimations, extension.opts.sizeAnimations)
    const isSameColorAnimations = isSameAnimationDataList(this.opts.colorAnimations, extension.opts.colorAnimations)
    const isSameFps = this.opts.animationFps === extension.opts.animationFps
    return isSameColorUniforms && isSameSizeUniforms && isSameSizeAnimations && isSameColorAnimations && isSameFps
  }

  private getScaleUniforms(layer: any) {
    if (layer instanceof CircleLayer) {
      return AnimatedLayerScaleUniforms['circleLayer']
    } else if (layer instanceof IconLayer) {
      return AnimatedLayerScaleUniforms['iconLayer']
    }

    return []
  }

  private getColorUniforms(layer: any) {
    if (layer instanceof CircleLayer) {
      return AnimatedLayerColorUniforms['circleLayer']
    } else if (layer instanceof IconLayer) {
      return AnimatedLayerColorUniforms['iconLayer']
    } else if (layer instanceof SolidPolygonLayer) {
      return AnimatedLayerColorUniforms['polygon']
    } else if (layer instanceof ScenegraphLayer) {
      return AnimatedLayerColorUniforms['model']
    }

    return []
  }

  private getUniforms(layer: any) {
    return ([] as string[])
      .concat(this.getColorUniforms(layer))
      .concat(this.getScaleUniforms(layer))
  }

  private translateCircleUniformName(name: string): string {
    switch (name) {
      case 'radiusScale':
        return 'scale'
      default:
        return name
    }
  }

  private translateIconUniformName(name: string): string {
    switch (name) {
      case 'sizeScale':
        return 'scale'
      default:
        return name
    }
  }

  private translateAnimatedUniformName(name: string, layer: any): string {
    if (layer instanceof CircleLayer) return this.translateCircleUniformName(name)
    if (layer instanceof IconLayer) return this.translateIconUniformName(name)
    return name
  }

  private getUniformString(uniform: string): string {
    return `uniform float animated_${uniform};`
  }

  getShaders(extension: AnimationExtension): any {
    return {
      ...super.getShaders(null),
      inject: {
        'vs:#decl': `
          in float sizeAnimated;
          in float colorAnimated;
          ${extension.getScaleUniforms(this).map((u) => extension.getUniformString(u)).join('\n ')}
          ${extension.getColorUniforms(this).map((u) => extension.getUniformString(u)).join('\n ')}
        `,
        'vs:DECKGL_FILTER_SIZE': `
          ${extension.getScaleUniforms(this).map((uniform) => `size *= mix(1.0, animated_${uniform}, sizeAnimated);`).join('\n ')}
        `,
        'vs:DECKGL_FILTER_COLOR': `
          ${extension.getColorUniforms(this).map((uniform) => `color.a *= mix(1.0, animated_${uniform}, colorAnimated);`).join('\n ')}
        `,
      },
    }
  }

  initializeState(context: any, extension: AnimationExtension) {
    const attributeManager = (this as any).getAttributeManager()
    if (!attributeManager) return

    attributeManager.add({
      sizeAnimated: {
        size: 1,
        accessor: 'isSizeAnimated',
        defaultValue: 0,
        instanced: this instanceof SolidPolygonLayer ? false : true,
      },
      colorAnimated: {
        size: 1,
        accessor: 'isColorAnimated',
        defaultValue: 0,
        instanced: this instanceof SolidPolygonLayer ? false : true,
      },
    });

    (this as any).state['animationEngine'] = new AnimationEngine({ redrawFn: (this as any).setNeedsRedraw.bind(this), fps: extension.opts.animationFps })
  }

  finalizeState() {
    const state = (this as any).state
    if (state.animationEngine) {
      state.animationEngine.finalize()
    }
  }

  updateState(params: any, extension: AnimationExtension) {
    const opts = extension.opts
    const state = (this as any).state
    const animations = [...opts.sizeAnimations, ...opts.colorAnimations]
    if (state.animationEngine && params.changeFlags.propsChanged && animations.length) {
      state.animationEngine.createKeyFrames(animations, params.context.timeline)
    }
  }

  getSubLayerProps() { 
    return {
      isColorAnimated: (this as any).props.isColorAnimated,
      isSizeAnimated: (this as any).props.isSizeAnimated,
      updateTriggers: (this as any).props.updateTriggers,
    }
  }

  draw(_, extension: AnimationExtension): void {
    const state = (this as any).state
    const props = (this as any).props

    const animationUniforms = state.animationEngine?.getUniforms() ?? {}
    const models = state.models ?? (state.model ? [state.model] : [])

    const setModelUniforms = (model) => {
      const layerUniforms = model.getUniforms()

      const uniforms = extension.getUniforms(this).reduce((acc, u) => {
        acc[`animated_${u}`] = animationUniforms[extension.translateAnimatedUniformName(u, this)] ?? layerUniforms[u] ?? props[u]
        return acc
      }, {})

      model.setUniforms(uniforms)
    }

    for (const model of models) {
      setModelUniforms(model)
    }

    if (state.scenegraph) {
      state.scenegraph.traverse(({model}) => {
        setModelUniforms(model)
      })
    }
  }
}
