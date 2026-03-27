import {SchemaMigration047to048} from './0.47-to-0.48.js'

test('migrate domain to values, range to colors and scale names', () => {
  const migration = new SchemaMigration047to048()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.47',
    layers: [{
      encoding: {
        color: {
          field: 'alert_level',
          scale: {
            type: 'ordinal',
            range: [
              '#2d9cf0',
              '#545454',
              '#ffffff',
            ],
            domain: [
              0,
              1,
              2,
            ],
          },
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.48',
    layers: [{
      encoding: {
        color: {
          field: 'alert_level',
          scale: {
            type: 'sorted',
            colors: [
              '#2d9cf0',
              '#545454',
              '#ffffff',
            ],
            values: [
              0,
              1,
              2,
            ],
          },
        },
      },
    }],
  })
})

test('migrate stroke color domain to values, range to colors and scale names', () => {
  const migration = new SchemaMigration047to048()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.47',
    layers: [{
      encoding: {
        strokeColor: {
          field: 'alert_level',
          scale: {
            type: 'ordinal',
            range: [
              '#2d9cf0',
              '#545454',
              '#ffffff',
            ],
            domain: [
              0,
              1,
              2,
            ],
          },
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.48',
    layers: [{
      encoding: {
        strokeColor: {
          field: 'alert_level',
          scale: {
            type: 'sorted',
            colors: [
              '#2d9cf0',
              '#545454',
              '#ffffff',
            ],
            values: [
              0,
              1,
              2,
            ],
          },
        },
      },
    }],
  })
})

test('delete map attribute', () => {
  const migration = new SchemaMigration047to048()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.47',
    type: 'GEO',
    mapStyle: 'light-street',
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.48',
    type: 'GEO',
  })
})

test('migrate reverse to inside test', () => {
  const migration = new SchemaMigration047to048()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.47',
    layers: [{
      encoding: {
        color: {
          conditions: [
            {
              test: {
                field: 'isActivated',
              },
              reverse: true,
              value: '#cccccc',
            },
          ],
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.48',
    layers: [{
      encoding: {
        color: {
          conditions: [
            {
              test: {
                field: 'isActivated',
                reverse: true,
              },
              value: '#cccccc',
            },
          ],
        },
      },
    }],
  })
})

test('migrate reverse to inside test animation', () => {
  const migration = new SchemaMigration047to048()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.47',
    layers: [{
      encoding: {
        size: {
          animation: {
            condition: {
              test: {
                field: 'alert_level',
              },
              reverse: true,
            },
          },
        },
      },
    }],
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.48',
    layers: [{
      encoding: {
        size: {
          animation: {
            condition: {
              test: {
                field: 'alert_level',
                reverse: true,
              },
            },
          },
        },
      },
    }],
  })
})
