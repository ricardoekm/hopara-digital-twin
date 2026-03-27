import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import omit from 'lodash/fp/omit.js'

export class SchemaMigration039to040 extends BaseMigration {
  calculateCommonValue(value: number, referenceZoom: number): number {
    return value / Math.pow(2, referenceZoom)
  }

  migrateSizeEncoding(encoding: any): any {
    if (!encoding.value || !encoding.resize?.referenceZoom) {
      return omit(['resize', 'units'], encoding)
    }

    const newEncoding = omit(['resize', 'units'], {
      ...encoding,
      value: this.calculateCommonValue(encoding.value, encoding.resize?.referenceZoom ?? 0),
    })

    return newEncoding
  }

  migrateResize(encoding: any): any {
    const newEncoding = {...encoding}

    if (newEncoding.size || newEncoding.strokeSize) {
      newEncoding.config = {
        units: 'pixels',
      }
    }

    if (newEncoding.size?.resize?.maxZoom || newEncoding.strokeSize?.resize?.maxZoom) {
      newEncoding.config.maxResizeZoom = newEncoding.size?.resize?.maxZoom ?? newEncoding.strokeSize?.resize?.maxZoom
    }

    if (newEncoding.size?.resize?.referenceZoom || newEncoding.strokeSize?.resize?.referenceZoom) {
      newEncoding.config.units = 'common'
    }

    if (newEncoding.size) {
      newEncoding.size = this.migrateSizeEncoding(newEncoding.size)
    }

    if (newEncoding.strokeSize) {
      newEncoding.strokeSize = this.migrateSizeEncoding(newEncoding.strokeSize)
    }

    return {encoding: newEncoding}
  }


  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'encoding', (key, value) => this.migrateResize(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.40')
  }
}
