import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration040to041 extends BaseMigration {
  migrateAnimation(animation: any): any {
    if (animation.type !== 'flow' || !animation.speed) {
      return {animation}
    }
    return {
      animation: {
        ...animation,
        speed: 5,
      },
    }
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'animation', (key, value) => this.migrateAnimation(value))
  }

  getSchemaVersion(): string {
    return getSchemaId('0.41')
  }
}

