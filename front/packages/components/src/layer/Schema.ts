import {clone} from 'lodash/fp'

export const getSubSchema = (schema, symbol) => {
  if (!schema?.definitions || !schema.definitions[symbol]) {
    return
  }
  const subSchema = clone(schema.definitions[symbol])
  if (subSchema) {
    subSchema.definitions = schema.definitions
  }
  return subSchema
}
