import {SchemaMigration037to038} from './0.37-to-0.38.js'

test('migrate condition test to a complex type', () => {
  const migration = new SchemaMigration037to038()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.37',
    layers: [{
      visible: {
        condition: {
          test: 'alert_level',
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.38',
    layers: [{
      visible: {
        condition: {
          test: {
            field: 'alert_level',
          },
        },
      },
    }],
  })
})

test('migrate animation to condition', () => {
  const migration = new SchemaMigration037to038()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.37',
    layers: [{
      encoding: {
        size: {
          animation: {
            type: 'pulse',
            field: 'alert_level',
          },
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.38',
    layers: [{
      encoding: {
        size: {
          animation: {
            type: 'pulse',
            condition: {
              test: {
                field: 'alert_level',
              },
            },
          },
        },
      },
    }],
  })
})
