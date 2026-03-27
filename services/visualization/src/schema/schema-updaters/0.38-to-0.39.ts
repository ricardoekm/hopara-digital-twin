import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration038to039 extends BaseMigration {
  migrateImage(image: any): any {
    if ( !image.library ) {
      return {image}
    }

    const newImage = {...image, scope: image.library}
    delete newImage.library
    return {image: newImage}
  }


  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'image', (key, value) => this.migrateImage(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.39')
  }
}
