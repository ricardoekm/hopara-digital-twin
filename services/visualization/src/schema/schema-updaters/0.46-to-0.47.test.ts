import {SchemaMigration046to047} from './0.46-to-0.47.js'

test('migrate config to compose layer if it has unit', () => {
  const migration = new SchemaMigration046to047()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.46',
    type: 'GEO',
    mapStyle: 'light-street',
    layers: [{
      type: 'composite',
      encoding: {
        size: {
          multiplier: 2,
        },
      },
      children: [{
        type: 'text',
      }, {
        type: 'text',
        encoding: {},
      }, {
        type: 'circle',
        encoding: {
          config: {
            unit: 'pixels',
          },
        },
      }, {
        type: 'icon',
        encoding: {
          config: {
            maxResizeZoom: 5,
          },
        },
      }],
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.47',
    type: 'GEO',
    mapStyle: 'light-street', // will keep for backwards compatibility, delete later on
    layers: [{
      type: 'composite',
      encoding: {
        config: {
          unit: 'pixels',
        },
        size: {
          multiplier: 2,
        },
      },
      children: [{
        type: 'text',
      }, {
        type: 'text',
        encoding: {},
      }, {
        type: 'circle',
        encoding: {},
      }, {
        type: 'icon',
        encoding: {},
      }],
    }],
  })
})

test('migrate config to compose layer if it has maxResizeZoom', () => {
  const migration = new SchemaMigration046to047()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.46',
    type: 'GEO',
    mapStyle: 'light-street',
    layers: [{
      type: 'composite',
      children: [{
        type: 'text',
      }, {
        type: 'text',
        encoding: {},
      }, {
        type: 'circle',
        encoding: {
          color: {
            value: 'red',
          },
          config: {
            maxResizeZoom: 10,
          },
        },
      }, {
        type: 'icon',
        encoding: {
          config: {
            maxResizeZoom: 5,
          },
        },
      }],
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.47',
    type: 'GEO',
    mapStyle: 'light-street', // will keep for backwards compatibility, delete later on
    layers: [{
      type: 'composite',
      encoding: {
        config: {
          maxResizeZoom: 10,
        },
      },
      children: [{
        type: 'text',
      }, {
        type: 'text',
        encoding: {},
      }, {
        type: 'circle',
        encoding: {
          color: {
            value: 'red',
          },
        },
      }, {
        type: 'icon',
        encoding: {},
      }],
    }],
  })
})
