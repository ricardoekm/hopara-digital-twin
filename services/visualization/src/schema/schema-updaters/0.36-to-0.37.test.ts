import {SchemaMigration036to037} from './0.36-to-0.37.js'

test('migrate shadow to its own encoding', () => {
  const migration = new SchemaMigration036to037()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.36',
    layers: [{
      id: 'any',
      encoding: {
        color: {
          shadow: {
            inner: true,
            outer: true,
          },
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.37',
    layers: [{
      id: 'any',
      encoding: {
        color: {},
        shadow: {
          inner: true,
          outer: true,
        },
      },
    }],
  })
})
