import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import isNil from 'lodash/fp/isNil.js'
import isEmpty from 'lodash/fp/isEmpty.js'

export class SchemaMigration056to057 extends BaseMigration {
  migrateLayer(layer: any, parentConfig?:any): any {
    const newLayer = {...layer}
    const configReferenceZoom = parentConfig?.referenceZoom || newLayer.encoding?.config?.referenceZoom
    if ( !isNil(configReferenceZoom) && newLayer.encoding) {
      if ( newLayer.encoding.size && isNil(newLayer.encoding.size.referenceZoom) ) {
        newLayer.encoding.size.referenceZoom = configReferenceZoom
      }

      if ( newLayer.encoding.strokeSize && isNil(newLayer.encoding.strokeSize.referenceZoom) ) {
        newLayer.encoding.strokeSize.referenceZoom = configReferenceZoom
      }

      if ( newLayer.encoding.offset?.x && isNil(newLayer.encoding.offset?.x.referenceZoom) ) {
        newLayer.encoding.offset.x.referenceZoom = configReferenceZoom
      }

      if ( layer.encoding.offset?.y && isNil(newLayer.encoding.offset?.y.referenceZoom) ) {
        newLayer.encoding.offset.y.referenceZoom = configReferenceZoom
      }
    }

    if ( !isEmpty(newLayer.children) ) {
      newLayer.children = newLayer.children.map((child: any) => this.migrateLayer(child, newLayer.encoding.config))
    }

    return newLayer
  }

  migrateLayers(layers:any) {
   const newLayers = layers.map((layer) => this.migrateLayer(layer))
   return {layers: newLayers}
  }


  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'layers', (key, value) => this.migrateLayers(value))
  }

  getSchemaVersion(): string {
    return getSchemaId('0.57')
  }
}
