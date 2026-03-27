import {SchemaMigration034to035} from './0.34-to-0.35.js'

test('removes boolean boolean encodings', () => {
  const migration = new SchemaMigration034to035()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.34',
    layers: [{
      encoding: {
        strokeColor: false,
        strokeSize: false,
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.35',
    layers: [{
      encoding: {},      
    }],
  })
})

test('keep boolean encodings if not set to boolean', () => {
  const migration = new SchemaMigration034to035()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.34',
    layers: [{
      encoding: {
        strokeColor: {
          value: 'red',
        },
        strokeSize: {
          value: 10,
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.35',
    layers: [{
      encoding: {
        strokeColor: {
          value: 'red',
        },
        strokeSize: {
          value: 10,
        },
      },      
    }],
  })
})
