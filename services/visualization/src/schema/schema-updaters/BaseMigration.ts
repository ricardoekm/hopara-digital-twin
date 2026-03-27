import {VisualizationSpec} from '../../visualization/domain/spec/Visualization.js'

export abstract class BaseMigration {
  abstract migrateObjects(obj: Record<string, any>): any;
  abstract getSchemaVersion() : string;

  migrateSchemaVersion(obj: Record<string, any>): any {
    return {
      ...obj,
      $schema: this.getSchemaVersion(),
    }
  }

  migrate(oldSpec: Record<string, any>): VisualizationSpec {
    return [
      this.migrateObjects.bind(this),
      this.migrateSchemaVersion.bind(this),
    ].reduce((spec, migrationFn) => {
      return migrationFn(spec)
    }, oldSpec) as VisualizationSpec
  }
}
