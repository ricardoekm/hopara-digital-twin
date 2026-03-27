import {SchemaMigration035to036} from './0.35-to-0.36.js'

test('migrate color condition to array', () => {
  const migration = new SchemaMigration035to036()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.35',
    layers: [{
      encoding: {
        color: {
          value: '#FFFFFF',
          condition: {
            test: 'alert',
            value: '#FF4341',
          },
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.36',
    layers: [{
      encoding: {
        color: {
          value: '#FFFFFF',
          conditions: [{
            test: 'alert',
            value: '#FF4341',
          }],
        },
      },
    }],
  })
})

test('if has no condition do nothing', () => {
  const migration = new SchemaMigration035to036()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.35',
    layers: [{
      encoding: {
        color: {
          value: '#FFFFFF',
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.36',
    layers: [{
      encoding: {
        color: {
          value: '#FFFFFF',
        },
      },
    }],
  })
})
