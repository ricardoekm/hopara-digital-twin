import {
  AnimationEncoding,
  ColorEncoding,
  ColorScaleType,
  Encoding,
  Encodings,
  MaxLengthType,
} from '@hopara/encoding'
import {Layer, PlainLayer} from '../Layer'
import {Action} from '../../action/Action'
import {Actions} from '../../action/Actions'
import {EncodingAnimation} from '../EncodingAnimation'
import {LayerFactory} from '../factory/LayerFactory'
import {Layers} from '../Layers'
import {i18n} from '@hopara/i18n'
import {v4 as uuidv4} from 'uuid'
import {Column} from '@hopara/dataset'
import {SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {VisualizationType} from '../../visualization/Visualization'
import { Visible } from '../Visible'
import { LayerType } from '../LayerType'

export class LayerMutator {
  layerFactory: LayerFactory
  visualizationType: VisualizationType

  constructor(layerFactory: LayerFactory, visualizationType: VisualizationType) {
    this.layerFactory = layerFactory
    this.visualizationType = visualizationType
  }

  private mutateColorScaleType(layer: Layer, scaleType: ColorScaleType) {
    const updatedColorEncoding = {
      ...layer.encoding.color,
      scale: {
        ...layer.encoding!.color!.scale,
        type: scaleType,
      },
    } as ColorEncoding
    return this.updateEncoding(layer, updatedColorEncoding, 'color', false)
  }

  private getCorrectScaleType(scaleType: ColorScaleType, colorColumn?: Column) {
    if (!colorColumn) {
      return scaleType
    }

    if (colorColumn.isQuantitative() && (scaleType === ColorScaleType.SORTED || scaleType === ColorScaleType.HASHED)) {
      return ColorScaleType.GROUPED
    } else if (!colorColumn.isQuantitative() &&
      (scaleType === ColorScaleType.GROUPED || scaleType == ColorScaleType.LINEAR)) {
      return ColorScaleType.SORTED
    }

    return scaleType
  }

  private sanitizeColorScaleType(layer: Layer, colorColumn: Column | undefined) {
    const scaleType = layer.encoding?.color?.scale?.type
    if (!scaleType) {
      return layer
    }

    const correctScaleType = this.getCorrectScaleType(scaleType, colorColumn)
    if (correctScaleType !== scaleType) {
      return this.mutateColorScaleType(layer, correctScaleType)
    }

    return layer
  }

  private sanitizeMaxLenght(layer: Layer) {
    if (!layer.isType(LayerType.text)) {
      return layer
    }

    if (layer.encoding?.text?.maxLength?.type !== MaxLengthType.AUTO) {
      return layer
    }

    if (layer.encoding?.config?.units !== SizeUnits.COMMON) {
      layer.encoding.text.maxLength.type = MaxLengthType.NONE
    }

    return layer
  }

  private postProcessing(newLayer: Layer) {
    newLayer = this.sanitizeColorScaleType(newLayer, this.layerFactory.getColorColumn(newLayer))
    newLayer = this.sanitizeMaxLenght(newLayer)

    return newLayer
  }

  mutate(layer: Layer, updatedLayer: Partial<PlainLayer>, postProcess = true): Layer {
    const newLayer = this.layerFactory.createLayer({...layer.raw, ...updatedLayer}, undefined, { parentId: layer.parentId })

    if (postProcess) {
      return this.postProcessing(newLayer)
    }

    return newLayer
  }

  updateChildren(parentLayer: Layer, children: Layers) {
    const rawChildren = new Layers(...children.map((child) => new Layer({...child.raw})))
    const newLayer = parentLayer.clone()
    newLayer.children = children
    newLayer.raw = {
      ...newLayer.raw,
      children: rawChildren,
    }
    return newLayer

    // Equivalent to, done this way for performance reasons
    // this.mutate(parentLayer, {children: children})
  }

  upsertChild(parentLayer:Layer, childLayer:Layer) {
    const updatedChildren = parentLayer.getChildren().upsertLayer(childLayer)
    const mutatedParentLayer = this.updateChildren(parentLayer, updatedChildren)

    // To keep transient state (e.g. updatedTimestamp of encoding)
    // Otherwise DIY wont re-render
    mutatedParentLayer.children = mutatedParentLayer.children!.upsertLayer(childLayer)
    return mutatedParentLayer
  }

  updateChild(parentLayer: Layer, childLayer: Layer) {
    if (!parentLayer.isParent()) {
      return parentLayer
    }

    if (parentLayer.hasChildren() && !parentLayer.children!.hasId(childLayer.getId(), false)) {
      const updatedChildren = parentLayer.getChildren().map((child) => this.updateChild(child, childLayer))
      return this.updateChildren(parentLayer, updatedChildren)
    }

    return this.upsertChild(parentLayer, childLayer)
  }

  deleteChild(parentLayer: Layer, childLayerId: string) {
    const children = parentLayer.children?.filter((child) => child.getId() !== childLayerId)
      .map((child) => new Layer(child.raw)) ?? []
    return this.mutate(parentLayer, {children: new Layers(...children)})
  }

  updateEncodings(layer: Layer, encodings: Partial<Encodings>, postProcess = true) {
    return this.mutate(layer, {encoding: new Encodings(encodings)}, postProcess)
  }

  updateEncoding(layer: Layer, encoding: Encoding | undefined, encondingKey: string, postProcess = true) {
    if ( !encoding ) {
      return layer
    }

    const updatedLayer = this.updateEncodings(layer, {
      ...layer.raw.encoding,
      [encondingKey]: encoding,
    } as Encodings, postProcess)
    if (updatedLayer.encoding[encondingKey]) updatedLayer.encoding[encondingKey].resetUpdatedTimestamp()
    return updatedLayer
  }

  updateVisibility(layer: Layer, visible: Visible) {
    const updatedLayer = this.mutate(layer, {visible})
    updatedLayer.visible.resetUpdatedTimestamp()
    return updatedLayer
  }

  private updateReferenceZoom(layer: Layer, zoom: number) {
    if ( layer.encoding.size ) {
      layer = this.updateEncoding(layer, {
        ...layer.encoding.size,
        referenceZoom: zoom
      } as any, 'size')
    }

    if ( layer.encoding.strokeSize ) {
      layer = this.updateEncoding(layer, {
        ...layer.encoding.strokeSize,
        referenceZoom: zoom
      } as any, 'strokeSize')
    }

    return layer
  }

  doUpdateResize(layer: Layer, resize: boolean, zoom: number) {
    layer = this.updateReferenceZoom(layer, zoom)
    layer = this.updateEncoding(layer, {
      ...layer.encoding.config,
      units: resize ? SizeUnits.COMMON : SizeUnits.PIXELS,
    } as any, 'config')
    return layer
  }

  updateResize(layer: Layer, resize: boolean, zoom: number) {
    layer = this.doUpdateResize(layer, resize, zoom)
    // We need to update the parent so that the fillParentData works correctly
    this.layerFactory.layers = this.layerFactory.layers?.upsertLayer(layer)

    for ( const child of layer.getFlatChildren() ) {
      const updatedChild = this.updateReferenceZoom(child, zoom)
      layer = this.updateChild(layer, updatedChild)
    }

    return layer
  }

  updateActions(layer: Layer, actions: Actions) {
    return this.mutate(layer, {actions})
  }

  upsertAction(layer: Layer, action: Action) {
    return this.updateActions(layer, new Actions(...layer.actions).immutableUpsert(action))
  }

  removeAction(layer: Layer, actionId: string) {
    return this.updateActions(layer, new Actions(...layer.actions).immutableRemove(actionId))
  }

  moveAction(layer: Layer, sourceIndex: number, destinationIndex: number) {
    return this.updateActions(layer, new Actions(...layer.actions).immutableMove(sourceIndex, destinationIndex))
  }

  updateAnimation(layer: Layer, animation: EncodingAnimation, encoding: AnimationEncoding): Layer {
    const anyLayer = layer as any
    const animationEncodings = animation.getEncodings()
    const updatedEncodings = Object.keys(animationEncodings).reduce((encodings, key) => {
      encodings[key] = {
        ...anyLayer.raw.encoding[key],
        animation: animationEncodings[key].animation,
      }
      return encodings
    }, {} as Record<string, Encoding>)
    updatedEncodings.animation = encoding
    const updatedLayer = this.updateEncodings(layer, { ...layer.raw.encoding, ...updatedEncodings} as Encodings)
    updatedLayer.encoding.size?.resetUpdatedTimestamp()
    updatedLayer.encoding.color?.resetUpdatedTimestamp()
    updatedLayer.encoding.animation?.resetUpdatedTimestamp()
    return updatedLayer
  }

  duplicate(layer: Layer) {
    let duplicatedLayer = this.layerFactory.duplicate(layer)
    duplicatedLayer = this.mutate(duplicatedLayer, {id: uuidv4(), name: `${duplicatedLayer.name} (${i18n('COPY')})`})
    if (duplicatedLayer.hasChildren()) {
      const children = duplicatedLayer.children!.map((child) => this.mutate(child, {
        id: uuidv4(),
        parentId: duplicatedLayer.getId(),
      }))
      duplicatedLayer = this.mutate(duplicatedLayer, {children: new Layers(...children)})
    }

    return duplicatedLayer
  }
}
