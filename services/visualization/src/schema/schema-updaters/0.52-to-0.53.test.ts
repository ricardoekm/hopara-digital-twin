import {SchemaMigration052to053} from './0.52-to-0.53.js'

test('add managed position type', () => {
  const migration = new SchemaMigration052to053()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        encoding: {
          position: {
            data: {
              source: 'hopara',
              query: 'assets_sample_pos'
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        encoding: {
          position: {
            type: 'MANAGED',
            data: {
              source: 'hopara',
              query: 'assets_sample_pos'
            }
          }
        }
      }
    ]
  })
})

test('add custom position type', () => {
  const migration = new SchemaMigration052to053()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        encoding: {
          position: {
            data: {
              source: 'realtime',
              query: 'assets_locations'
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        encoding: {
          position: {
            type: 'CUSTOM',
            data: {
              source: 'realtime',
              query: 'assets_locations'
            }
          }
        }
      }
    ]
  })
})

test('add client position type', () => {
  const migration = new SchemaMigration052to053()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        encoding: {
          position: {
            x: {
              field: 'time'
            },
            y: {
              field: 'temperature'
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        encoding: {
          position: {
            type: 'CLIENT',
            x: {
              field: 'time'
            },
            y: {
              field: 'temperature'
            }
          }
        }
      }
    ]
  })
})

test('add client position type when the data is empty', () => {
  const migration = new SchemaMigration052to053()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        encoding: {
          position: {
            data: {},
            x: {
              field: 'time'
            },
            y: {
              field: 'temperature'
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        encoding: {
          position: {
            data: {},
            type: 'CLIENT',
            x: {
              field: 'time'
            },
            y: {
              field: 'temperature'
            }
          }
        }
      }
    ]
  })
})

test('add ref position type', () => {
  const migration = new SchemaMigration052to053()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.52',
    layers: [
      {
        encoding: {
          position: {
            data: {
              layerId: '123'
            }
          }
        }
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.53',
    layers: [
      {
        encoding: {
          position: {
            type: 'REF',
            data: {
              layerId: '123'
            }
          }
        }
      }
    ]
  })
})
