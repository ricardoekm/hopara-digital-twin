import {SchemaMigration043to044} from './0.43-to-0.44.js'

test('migrate scale without domain to consistentOrdinal', () => {
  const migration = new SchemaMigration043to044()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.43',
    layers: [{
      encoding: {
        color: {
          field: 'device_type',
          scale: {
            type: 'ordinal',
            scheme: 'tableau20',
            reverse: false,
          },
          opacity: 1,
          value: '#ffbf79',
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.44',
    layers: [{
      encoding: {
        color: {
          field: 'device_type',
          scale: {
            type: 'consistentOrdinal',
            scheme: 'tableau20',
            reverse: false,
          },
          opacity: 1,
          value: '#ffbf79',
        },
      },
    }],
  })
})
