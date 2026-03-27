import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration046to047 extends BaseMigration {
  migrateObjects(visualization: Record<string, any>): any {
    const layers = visualization.layers.filter((l) => l.type === 'composite')
    layers.forEach((layer) => {
      const childWithConfig = layer.children.find((l) => !!l.encoding?.config?.maxResizeZoom || !!l.encoding?.config?.unit)
      if (childWithConfig) {
        layer.encoding = {
          ...layer.encoding,
          config: childWithConfig.encoding.config,
        }
        layer.children.forEach((child) => {
          delete child.encoding?.config
        })
      }
    })
    return visualization
  }

  getSchemaVersion(): string {
    return getSchemaId('0.47')
  }
}
