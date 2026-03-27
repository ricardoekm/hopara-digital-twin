import {SchemaMigration032to033} from './0.32-to-0.33.js'

test('migrate suffix and preffix', () => {
  const migration = new SchemaMigration032to033()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.32',
    layers: [{
      type: 'text',
      text: {
        field: 'name',
        prefix: 'Sr.',
        suffix: 'Pica das Galáxias',      
      },      
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.33',
    layers: [{
      type: 'text',
      text: {
        field: 'name',
        prefix: {
          value: 'Sr.',
        },
        suffix: {
          value: 'Pica das Galáxias',      
        },
      },      
    }],
  })
})
