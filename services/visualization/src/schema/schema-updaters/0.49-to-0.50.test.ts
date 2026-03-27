import {SchemaMigration049to050} from './0.49-to-0.50.js'

test('add default group', () => {
  const migration = new SchemaMigration049to050()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.49',
    layers: [
      {
        details: {
          fields: [
            {
              id: 'fooId',
              name: 'foo',
            }
          ]
        }
      },
      {
        details: {
          tooltip: true,
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.50',
    layers: [
      {
        details: {
          fields: [
            {
              name: 'foo',
            }
          ]
        }
      },
      {
        details: {
          tooltip: true,
        }
      }
    ]
  })
})
