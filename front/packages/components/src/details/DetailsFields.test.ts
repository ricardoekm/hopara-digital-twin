import {DetailsFields} from './DetailsFields'
import {TextEncoding} from '@hopara/encoding'
import {DetailsField} from './DetailsField'
import {Column, Columns, ColumnType} from '@hopara/dataset'

describe('DetailsFields', () => {
  it('findByField', () => {
    const details = new DetailsFields()
    details.push(new DetailsField({
      value: {encoding: {text: new TextEncoding({field: 'a'})}},
    }))
    details.push(new DetailsField({
      value: {encoding: {text: new TextEncoding({field: 'b'})}},
    }))
    const d = details.findByField('a')
    expect(d).toBeDefined()
  })

  it('findById', () => {
    const details = new DetailsFields()
    details.push(new DetailsField({
      value: {encoding: {text: new TextEncoding({field: 'a'})}},
    }))
    details.push(new DetailsField({
      value: {encoding: {text: new TextEncoding({field: 'b'})}},
    }))
    const d = details.findById('a')
    expect(d).toBeDefined()
  })

  describe('rightJoinColumns', () => {
    it('should exclude columns not printable columns', () => {
      const details = new DetailsFields()
      const columns = new Columns()
      columns.push(new Column({name: 'printable'}))
      columns.push(new Column({name: 'not-printable', type: ColumnType.GEOMETRY}))
      const d = details.rightJoinColumns(columns)
      expect(d).toMatchObject([
        {title: 'Printable'},
      ])
    })

    it('should exclude fields that does not exist in columns and does not contain dot', () => {
      const details = new DetailsFields(...[{
        title: 'I will be excluded',
        value: {encoding: {text: new TextEncoding({field: 'does-not-contain-dot'})}},
      }])
      const columns = new Columns()
      columns.push(new Column({name: 'any-column'}))
      const d = details.rightJoinColumns(columns)
      expect(d).toMatchObject([
        {title: 'Any column'},
      ])
    })

    it('should keep fields that does not exist in columns but contains dot', () => {
      const details = new DetailsFields(...[{
        title: 'I will be kept',
        value: {encoding: {text: new TextEncoding({field: 'does.contain.dot'})}},
      }])
      const columns = new Columns()
      columns.push(new Column({name: 'any-column'}))
      const d = details.rightJoinColumns(columns)
      expect(d).toMatchObject([
        {title: 'I will be kept'},
        {title: 'Any column'},
      ])
    })

    it('should keep details sorting and put columns to the end', () => {
      const details = new DetailsFields(...[{
        title: 'Abacate',
        value: {encoding: {text: new TextEncoding({field: 'a'})}},
      }, {
        title: 'Banana',
        value: {encoding: {text: new TextEncoding({field: 'b'})}},
      }])
      const columns = new Columns(...[
        new Column({name: 'd'}),
        new Column({name: 'c'}),
        new Column({name: 'b'}),
        new Column({name: 'a'}),
      ])
      const d = details.rightJoinColumns(columns)
      expect(d).toMatchObject([
        {title: 'Abacate', visible: true},
        {title: 'Banana', visible: true},
        {title: 'D', visible: true},
        {title: 'C', visible: true},
      ])
    })
  })

  describe('unionColumns', () => {
    it('should exclude columns not printable columns', () => {
      const details = new DetailsFields()
      const columns = new Columns()
      columns.push(new Column({name: 'printable'}))
      columns.push(new Column({name: 'not-printable', type: ColumnType.GEOMETRY}))
      const d = details.unionColumns(columns)
      expect(d).toMatchObject([
        {title: 'Printable'},
      ])
    })

    it('should union columns and details keeping sorting and adding columns to the end', () => {
      const details = new DetailsFields()
      details.push(new DetailsField({
        title: 'Abacate',
        value: {encoding: {text: new TextEncoding({field: 'a'})}},
      }))
      details.push(new DetailsField({
        title: 'Banana',
        value: {encoding: {text: new TextEncoding({field: 'b.b'})}},
      }))
      const columns = new Columns()
      columns.push(new Column({name: 'd'}))
      columns.push(new Column({name: 'c'}))
      columns.push(new Column({name: 'b.b'}))
      const d = details.unionColumns(columns)
      expect(d).toMatchObject([
        {title: 'Abacate', visible: true},
        {title: 'Banana', visible: true},
        {title: 'D', visible: false},
        {title: 'C', visible: false},
      ])
    })
  })
})
