

import {SchemaMigration} from '../../schema/schema-updater.js'
import {Visualization} from '../domain/Visualization.js'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'

export class VisualizationEntity {
  id: string
  name: string
  schema: string
  visualizations: string
  version: number
  edited_by?: string
  edited_at?: string

  static fromDomain(domain: Visualization): VisualizationEntity {
    const visualization = new VisualizationEntity()
    const {id, name, $schema, ...rest} = domain
    visualization.id = id
    visualization.name = name!
    visualization.schema = $schema
    visualization.visualizations = JSON.stringify(rest)
    return visualization
  }

  toDomain(): Visualization {
    const visualizations = this.visualizations ? JSON.parse(this.visualizations) : undefined
    const visualization = {
      '$schema': this.schema,
      'id': this.id,
      'name': this.name,
      ...visualizations,
    }
    const migratedSpec = SchemaMigration.migrate(visualization)
    return VisualizationFactory.fromSpec(migratedSpec)
  }
}
