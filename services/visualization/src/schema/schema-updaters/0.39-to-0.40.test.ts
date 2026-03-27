import {SchemaMigration039to040} from './0.39-to-0.40.js'

test('migrate resize values', () => {
  const migration = new SchemaMigration039to040()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.39',
    layers: [{
      type: 'circle',
      encoding: {
        size: {
          value: 10,
          units: 'pixels',
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        size: {
          value: 10,
          resize: {
            referenceZoom: 5,
          },
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        size: {
          value: 10,
          resize: {
            referenceZoom: 5,
            maxZoom: 10,
          },
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        strokeSize: {
          value: 10,
          resize: {
            referenceZoom: 5,
            maxZoom: 10,
          },
        },
      },
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.40',
    layers: [{
      type: 'circle',
      encoding: {
        size: {
          value: 10,
        },
        config: {
          units: 'pixels',
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        size: {
          value: 0.3125,
        },
        config: {
          units: 'common',
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        size: {
          value: 0.3125,
        },
        config: {
          units: 'common',
          maxResizeZoom: 10,
        },
      },
    },
    {
      type: 'circle',
      encoding: {
        strokeSize: {
          value: 0.3125,
        },
        config: {
          units: 'common',
          maxResizeZoom: 10,
        },
      },
    }],
  })
})

