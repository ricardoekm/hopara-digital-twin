import { ZoomRange } from '../../layer/domain/spec/ZoomRange.js'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration054to055 extends BaseMigration {
  calculatePixelValue(value: number, referenceZoom: number): number {
    return value * Math.pow(2, referenceZoom)
  }

  migrateSizeEncodings(newLayer: any, config: any) {
    const sizeEncodingsToMigrate = ['size', 'strokeSize']
    sizeEncodingsToMigrate.forEach((encodingName) => {
      if (!newLayer.encoding[encodingName]) return

      if (newLayer.encoding[encodingName].value) {
        newLayer.encoding[encodingName].value = this.calculatePixelValue(newLayer.encoding[encodingName].value, config.referenceZoom)
      }
      if (newLayer.encoding[encodingName].range) {
        newLayer.encoding[encodingName].range = newLayer.encoding[encodingName].range.map((value: number) => this.calculatePixelValue(value, config.referenceZoom))
      }
    })
  }

  migrateOffsetEncodings(newLayer: any, config: any) {
    if (newLayer.encoding?.offset?.x?.value) {
      newLayer.encoding.offset.x.value = this.calculatePixelValue(newLayer.encoding.offset.x.value, config.referenceZoom)
    }
    if (newLayer.encoding?.offset?.y?.value) {
      newLayer.encoding.offset.y.value = this.calculatePixelValue(newLayer.encoding.offset.y.value, config.referenceZoom)
    }
  }

  isInZoomRange(zoomRange: ZoomRange, zoom: number): boolean {
    const min = zoomRange?.min?.value ?? 0
    const max = zoomRange?.max?.value ?? 24
    return zoom >= min && zoom <= max
  }

  migrateReferenceZoom(newLayer: any, initialVisualizationZoom?: number) {
    if (!newLayer.encoding?.config || newLayer.encoding?.config?.referenceZoom !== undefined) return
    if (this.isInZoomRange(newLayer.visible?.zoomRange, initialVisualizationZoom ?? 0)) {
      newLayer.encoding.config.referenceZoom = initialVisualizationZoom ?? 0
    } else {
      newLayer.encoding.config.referenceZoom = newLayer.visible?.zoomRange?.min?.value ?? 0
    }
  }

  migrageLayer(newLayer:any, initialVisualizationZoom?: number, encodingConfig?: any) {
    const config = encodingConfig ?? newLayer.encoding?.config

    if (config?.units === 'common') {
      this.migrateReferenceZoom(newLayer, initialVisualizationZoom)
      this.migrateSizeEncodings(newLayer, config)
      this.migrateOffsetEncodings(newLayer, config)
    }

    if (newLayer.children?.length) {
      newLayer.children = newLayer.children.map((child: any) => this.migrageLayer({...child}, initialVisualizationZoom, newLayer.encoding.config))
    }

    return newLayer
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migratedLayers = visualization.layers.map((layer: any) => this.migrageLayer({...layer}, visualization.initialPosition?.zoom))
    return {...visualization, layers: migratedLayers}
  }


  getSchemaVersion(): string {
    return getSchemaId('0.55')
  }
}
