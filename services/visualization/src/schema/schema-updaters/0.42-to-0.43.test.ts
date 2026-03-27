import {SchemaMigration042to043} from './0.42-to-0.43.js'

test('migrate room cluster', () => {
  const migration = new SchemaMigration042to043()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.42',
    layers: [{
      data: {
        source: 'realtime',
        query: 'labs_assets_room',
        transform: {
          type: 'roomCluster',
          cellSize: 30,
          coordinates: {
            field: 'coordinates',
          },
          group: {
            field: 'type',
          },
        },
      },
      encoding: {
        position: {
          x: {
            field: 'coordinates',
          },
          y: {
            field: 'coordinates',
          },
          floor: {
            field: 'floor',
          },
          scope: 'GEO',
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.43',
    layers: [{
      data: {
        source: 'realtime',
        query: 'labs_assets_room',
        transform: {
          type: 'roomCluster',
          cellSize: 30,
          roomCoordinates: {
            field: 'coordinates',
          },
          itemGroup: {
            field: 'type',
          },
        },
      },
      encoding: {
        position: {
          x: {
            field: 'room_coordinates',
          },
          y: {
            field: 'room_coordinates',
          },
          floor: {
            field: 'floor',
          },
          scope: 'GEO',
        },
      },
    }],
  })
})
