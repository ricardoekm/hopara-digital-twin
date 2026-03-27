import {SchemaMigration054to055} from './0.54-to-0.55.js'

test('migrate template format', () => {
  const migration = new SchemaMigration054to055()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.54',
    layers: [
      {
        encoding: {
          config: {
            units: 'common'
          },
          size: {
            value: 0.0003204345703125
          },
          offset: {
            x: {value: 0.0003509521484375},
            y: {value: 0.0003814697265625}
          },
          strokeSize: {
            range: [0.000457763671875, 0.0006103515625]
          }
        },
        visible: {
          zoomRange: {
            min: {
              value: 16
            },
            max: {
              value: 22
            }
          }
        },
      },
      {
        encoding: {
          config: {
            units: 'common'
          },
        },
        children: [
          {
            encoding: {
              size: {
                value: 0.00003814697265625
              },
            }
          }
        ],
        visible: {
          zoomRange: {
            min: {
              value: 20
            },
            max: {
              value: 22
            }
          }
        },
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.55',
    layers: [
      {
        encoding: {
          config: {
            units: 'common',
            referenceZoom: 16
          },
          size: {
            value: 21
          },
          offset: {
            x: {value: 23},
            y: {value: 25}
          },
          strokeSize: {
            range: [30, 40]
          }
        },
        visible: {
          zoomRange: {
            min: {
              value: 16
            },
            max: {
              value: 22
            }
          }
        }
      },
      {
        encoding: {
          config: {
            units: 'common',
            referenceZoom: 20,
          },
        },
        children: [
          {
            encoding: {
              size: {
                value: 40
              },
            }
          }
        ],
        visible: {
          zoomRange: {
            min: {
              value: 20
            },
            max: {
              value: 22
            }
          }
        },
      }]
  })
})

test('migrate template format', () => {
  const migration = new SchemaMigration054to055()
  const migratedViz = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.54',
    initialPosition: {
      zoom: 18
    },
    layers: [
      {
        encoding: {
          config: {
            units: 'common'
          },
          size: {
            value: 0.0003204345703125
          },
          offset: {
            x: {value: 0.0003509521484375},
            y: {value: 0.0003814697265625}
          },
          strokeSize: {
            range: [0.000457763671875, 0.0006103515625]
          }
        },
        visible: {
          zoomRange: {
            min: {
              value: 16
            },
            max: {
              value: 22
            }
          }
        },
      },
      {
        encoding: {
          config: {
            units: 'common'
          },
        },
        children: [
          {
            encoding: {
              size: {
                value: 0.00003814697265625
              },
            }
          }
        ],
        visible: {
          zoomRange: {
            min: {
              value: 20
            },
            max: {
              value: 22
            }
          }
        },
      }
    ]
  })

  expect(migratedViz).toEqual({
    $schema: 'https://schema.hopara.app/app/0.55',
    initialPosition: {
      zoom: 18
    },
    layers: [
      {
        encoding: {
          config: {
            units: 'common',
            referenceZoom: 18
          },
          size: {
            value: 84
          },
          offset: {
            x: {value: 92},
            y: {value: 100}
          },
          strokeSize: {
            range: [120, 160]
          }
        },
        visible: {
          zoomRange: {
            min: {
              value: 16
            },
            max: {
              value: 22
            }
          }
        }
      },
      {
        encoding: {
          config: {
            units: 'common',
            referenceZoom: 20,
          },
        },
        children: [
          {
            encoding: {
              size: {
                value: 40
              },
            }
          }
        ],
        visible: {
          zoomRange: {
            min: {
              value: 20
            },
            max: {
              value: 22
            }
          }
        },
      }]
  })
})
