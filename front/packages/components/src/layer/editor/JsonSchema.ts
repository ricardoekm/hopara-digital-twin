import {clone} from 'lodash/fp'

export interface JsonPropertyMeta {
  name: string
  definitionName?: string
}

export class JsonSchema {
  schema: any

  constructor(schema: any) {
    this.schema = schema
  }

  getPropertiesMeta(prefix = ''): JsonPropertyMeta[] {
    if (!this.schema?.properties) {
      return []
    }
    return Object.keys(this.schema.properties).map((name) => {
      const propertySchema = this.schema.properties[name]
      return {
        name: prefix + name,
        definitionName: propertySchema.$ref ? propertySchema.$ref.replace('#/definitions/', '') : undefined,
      }
    })
  }

  getPropertySchema(propertyName: string): JsonSchema {
    if (!this.schema?.properties || !this.schema.properties[propertyName]) {
      return new JsonSchema({})
    }
    const propertySchema = this.schema.properties[propertyName]
    if (propertySchema?.$ref) {
      return this.getSubSchema(propertySchema.$ref)
    }
    return new JsonSchema(clone(propertySchema))
  }

  getSubSchema(definitionName: string): JsonSchema {
    definitionName = definitionName.replace('#/definitions/', '')
    let subSchema: any
    if (!this.schema?.definitions) {
      return new JsonSchema({})
    }
    subSchema = this.schema.definitions[definitionName]
    if (!subSchema) {
      return new JsonSchema({})
    }
    subSchema = clone(subSchema)
    subSchema.definitions = clone(this.schema.definitions)
    delete subSchema.definitions[definitionName]

    if (Object.keys(subSchema.definitions).length === 0) {
      delete subSchema.definitions
    }
    return new JsonSchema(subSchema)
  }
}

