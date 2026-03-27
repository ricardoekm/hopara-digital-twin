import { SchemaMigration056to057 } from './0.56-to-0.57.js'

test('migrate reference zoom to size and strokesize', () => {
  const migration = new SchemaMigration056to057()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.56',
    layers: [
      {
        encoding: {
          config: {
            referenceZoom: 4.5
          },
          size: {
            value: 1
          },
          strokeSize: {
            value: 2
          },
          offset: { 
            x: {
              value: 1
            },
            y: {
              value: 2
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.57',
    layers: [
      {
        encoding: {
          config: {
            referenceZoom: 4.5
          },
          size: {
            value: 1,
            referenceZoom: 4.5
          },
          strokeSize: {
            value: 2,
            referenceZoom: 4.5
          },
          offset: { 
            x: {
              value: 1,
              referenceZoom: 4.5
            },
            y: {
              value: 2,
              referenceZoom: 4.5
            }
          }
        }
      }
    ]
  })
})

test('migrate children', () => {
  const compositeLayer = {
    type: 'composite',
    encoding: {
      size: {
        field: 'hopara_size',
        multiplier: 0.4,
        referenceZoom: 4.5
      },
      config: {
        units: 'common',
        referenceZoom: 4.5
      }
    },
    children: [
      {
        encoding: {
          strokeSize: {
            value: 0
          },
          size: {
            field: 'hopara_size',
            value: 32.174112085544046
          }
        }
      }
    ]
  }

  const migration = new SchemaMigration056to057()
  const migratedViz = migration.migrate({
      $schema: 'https://schema.hopara.app/app/0.56',
      layers: [
        compositeLayer
  ]}) as any
  const childEncoding = migratedViz.layers[0].children[0].encoding
  expect(childEncoding.size.referenceZoom).toEqual(4.5)
  expect(childEncoding.strokeSize.referenceZoom).toEqual(4.5)
})
