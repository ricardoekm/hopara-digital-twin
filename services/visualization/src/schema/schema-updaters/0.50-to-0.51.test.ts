import {SchemaMigration050to051} from './0.50-to-0.51.js'

test('add default group', () => {
  const migration = new SchemaMigration050to051()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.50',
    layers: [
      {
        text: {
          field: 'foo',
        }
      },
      {
        text: {
          field: 'bar',
          maxLength: {
            value: 10,
            overflow: 'WRAP'
          }
        }
      },
      {
        text: {
          field: 'foobar',
          maxLength: {
            value: 10,
            overflow: 'ELLIPSIS'
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.51',
    layers: [
      {
        text: {
          field: 'foo',
        }
      },
      {
        text: {
          field: 'bar',
          maxLength: {
            value: 10,
            type: 'AUTO'
          }
        }
      },
      {
        text: {
          field: 'foobar',
          maxLength: {
            value: 10,
            type: 'FIXED'
          }
        }
      }
    ]
  })
})
