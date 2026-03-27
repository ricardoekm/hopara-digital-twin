import {ScenegraphLayer} from '@deck.gl/mesh-layers'
import {ScenegraphLayerProps} from '@deck.gl/mesh-layers/scenegraph-layer/scenegraph-layer'
import {ModelAccessor, PositionAccessorFactory, RotationEncoding} from '@hopara/encoding'
import {BaseFactory} from '../BaseFactory'
import {DeckLayer} from '../../DeckLayer'
import {IndexRowTranslator, Row} from '@hopara/dataset'
import {ModelFetch} from '@hopara/resource'
import {groupBy} from 'lodash/fp'
import {DeckLayerProps} from '../../../DeckLayerFactory'
import {ScaleAccessorFactory} from './ScaleAcessorFactory'
import { CallbacksFactory } from '../../interaction/CallbacksFactory'
import { decorateAnimation } from '../../animation/AnimationDecorator'

export class ModelFactory extends BaseFactory<DeckLayerProps> {
  castValue(value: any): any {
    if (typeof value === 'string') {
      return JSON.parse(value)
    }

    return value
  }

  getRotationField(rotationEncoding: RotationEncoding | undefined, axis: string, index: number, row: Row): number {
    if (!rotationEncoding || !rotationEncoding[axis]) {
      return 0
    }

    const field = rotationEncoding[axis].field
    if (field && row[field]) {
      const value = this.castValue(row[field])
      if (Array.isArray(value)) {
        return value[index]
      }

      return value
    }

    return 0
  }

  getOrientation(props: DeckLayerProps, row: Row): number[] {
    if (props.encoding.rotation?.value) return props.encoding.rotation?.value
    const x = this.getRotationField(props.encoding.rotation, 'x', 0, row)
    const y = this.getRotationField(props.encoding.rotation, 'y', 1, row)
    const z = this.getRotationField(props.encoding.rotation, 'z', 2, row)

    // [pitch, yaw, roll] is equivalent to [y,z,x]
    return [y, z, x]
  }

  getColor(props: DeckLayerProps) {
    if (!props.encoding.color) return undefined
    const color = super.getColorAccessor(props.columns, props.encoding.color, props.rows)
    return color
  }

  getOpacity(props: DeckLayerProps) {
    if (props.edit.isEditingAnotherLayer) return 0.25
    return props.encoding?.color?.opacity ?? 1
  }

  getLastModified(props: DeckLayerProps, row: Row) {
    const library = props.encoding.model?.scope
    const resourceId = props.encoding.model?.getId(row)
    const uploadState = props.resource.resourceUploadState?.find((state) => state.library === library && state.resourceId === resourceId)
    const generateState = props.resource.resourceGenerateState?.find((state) => state.library === library && state.resourceId === resourceId)
    const historyState = props.resource.modelHistory
    const lastModifieds: Date[] = []
    if (historyState?.lastModified) lastModifieds.push(historyState.lastModified)
    if (uploadState?.lastModified) lastModifieds.push(uploadState?.lastModified)
    if (generateState?.lastModified) lastModifieds.push(generateState?.lastModified)
    return lastModifieds.length ? new Date(Math.max(...lastModifieds as any)) : undefined
  }

  getModelUri(props: DeckLayerProps, row: Row) {
    const lastModified = this.getLastModified(props, row)
    return new ModelFetch().getUrl({
      id: props.encoding.model?.getId(row),
      fallback: props.encoding.model?.getFallback(row) ?? props.encoding.model?.value,
      library: props.encoding.model?.scope,
      tenant: props.resource.authorization.tenant,
      version: lastModified,
    }, props.resource.modelHistory)?.toString()
  }

  createSceneLayers(props: DeckLayerProps, rowsByModel: Record<string, Row[]>) {
    return Object.keys(rowsByModel).map((model) => {
      const modelUri = this.getModelUri(props, rowsByModel[model][0])

      let deckProps: ScenegraphLayerProps<DeckLayer> = super.getDeckProps(props, {
        id: `${props.layerId}#${modelUri}`,
        pickable: props.edit.pickable,
        scenegraph: modelUri,
        data: rowsByModel[model],
        loadOptions: {fetch: new ModelFetch().fetch(props.resource.onResourceDownloadProgressChange)},
        _lighting: 'pbr',
        getColor: this.getColor(props),
        opacity: this.getOpacity(props),
        getScale: ScaleAccessorFactory.create(props.rows, props.encoding.size),
        getPosition: PositionAccessorFactory.create(props.encoding.position?.anchor),
        getOrientation: (row) => this.getOrientation(props, row),
        parameters: {
          depthTest: (props.encoding?.color?.opacity ?? 1) < 0.5 ? false : !props.encoding.model?.overlap && !props.edit.isEditingAnotherLayer,
        },
        updateTriggers: {
          getColor: super.getEncodingUpdateTrigger(props.encoding.color, props.rows),
          getScale: super.getEncodingUpdateTrigger(props.encoding.size, props.rows),
          getPosition: super.getPositionUpdateTrigger(props.encoding.position, props.edit.editing, props.rows),
          getOrientation: super.getEncodingUpdateTrigger(props.encoding.rotation, props.rows),
        },
        ...CallbacksFactory.create(this.getEditCallbackProps(props), new IndexRowTranslator(props.rows)),
      })

      deckProps = decorateAnimation(props, deckProps)

      return new ScenegraphLayer(deckProps)
    })
  }

  create(props: DeckLayerProps) {
    const rowsByModel = groupBy((row) => ModelAccessor.getModel(props.encoding.model, row), props.rows)
    return this.createSceneLayers(props, rowsByModel)
  }
}
