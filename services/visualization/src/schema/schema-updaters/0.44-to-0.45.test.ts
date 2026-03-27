import {SchemaMigration044to045} from './0.44-to-0.45.js'

test('migrate should remove initial position from chart viz', () => {
  const migration = new SchemaMigration044to045()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.44',
    type: 'CHART',
    initialPosition: {
      x: 10,
      y: 20,
    },
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.45',
    type: 'CHART',
  })
})

test('migrate should keep initial position if is not chart viz', () => {
  const migration = new SchemaMigration044to045()
  const vizToMigrate = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.44',
    type: 'GEO',
    initialPosition: {
      x: 10,
      y: 20,
    },
  })

  expect(vizToMigrate).toEqual({
    $schema: 'https://schema.hopara.app/app/0.45',
    type: 'GEO',
    initialPosition: {
      x: 10,
      y: 20,
    },
  })
})
