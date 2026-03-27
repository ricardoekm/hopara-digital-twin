import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration037to038 extends BaseMigration {
  migrateTest(test: any): any {
    return { test: {
      field: test,
    }}
  }

  migrateAnimation(animation: any): any {
    if ( !animation.field ) {
      return {animation}
    }

    const condition = {
      test: {
        field: animation.field,
      },
    }

    const newAnimation = {...animation, condition}
    delete newAnimation.field
    return {animation: newAnimation}
  }


  migrateObjects(visualization: Record<string, any>): any {
    const migratedTests = deepReplace(visualization, 'test', (key, value) => this.migrateTest(value))
    return deepReplace(migratedTests, 'animation', (key, value) => this.migrateAnimation(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.38')
  }
}
