import {SchemaMigration055to056} from './0.55-to-0.56.js'

test('migrate common animation data to animation encoding', () => {
  const migration = new SchemaMigration055to056()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.55',
    layers: [
      {
        encoding: {
          color: {
            animation: {
              type: 'fadeInOut',
              condition: {
                test: {
                  field: 'alert_level'
                }
              }
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.56',
    layers: [
      {
        encoding: {
          color: {
            animation: {
              type: 'fadeInOut',
              condition: {
                test: {
                  field: 'alert_level'
                }
              }
            }
          },
          animation: {
            enabled: true,
            type: 'fadeInOut',
            condition: {
              test: {
                field: 'alert_level'
              }
            }
          }
        }
      }
    ]
  })
})
