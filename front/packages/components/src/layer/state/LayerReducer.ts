import actions, {ActionTypes} from '../../state/Actions'
import {getType} from 'typesafe-actions'
import {LayerStore} from './LayerStore'
import {INTERNAL_DATA_SOURCE, Query} from '@hopara/dataset'
import {AnimationEncoding, Data} from '@hopara/encoding'
import {Layer, PlainLayer} from '../Layer'
import {Layers} from '../Layers'
import {VisualizationJump} from '../../action/Action'
import {LayerMutator} from '../mutator/LayerMutator'
import {LayerFactory} from '../factory/LayerFactory'
import {LayerType} from '../LayerType'
import {Reducer} from '@hopara/state'
import {Store} from '../../state/Store'
import {Area} from '../../visualization/pages/Area'
import { PositionEncodingFactory } from '../editor/position/PositionEncodingFactory'
import { VisualizationType } from '../../visualization/Visualization'
import { EncodingAnimation } from '../EncodingAnimation'
import { OffsetEncoding } from '@hopara/encoding/src/offset/OffsetEncoding'
import { getUserLocationPlainLayer } from '../../user-location/UserLocationLayer'
import { Logger } from '@hopara/internals'

const mutateData = (query: Query | undefined, currentData: Data | undefined) => {
  if (!query) return new Data()
  return new Data({source: query.dataSource, query: query.name, transform: currentData?.transform})
}

const getLayerFactory = (state: LayerStore, globalState: Store) => {
  const queries = globalState?.queryStore?.queries
  const visualization = globalState?.visualizationStore?.visualization
  return new LayerFactory({
    queries,
    zoomRange: globalState?.viewState?.zoomRange,
    layerDefaults: state.layerDefaults,
    layers: state.layers,
    scope: visualization?.scope,
    visualizationType: visualization?.type,
    visualizationCreatedVersion: visualization?.createdVersion,
    layerTemplates: globalState?.layerTemplate.layerTemplates,
    viewState: globalState?.viewState,
  })
}

const getLayerMutator = (state: LayerStore, globalState: Store) => {
  const visualization = globalState?.visualizationStore?.visualization
  const layerFactory = getLayerFactory(state, globalState)
  return new LayerMutator(layerFactory, visualization?.type)
}

export const layerReducer: Reducer<LayerStore, ActionTypes> = (oldState = new LayerStore(), action: ActionTypes, globalState: Store): LayerStore => {
  const layerMutator = getLayerMutator(oldState, globalState)
  const state = oldState?.setLayerMutator(layerMutator)

  switch (action.type) {
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed): {
      return state
        .setLayers(new Layers(...action.payload.layers))
        .setLayerDefaults(action.payload.layerDefaults)
    }
    case getType(actions.layer.visibilityChanged): {
      return state
        .upsertLayer(layerMutator.updateVisibility(
          state.layers.getById(action.payload.id, false)!,
          action.payload.visible,
        ))
    }
    case getType(actions.layer.queryChanged): {
      const currentData = state.layers.getById(action.payload.id, true)?.data
      return state
        .updateLayer(action.payload.id, {data: mutateData(action.payload.query, currentData)})
        .updateLayerDetails(action.payload.id, action.payload.query)
        .resetUpdatedTimestamp(action.payload.id)
    }
    case getType(actions.layer.dataSourceChanged): {
      if (action.payload.dataSource === INTERNAL_DATA_SOURCE) {
        const data = Data.internal(action.payload.id)
        const query = globalState.queryStore.queries.findQuery({query: data.query, source: data.source})
        if ( !query ) {
          Logger.error(`Internal query not found: ${data.source} / ${data.query}`)
        }

        return state
          .setLayerMutator(layerMutator)
          .updateLayer(action.payload.id, {data})
          .updateLayerDetails(action.payload.id, query!)
      } else {
        return state
          .setLayerMutator(layerMutator)
          .updateLayer(action.payload.id, {data: {source: action.payload.dataSource} as any})
      }
    }
    case getType(actions.layer.transformChanged): {
      const layers = globalState.layerStore?.layers as Layers
      const layer = layers?.getById(action.payload.id) as Layer
      const query = layer.data.query ? globalState?.queryStore?.queries.findQuery(layer.getQueryKey()) : undefined
      return state
        .updateLayer(action.payload.id, {
          data: new Data({
            ...layer.data,
            transform: action.payload.transform,
          }),
        })
        .updateLayerDetails(action.payload.id, query as Query, action.payload.transform?.type)
    }
    case getType(actions.layerTemplate.typeChanged): {
      const layers = globalState.layerStore?.layers as Layers
      const layer = layers?.getById(action.payload.layerId) as Layer
      return state
        .updateLayer(action.payload.layerId, {
          template: {
            ...layer.template,
            id: action.payload.templateId,
          },
      })
    }
    case getType(actions.userLocation.show.success): {
      const layerFactory = getLayerFactory(state, globalState)
      const userLocationLayers = layerFactory.createLayers(getUserLocationPlainLayer(action.payload.coordinates, action.payload.accuracy))
      const newState = state.clone()
      newState.userLocationLayers = userLocationLayers
      return newState
    }
    case getType(actions.userLocation.hide): {
      const newState = state.clone()
      newState.userLocationLayers = undefined
      return newState
    }
    case getType(actions.layerTemplate.configChanged): {
      const layers = globalState.layerStore?.layers as Layers
      const layer = layers?.getById(action.payload.layerId) as Layer
      return state
        .updateLayer(action.payload.layerId, {
          template: {
            ...layer.template,
            [action.payload.fieldPath]: action.payload.value,
          },
        })
    }
    case getType(actions.objectEditor.lockToggleRequested): {
      return state.toggleLockedLayers(action.payload.layerId)
    }
    case getType(actions.objectEditor.lockOtherLayersRequested): {
      return state.lockOtherLayers(action.payload.layerId)
    }
    case getType(actions.objectEditor.unlockOtherLayersRequested): {
      return state.unlockOtherLayers(action.payload.layerId)
    }
    case getType(actions.layer.codeChanged): {
      return state
        .upsertLayer(action.payload.layer)
        .setSelectedLayer(action.payload.layer.getId())
    }
    case getType(actions.layer.typeChanged): {
      const layer = state.layers.getById(action.payload.id, false) as Layer
      const updatedLayer = layerMutator.mutate(layer, {type: action.payload.type})
      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.layer.created): {
      const plainLayer = {
        ...action.payload.partialLayer,
        type: action.payload.type as LayerType,
        parentId: action.payload.parentId,
      } as PlainLayer

      const layerFactory = getLayerFactory(state, globalState)
      const layer = layerFactory.createLayer(plainLayer, state.layers as any, {parentId: action.payload.parentId})
      const visualizationType = globalState.visualizationStore.visualization.type

      const updatedState = state
        .upsertLayer(layer)
        .setSelectedLayer(layer.getId())
        .setOpenGroups([...state.openGroups, 'data'])

      if (action.payload.parentId) {
        return updatedState
      }

      const resize = visualizationType === VisualizationType.WHITEBOARD || visualizationType === VisualizationType.THREE_D
      if ( resize ) {
        const resizeAction = actions.layer.resizeChanged({layerId: layer.getId(), resize})
        return layerReducer(updatedState, resizeAction, globalState)
      }
      return updatedState
    }
    case getType(actions.layer.toHoparaManaged.request): {
      const mutatedLayer = layerMutator.mutate(action.payload.layer, {data: action.payload.data})
      return state.upsertLayer(mutatedLayer)
    }
    case getType(actions.layer.toHoparaManaged.success): {
      const layer = state.layers.getById(action.payload.layer.getId(), false)!
      // To run the position auto fill with the new queries
      layerMutator.layerFactory.getDynamicDefaultsFiller().fillDynamicDefaults(layer)
      return state.upsertLayer(layer)
    }
    case getType(actions.layer.moved):
      return state.moveLayer(action.payload.id, action.payload.steps)
    case getType(actions.layer.deleted): {
      const layer = state.layers.getById(action.payload.id, false)
      return state
        .deleteLayer(layer)
        .setSelectedLayer(layer?.parentId)
    }
    case getType(actions.layer.changed): {
      return state.updateLayer(action.payload.id, action.payload.change)
    }
  case getType(actions.layer.orderChanged): {
      const layer = state.layers.getById(action.payload.layerId, true)!
      return state.updateLayer(layer.getId(), layerMutator.updateChildren(layer, action.payload.children))
    }
    case getType(actions.layer.encodingChanged):
    case getType(actions.layer.sizeEncodingChanged):
    case getType(actions.layer.positionEncodingChanged): {
      return state
        .upsertLayer(layerMutator.updateEncoding(
          state.layers.getById(action.payload.layerId, false)!,
          action.payload.encoding,
          action.payload.type,
        ))
    }
    case getType(actions.layer.offsetEncodingChanged): {
      const layer = state.layers.getById(action.payload.layerId, false)!
      const newOffsetEncoding = new OffsetEncoding({...layer.raw.encoding?.offset, ...action.payload.encoding})
      const updateEncodingAction = actions.layer.encodingChanged({type: 'offset', layerId: action.payload.layerId, encoding: newOffsetEncoding})
      return layerReducer(state, updateEncodingAction, globalState)
    }
    case getType(actions.layer.positionTypeChanged): {
      const layer = state.layers.getById(action.payload.layerId, false)!
      const visualizationType = globalState.visualizationStore.visualization.type
      const newPositionEncoding = PositionEncodingFactory.createFromType(action.payload.type,
                                    layer, visualizationType, layer.getPositionEncoding()!)
      return state
        .upsertLayer(layerMutator.updateEncoding(
          layer!,
          newPositionEncoding,
          'position',
        ))
    }
    case getType(actions.layer.resizeChanged): {
      const updatedLayer = layerMutator.updateResize(
        state.layers.getById(action.payload.layerId, true)!,
        action.payload.resize,
        globalState.viewState!.zoom,
      )
      updatedLayer.encoding.size?.resetUpdatedTimestamp()
      updatedLayer.encoding.offset?.resetUpdatedTimestamp()
      updatedLayer.encoding.strokeSize?.resetUpdatedTimestamp()

      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.layer.animationChanged): {
      const layer = state.getSelectedLayer()
      if (!layer) return state
      const encodingAnimation = new EncodingAnimation(action.payload.encoding as AnimationEncoding)
      const updatedLayer = layerMutator.updateAnimation(layer, encodingAnimation, action.payload.encoding as AnimationEncoding)
      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.view.viewLoaded):
    case getType(actions.view.viewResized): {
      const newState = state.clone()
      const layerFactory = getLayerFactory(state, globalState)
      for (const layer of newState.layers) {
        // Get render children returns the layer itself if it is not parent
        for (const renderLayer of layer.getRenderLayers()) {
          layerFactory.getDynamicDefaultsFiller().fillSizeProjection(renderLayer)
          layer.encoding.size?.resetUpdatedTimestamp()
          layer.setLastModified(new Date())
        }
      }
      return newState
    }
    case getType(actions.layer.encodingPreview): {
      if (!action.payload.encoding) return state.removePreview()
      return state
        .setPreview(layerMutator.updateEncoding(
          state.layers.getById(action.payload.layerId, false)!,
          action.payload.encoding,
          action.payload.type,
        ))
    }
    case getType(actions.layer.duplicated): {
      return state
        .duplicate(action.payload.layerId)
    }
    case getType(actions.layer.selected): {
      const currentLayer = state.getSelectedLayer()
      const targetLayer = action.payload.id ? state.layers.getById(action.payload.id) : undefined
      const isGoingBack: boolean = !targetLayer ||
        !!(currentLayer?.parentId && !targetLayer?.parentId)
      return state
        .setSelectedLayer(action.payload.id)
        .setIsGoingBack(isGoingBack)
    }
    case getType(actions.visualizationHistory.checkoutVersion):
      return state.removeSelectedLayer()
    case getType(actions.layer.openGroupsChanged):
      return state.setOpenGroups(action.payload.groups)
    case getType(actions.layer.selectAction):
      return state.setSelectedAction(action.payload.actionId)
    case getType(actions.layer.selectDetailsField):
      return state.setSelectedDetailsField(action.payload.field)
    case getType(actions.viewLayer.click):
      if (globalState.visualizationStore.area === Area.LAYER_EDITOR) {
        const rootLayer = state.layers.getRootLayer(action.payload.layerId)
        if ( rootLayer!.isType(LayerType.template) ) {
          return state.setSelectedLayer(rootLayer!.getId())
        } else {
          return state.setSelectedLayer(action.payload.layerId)
        }
      }
      return state
    case getType(actions.visualization.pageLoaded):
    case getType(actions.objectEditor.pageLoaded):
    case getType(actions.settings.pageLoaded):
      return state.setAdvancedMode(false)
    case getType(actions.layer.advancedModeClick):
      return state.setAdvancedMode(action.payload.enabled)
    case getType(actions.layer.actionChanged): {
      const layer = state.getSelectedLayer()
      if (!layer) return state
      const updatedLayer = layerMutator.upsertAction(layer, action.payload.action)
      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.layer.newActionRequested): {
      const layer = state.getSelectedLayer()
      if (!layer) return state
      const action = new VisualizationJump()
      return state
        .upsertLayer(layerMutator.upsertAction(layer, action))
        .setSelectedAction(action.id)
    }
    case getType(actions.layer.actionDeleted): {
      const layer = state.getSelectedLayer()
      if (!layer) return state
      const updatedLayer = layerMutator.removeAction(layer, action.payload.actionId)
      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.layer.actionMoved): {
      const layer = state.getSelectedLayer()
      if (!layer) return state
      const updatedLayer = layerMutator.moveAction(layer, action.payload.sourceIndex, action.payload.destinationIndex)
      return state.upsertLayer(updatedLayer)
    }
    case getType(actions.query.mergedWithRowset): {
      const layerFactory = getLayerFactory(state, globalState)
      return state
        .setLayers(layerFactory.setQueries(globalState.queryStore.queries.upsertQuery(action.payload.query))
          .fillDefaults())
    }
    case getType(actions.layer.ejectRequested): {
      return state.ejectLayer(action.payload.id)
    }
    default:
      return oldState
  }
}
