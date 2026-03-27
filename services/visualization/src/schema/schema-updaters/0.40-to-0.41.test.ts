import {SchemaMigration040to041} from './0.40-to-0.41.js'

test('migrate flow speed', () => {
  const migration = new SchemaMigration040to041()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.40',
    layers: [{
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'flow',
            speed: 5000000,
          },
        },
      },
    }, {
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'flow',
          },
        },
      },
    }, {
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'blink',
            speed: 5000000,
          },
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.41',
    layers: [{
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'flow',
            speed: 5,
          },
        },
      },
    }, {
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'flow',
          },
        },
      },
    }, {
      type: 'line',
      encoding: {
        color: {
          animation: {
            type: 'blink',
            speed: 5000000,
          },
        },
      },
    }],
  })
})

