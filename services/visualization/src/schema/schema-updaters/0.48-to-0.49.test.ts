import {SchemaMigration048to049} from './0.48-to-0.49.js'

test('add default group', () => {
  const migration = new SchemaMigration048to049()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.48'
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.49',
    group: 'USER'
  })
})
