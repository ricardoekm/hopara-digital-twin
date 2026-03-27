import {SchemaMigration053to054} from './0.53-to-0.54.js'

test('migrate template format', () => {
  const migration = new SchemaMigration053to054()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        template: {
          id: 'alerting-icon',
          data: {
            color: 'red'
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.54',
    layers: [
      {
        template: {
          id: 'alerting-icon',
          color: 'red'
        }
      }
    ]
  })
})
