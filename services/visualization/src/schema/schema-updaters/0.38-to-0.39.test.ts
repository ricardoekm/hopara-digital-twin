import {SchemaMigration038to039} from './0.38-to-0.39.js'

test('migrate image library to scope', () => {
  const migration = new SchemaMigration038to039()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.38',
    layers: [{
      type: 'image',
      encoding: {
        image: {
          library: 'my-scope',
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.39',
    layers: [{
      type: 'image',
      encoding: {
        image: {
          scope: 'my-scope',
        },
      },
    }],
  })
})

