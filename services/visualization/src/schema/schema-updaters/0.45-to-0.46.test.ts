import {SchemaMigration045to046} from './0.45-to-0.46.js'

test('migrate map to layer', () => {
  const migration = new SchemaMigration045to046()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.45',
    type: 'GEO',
    mapStyle: 'light-street',
    layers: [],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.46',
    type: 'GEO',
    mapStyle: 'light-street', // will keep for backwards compatibility, delete later on
    layers: [
      {
        id: 'map-layer-migration',
        name: 'Map',
        type: 'map',
        encoding: {
          map: {
            value: 'light-street',
          },
        },
      },
    ],
  })
})

test('ignore if has map layer', () => {
  const migration = new SchemaMigration045to046()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.45',
    type: 'GEO',
    mapStyle: 'light-street',
    layers: [
      {
        id: 'map-layer',
        name: 'Map',
        type: 'map',
        encoding: {
          map: {
            value: 'satellite',
          },
        },
      },
    ],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.46',
    type: 'GEO',
    mapStyle: 'light-street', // will keep for backwards compatibility, delete later on
    layers: [
      {
        id: 'map-layer',
        name: 'Map',
        type: 'map',
        encoding: {
          map: {
            value: 'satellite',
          },
        },
      },
    ],
  })
})
