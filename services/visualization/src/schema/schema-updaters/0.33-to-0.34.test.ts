import {SchemaMigration033to034} from './0.33-to-0.34.js'

test('migrate transform to data', () => {
  const migration = new SchemaMigration033to034()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.33',
    layers: [{
      transform: {
        neighborCount: {
          radius: 30,
        },
      },
      data: {
        source: 'timescale',
        query: 'facility_overview',
      },     
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.34',
    layers: [{
      data: {
        source: 'timescale',
        query: 'facility_overview',
        transform: {
          type: 'neighborCount',
          radius: 30,
        },
      },      
    }],
  })
})

test('if has empty transform dont migrate', () => {
  const migration = new SchemaMigration033to034()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.33',
    layers: [{
      transform: {},
      data: {
        source: 'timescale',
        query: 'facility_overview',
      },     
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.34',
    layers: [{
      data: {
        source: 'timescale',
        query: 'facility_overview',
      },      
    }],
  })
})
