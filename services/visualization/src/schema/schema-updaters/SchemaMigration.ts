import {VisualizationSpec} from '../../visualization/domain/spec/Visualization.js'

export interface SchemaVersionMigration {
  migrate(oldSpec: any): VisualizationSpec
}
