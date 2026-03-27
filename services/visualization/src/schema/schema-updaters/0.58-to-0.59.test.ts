import {SchemaMigration058to059} from './0.58-to-0.59.js'

test('Migrate autoTrigger to trigger', () => {
  const migration = new SchemaMigration058to059()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.58',
    layers: [
      {
        actions: [
          {
            title: 'Zoom',
            autoTrigger: true
          },
          {
            title: 'Jump',
            autoTrigger: false
          }
        ]
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.59',
    layers: [
      {
        actions: [
          {
            title: 'Zoom',
            autoTrigger: true,
            trigger: 'OBJECT_CLICK'
          },
          {
            title: 'Jump',
            autoTrigger: false
          }
        ]
      }
    ]})
})
