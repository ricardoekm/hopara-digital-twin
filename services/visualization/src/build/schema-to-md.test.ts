import {JsonSchemaToMarkdown} from "./schema-to-md.js";

const jsonToMd = new JsonSchemaToMarkdown({})

describe('JsonSchemaToMarkdown', () => {
  describe('renderPartial', () => {
    describe('Array', function () {
      it('with $ref', () => {
        const md = jsonToMd.renderPartial('any', {
          "items": {
            "$ref": "#/definitions/AnyType"
          },
          "type": "array"
        })
        expect(md).toEqual(`## items\n[AnyType](/docs/hidden/any-type.html)`)
      })

      it('with multiple $refs', () => {
        const md = jsonToMd.renderPartial('any', {
          "items": [{
            "$ref": "#/definitions/Ref1",
          }, {
            "$ref": "#/definitions/Ref2",
          }],
          "type": "array"
        })
        expect(md).toEqual(`## items\n[Ref1](/docs/hidden/ref1.html)\n[Ref2](/docs/hidden/ref2.html)`)
      })

      it('with $ref and minMax', () => {
        const md = jsonToMd.renderPartial('any', {
          "items": {
            "$ref": "#/definitions/AnyType"
          },
          "minItems": 5,
          "maxItems": 10,
          "type": "array"
        })
        expect(md).toEqual(
          'item Count: between `5` and `10`\n' +
          '## items\n' +
          '[AnyType](/docs/hidden/any-type.html)'
        )
      })

      it('of primitives', () => {
        const md = jsonToMd.renderPartial('any', {
          "items": {
            "type": "number"
          },
          "type": "array"
        })
        expect(md).toEqual(
          '## items\n' +
          'number'
        )
      })
    })

    describe('#Ref', function () {
      it('with $ref', () => {
        const md = jsonToMd.renderPartial('any', {
          "$ref": "#/definitions/AnyType"
        })
        expect(md).toEqual(`[AnyType](/docs/hidden/any-type.html)`)
      })
    })

    describe('String', function () {
      it('default', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string"
        })
        expect(md).toEqual('string')
      })
      it('with enum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "enum": ["a", "b"]
        })
        expect(md).toEqual('any of:<br>_"a"_, _"b"_\nstring')
      })
      it('with format', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "format": "date-time"
        })
        expect(md).toEqual('string\nformat must be a "date-time"')
      })
      it('with pattern', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "pattern": "^[a-z]+$"
        })
        expect(md).toEqual('string\nmust match this pattern: `^[a-z]+$`')
      })
      it('with minLength', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "minLength": 5
        })
        expect(md).toEqual('string\nlength: &ge; `5`\n')
      })
      it('with maxLength', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "maxLength": 5
        })
        expect(md).toEqual('string\nlength: &le; `5`\n')
      })
      it('with minLength and maxLength', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "string",
          "minLength": 5,
          "maxLength": 10
        })
        expect(md).toEqual('string\nlength: between `5` and `10`\n')
      })
    })

    describe('Number', function () {
      it('default', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number"
        })
        expect(md).toEqual('number')
      })
      it('with minimum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "minimum": 5
        })
        expect(md).toEqual('number\nrange: &ge; `5`\n')
      })
      it('with exclusiveMinimum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "exclusiveMinimum": 5
        })
        expect(md).toEqual('number\nrange: &gt; `5`\n')
      })
      it('with maximum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "maximum": 5
        })
        expect(md).toEqual('number\nrange: &le; `5`\n')
      })
      it('with exclusiveMaximum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "exclusiveMaximum": 5
        })
        expect(md).toEqual('number\nrange: &lt; `5`\n')
      })
      it('with minimum and maximum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "minimum": 5,
          "maximum": 10
        })
        expect(md).toEqual('number\nrange: between `5` and `10`\n')
      })
      it('with exclusiveMinimum and exclusiveMaximum', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "exclusiveMinimum": 5,
          "exclusiveMaximum": 10
        })
        expect(md).toEqual('number\nrange: between `5` and `10` (exclusive)\n')
      })
      it('with multipleOf', () => {
        const md = jsonToMd.renderPartial('any', {
          "type": "number",
          "multipleOf": 5
        })
        expect(md).toEqual('number\nmultiple of `5`')
      })
    })

    describe('AnyOf', function () {
      it('of types', () => {
        const md = jsonToMd.renderPartial('any', {
          "anyOf": [{
            "type": "string"
          }, {
            "type": "number"
          }]
        })
        expect(md).toEqual('Any of\n* string\n* number')
      })
      it('of $ref', () => {
        const md = jsonToMd.renderPartial('any', {
          "anyOf": [{
            "$ref": "#/definitions/Re1",
          }, {
            "$ref": "#/definitions/Re2",
          }]
        })
        expect(md).toEqual('Any of\n* [Re1](/docs/hidden/re1.html)\n* [Re2](/docs/hidden/re2.html)')
      })
      it('of complex objects', () => {
        const md = jsonToMd.renderPartial('any', {
          "anyOf": [{
            "type": "object",
            "properties": {
              "a": {
                "type": "string"
              }
            }
          }, {
            "type": "object",
            "properties": {
              "b": {
                "type": "number"
              }
            }
          }]
        })
        expect(md).toEqual('Any of\n* {a: string}\n* {b: number}')
      })
    })

    describe('OneOf', function () {
      it('of types', () => {
        const md = jsonToMd.renderPartial('any', {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "number"
          }]
        })
        expect(md).toEqual('One of\n* string\n* number')
      })
      it('of $ref', () => {
        const md = jsonToMd.renderPartial('any', {
          "oneOf": [{
            "$ref": "#/definitions/Re1",
          }, {
            "$ref": "#/definitions/Re2",
          }]
        })
        expect(md).toEqual('One of\n* [Re1](/docs/hidden/re1.html)\n* [Re2](/docs/hidden/re2.html)')
      })
    })

    describe('Object with properties', function () {
      it('default', () => {
        const md = jsonToMd.renderPartial('any', {
          "additionalProperties": false,
          "properties": {
            "debounce": {
              "type": "number"
            },
            "element": {
              "anyOf": [
                {
                  "$ref": "#/definitions/Element"
                },
                {
                  "additionalProperties": false,
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    }
                  }
                }
              ],
            },
            "event": {
              "type": "string"
            }
          },
          "required": [
            "element"
          ],
          "type": "object"
        })
        expect(md).toEqual(`## properties

|Property|Type|Description|
|--------|----|-----------|
|debounce|Number||
|element|Any of:<br>[Element](/docs/hidden/element.html), {name: string}|***Required.*** |
|event|String||
`)
      })
    })

    describe('Dictionary', function () {
      it('of string', () => {
        const md = jsonToMd.inferType({
          "additionalProperties": {
            "type": "string"
          },
          "type": "object"
        })
        expect(md).toEqual('Dictionary of string')
      })
      it('of number', () => {
        const md = jsonToMd.inferType({
          "additionalProperties": {
            "type": "number"
          },
          "type": "object"
        })
        expect(md).toEqual('Dictionary of number')
      })
      it('of $ref', () => {
        const md = jsonToMd.inferType({
          "additionalProperties": {
            "$ref": "#/definitions/Re1"
          },
          "type": "object"
        })
        expect(md).toEqual('Dictionary of [Re1](/docs/hidden/re1.html)')
      })
    })
  })
})
