import {Column, Columns, ColumnType, Row} from '@hopara/dataset'
import { ColorEncoding, ImageEncoding, TextEncoding } from '@hopara/encoding'
import { createDetailLines } from './DetailsLineFactory'
import {Details} from './Details'
import {DetailsFields} from './DetailsFields'
import { DetailsField } from './DetailsField'

expect.extend({
  // Formatted values returns a complex object, this makes easy to test comparing on how the tooltip should look like
  toVisualizeAs(lines, visualization) {
    let pass = true
    let message = () => ''
    for (const title of Object.keys(visualization)) {
      let line
      for (const columnName of Object.keys(lines)) {
        if (lines[columnName].title === title) {
          line = lines[columnName]
          break
        }
      }

      if (!line) {
        pass = false
        message = () => `Value of title ${title} was not found`
        break
      }

      if (visualization[title] !== line.value) {
        pass = false
        message = () => `The value was different. Expected ${visualization[title]} was ${line.value}`
        break
      }
    }

    return {pass, message}
  },
})

test('Tooltip ignores internal fields', () => {
  const columns = new Columns(
    new Column({name: 'externalField'}),
    new Column({name: '_internalField'}))

  const row = new Row({'externalField': 'a', '_internalField': 'b'})
  expect(createDetailLines(row, 'hopara', columns, new Details({}))).toVisualizeAs({'External field': 'a'})
})

test('Details line ignores complex fields', () => {
  const columns = new Columns(
    new Column({name: 'field'}),
    new Column({name: 'complexField', type: ColumnType.JSON}))

  const row = new Row({'field': 'a', 'complexField': {a: 10}})
  const lines = createDetailLines(row, 'hopara', columns, new Details({}))
  expect(lines.length).toEqual(1)
})

test('Details line with complex fields', () => {
  const columns = new Columns(
    new Column({name: 'metrics', type: ColumnType.JSON}))

  const row = new Row({metrics: {vibration: 10}})
  const tooltipItem = { id: 'any-id', value: { encoding: { text: new TextEncoding({ field: 'metrics.vibration' }) } } }

  const lines = createDetailLines(row, 'hopara', columns, {fields: new DetailsFields(...[tooltipItem])} as any)
  expect(lines).toVisualizeAs({'Metrics vibration': '10'})
})

test('Details line removes empty fields', () => {
  const columns = new Columns(new Column({name: 'empty'}), new Column({name: 'notEmpty'}))
  const row = new Row({'empty': '', 'notEmpty': 'cool'})

  const lines = createDetailLines(row, 'hopara', columns, new Details())
  expect(lines).toVisualizeAs({'Not empty': 'cool'})
})

test('Details line accepts list', () => {
  const columns = new Columns(new Column({name: 'list', type: ColumnType.STRING_ARRAY}))
  const row = new Row({'list': ['a', 'b']})

  expect(createDetailLines(row, 'hopara', columns, new Details())).toVisualizeAs({'List': 'a, b'})
})

test('Details lines keeps row column sort', () => {
  const columns = new Columns(
    new Column({name: 'c', type: ColumnType.STRING}),
    new Column({name: 'a', type: ColumnType.STRING}),
    new Column({name: 'b', type: ColumnType.STRING}),
  )
  const row = new Row({'a': 1, 'b': 2, 'c': 3})

  expect(createDetailLines(row, 'hopara', columns, new Details())).toEqual([
    {title: 'A', value: '1'},
    {title: 'B', value: '2'},
    {title: 'C', value: '3'},
  ])
})

test('Details lines with image', () => {
  const columns = new Columns(
    new Column({name: 'c', type: ColumnType.STRING}),
    new Column({name: 'a', type: ColumnType.STRING}),
    new Column({name: 'b', type: ColumnType.STRING}),
  )
  const row = new Row({'a': 1, 'b': 2, 'c': 3})

  const details = new Details({
    fields: new DetailsFields(
      new DetailsField({title: 'Aa', value: {encoding: {text: new TextEncoding({field: 'a'})}}}),
      new DetailsField({title: 'Bb', value: {encoding: {image: new ImageEncoding({field: 'b'})}}}),
      new DetailsField({title: 'Cc', value: {encoding: {text: new TextEncoding({field: 'c'})}}}),
    ),
  })

  expect(createDetailLines(row, 'hopara', columns, details)).toEqual([
    {title: 'Aa', value: '1'},
    {title: 'Bb', image: 'http://localhost:2022/tenant/hopara/image-library/default/image/2?resolution=sm'},
    {title: 'Cc', value: '3'},
  ])
})

test('Details lines with color', () => {
  const column = new Column({name: 'temperatura', type: ColumnType.STRING})
  const row = new Row({'temperatura': 10})

  const enconding = {
    text: new TextEncoding({field: 'temperatura'}),
    color: new ColorEncoding({value: '#eb4034'}),
  }
  const detailsField = new DetailsField({title: 'Temperatura', value: {encoding: enconding}})  
  const details = new Details({fields: new DetailsFields(detailsField)})

  const detailsLines = createDetailLines(row, 'hopara', new Columns(column), details)
  expect(detailsLines.length).toEqual(1)
  expect(detailsLines[0].color).toEqual([235, 64, 52, 255])
})
