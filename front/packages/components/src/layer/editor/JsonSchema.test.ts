import {JsonSchema} from './JsonSchema'

describe('JsonSchema', () => {
  describe('getPropertyNames', () => {
    it('should return empty array when properties is not defined', () => {
      const layerSchema = new JsonSchema({})
      expect(layerSchema.getPropertiesMeta()).toEqual([])
    })

    it('should return properties when properties is defined', () => {
      const layerSchema = new JsonSchema({properties: {a: {}, b: {}}})
      expect(layerSchema.getPropertiesMeta()).toEqual([{name: 'a'}, {name: 'b'}])
    })

    it('should return properties when properties is defined with definitions', () => {
      const layerSchema = new JsonSchema({
        properties: {
          a: {$ref: '#/definitions/a'},
        },
      })
      expect(layerSchema.getPropertiesMeta()).toEqual([{name: 'a', definitionName: 'a'}])
    })
  })

  describe('getSubSchema', () => {
    it('should return undefined when definitions is not defined', () => {
      const layerSchema = new JsonSchema({})
      expect(layerSchema.getSubSchema('a').schema).toEqual({})
    })

    it('should return undefined when definition does not exist', () => {
      const layerSchema = new JsonSchema({definitions: {}})
      expect(layerSchema.getSubSchema('a').schema).toEqual({})
    })

    it('should return sub schema with definitions when definition is defined', () => {
      const layerSchema = new JsonSchema({
        definitions: {
          a: {properties: {a1: {}}},
          b: {properties: {b1: {}}},
        },
      })
      expect(layerSchema.getSubSchema('a')?.schema).toEqual({
        properties: {a1: {}},
        definitions: {
          b: {
            properties: {
              b1: {},
            },
          },
        },
      })
    })
  })

  describe('getPropertySchema', () => {
    it('should return undefined when properties is not defined', () => {
      const layerSchema = new JsonSchema({})
      expect(layerSchema.getPropertySchema('a').schema).toEqual({})
    })

    it('should return undefined when property does not exist', () => {
      const layerSchema = new JsonSchema({properties: {}})
      expect(layerSchema.getPropertySchema('a').schema).toEqual({})
    })

    it('should return properties when properties is defined', () => {
      const layerSchema = new JsonSchema({
        properties: {
          a: {properties: {a1: {}}},
        },
      })
      expect(layerSchema.getPropertySchema('a')?.schema).toEqual({
        properties: {a1: {}},
      })
    })
    it('should return sub schema with definitions when definition is defined', () => {
      const layerSchema = new JsonSchema({
        properties: {
          a: {
            $ref: '#/definitions/a',
          },
        },
        definitions: {
          a: {
            properties: {
              a1: {},
            },
          },
        },
      })
      expect(layerSchema.getPropertySchema('a')?.schema).toEqual({
        properties: {a1: {}},
      })
    })
  })
})
