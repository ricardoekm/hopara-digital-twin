import {SchemaMigration051to052} from './0.51-to-0.52.js'

test('add default group', () => {
  const migration = new SchemaMigration051to052()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.51',
    layers: [
      {
        map: {
          value: 'light-street',
        }
      },
      {
        map: {
          value: 'satellite',
        },
      },
      {
        anything: {
          value: 'bla'
        },
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        map: {
          value: 'light-street',
        }
      },
      {
        map: {
          value: 'google-maps-satellite',
        },
      },
      {
        anything: {
          value: 'bla'
        },
      }
    ]
  })
})
