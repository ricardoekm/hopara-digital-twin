import {Column, Columns} from '@hopara/dataset'
import {TextEncoding} from '@hopara/encoding'
import {DetailsFields} from './DetailsFields'

const fields = new DetailsFields({
  title: 'field-and-column',
  value: {
    encoding: {
      text: new TextEncoding({
        field: 'field-and-column',
        format: 'any-format',
      }),
    },
  },
}, {
  title: 'only-field',
  value: {
    encoding: {
      text: new TextEncoding({
        field: 'only-field',
      }),
    },
  },
})

const columns = new Columns(...[
  new Column({name: 'field-and-column'}),
  new Column({name: 'only-column'}),
])

describe('Details', () => {
  describe('fillFromColumns', () => {
    it('right join columns', () => {
      const newFields = fields.rightJoinColumns(columns)
      expect(newFields).toMatchObject([{
        value: {
          encoding: {
            text: {
              field: 'field-and-column',
              format: 'any-format',
            },
          },
        },
      }, {
        value: {
          encoding: {
            text: {
              field: 'only-column',
            },
          },
        },
      }])
    })

    it('full join columns', () => {
      const newFields = fields.unionColumns(columns)
      expect(newFields).toMatchObject([{
        visible: true,
        value: {
          encoding: {
            text: {
              field: 'field-and-column',
            },
          },
        },
      }, {
        value: {
          encoding: {
            text: {
              field: 'only-field',
            },
          },
        },
      }, {
        value: {
          encoding: {
            text: {
              field: 'only-column',
            },
          },
        },
      }])
    })
  })
})
