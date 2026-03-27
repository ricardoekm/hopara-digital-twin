import fs from 'fs'
import {getCurrentAppVersion, getSchemaId} from './schema/schema-repository.js'

const schema = JSON.parse(fs.readFileSync('out/schemas/schema.json', 'utf8'))

const fixLayersSymbolSchema = (schema) => {
  schema.definitions.LayerSpec.discriminator = {propertyName: 'type'}
  schema.definitions.LayerSpec.oneOf = schema.definitions.LayerSpec.anyOf
  delete schema.definitions.LayerSpec.anyOf
  return schema
}

const fixActionsymbolSchema = (schema) => {
  schema.definitions.ActionSpec.discriminator = {propertyName: 'type'}
  schema.definitions.ActionSpec.oneOf = schema.definitions.ActionSpec.anyOf
  delete schema.definitions.ActionSpec.anyOf
  return schema
}

const getSanitizedDefinitions = (schema) => {
  const definitions = Object.keys(schema.definitions ?? [])
  return Object.fromEntries(
    definitions.map((def) => {
      const newName = def.replace(/[^a-zA-Z0-9]+/g, '_')
      return [def, newName]
    })
  )
}

const sanitizeSchemaDefinitions = (schema) => {
  const definitionSanitizedRecord = getSanitizedDefinitions(schema)

  let schemaStr = JSON.stringify(schema, null, 2)
  Object.entries(definitionSanitizedRecord).forEach(([oldName, newName]) => {
    // escape regex
    let escapedOldName1 = oldName.replace(/"/g, '\\"')
    escapedOldName1 = escapedOldName1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(escapedOldName1 + '\\"', 'g')
    schemaStr = schemaStr.replace(regex, newName + '"')

    const escapedOldName2 = oldName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex2 = new RegExp(escapedOldName2 + '\\"', 'g')
    schemaStr = schemaStr.replace(regex2, newName + '"')
  })
  return JSON.parse(schemaStr)
}

const add$IdToSchema = (schema) => {
  schema.$id = getSchemaId(undefined, 'VisualizationSpec')
  return schema
}

const sanitizeBadFormats = (schema) => {
  let schemaStr = JSON.stringify(schema, null, 2)
  schemaStr = schemaStr.replace(/"format":\s*"(color-hex|uri-reference)",/g, '')
  return JSON.parse(schemaStr)
}

const saveSchema = (schema) => {
  const schemaStr = JSON.stringify(schema, null, 2)
  const version = getCurrentAppVersion()
  fs.writeFileSync(`out/schemas/${version}.json`, schemaStr)
}

(async () => {
  let sanitizedSchema = sanitizeSchemaDefinitions(schema)
  sanitizedSchema = sanitizeBadFormats(sanitizedSchema)
  sanitizedSchema = fixLayersSymbolSchema(sanitizedSchema)
  sanitizedSchema = add$IdToSchema(sanitizedSchema)
  sanitizedSchema = fixActionsymbolSchema(sanitizedSchema)
  saveSchema(sanitizedSchema)
})()
