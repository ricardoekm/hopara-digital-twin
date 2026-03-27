import {SchemaMigration041to042} from './0.41-to-0.42.js'

test('migrate zoom action', () => {
  const migration = new SchemaMigration041to042()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.41',
    layers: [{
      type: 'circle',
      actions: [{
        title: 'Go to location',
        zoom: {
          relative: {
            increment: 1.5,
            bounds: {
              field: 'location',
              padding: 15,
            },
          },
          fixed: {
            value: 10,
          },
        },
        type: 'ZOOM_JUMP',
      }],
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.42',
    layers: [{
      type: 'circle',
      actions: [{
        title: 'Go to location',
        zoom: {
          field: 'location',
          padding: 15,
          value: 10,
          increment: 1.5,
        },
        type: 'ZOOM_JUMP',
      }],
    }],
  })
})

test('migrate zoom range', () => {
  const migration = new SchemaMigration041to042()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.41',
    zoomRange: {
      min: {
        fixed: {
          value: 0,
        },
      },
      max: {
        fixed: {
          value: 24,
        },
      },
    },
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.42',
    zoomRange: {
      min: {
        value: 0,
      },
      max: {
        value: 24,
      },
    },
  })
})
