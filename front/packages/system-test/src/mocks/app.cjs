const base = {
  visualization: {},
  history: [],
  queries: [
    {
      name: 'queryName',
      dataSource: 'hopara',
      columns: [
        {
          hidden: false,
          key: false,
          name: 'longitude',
          numeric: false,
          searchable: false,
          type: 'DECIMAL',
          stats: {
            min: -71.159589,
            max: -71.078011,
            percentiles: [-71.159589, -71.078011],
          },
        },
        {
          hidden: false,
          key: false,
          name: 'latitude',
          numeric: false,
          searchable: false,
          type: 'DECIMAL',
          stats: {
            min: 42.3557323,
            max: 42.4018613,
            percentiles: [42.3557323, 42.4018613],
          },
        },
        {hidden: false, key: false, name: 'type', numeric: false, searchable: false, type: 'STRING'},
        {
          hidden: false,
          key: false,
          name: 'value',
          numeric: false,
          searchable: false,
          type: 'INTEGER',
          stats: {min: 0, max: 5, percentiles: [0, 1, 5]},
        },
        {hidden: false, key: false, name: '_marker_longitude', numeric: false, searchable: false, type: 'STRING'},
        {hidden: false, key: false, name: '_marker_latitude', numeric: false, searchable: false, type: 'STRING'},
        {
          hidden: false,
          key: false,
          name: 'timestamp',
          numeric: false,
          searchable: false,
          type: 'DATETIME',
          stats: {
            min: 1586177239,
            max: 1591472241,
            percentiles: [1586177239, 1591472241],
          },
        },
        {
          hidden: false,
          key: false,
          name: 'value',
          numeric: false,
          searchable: false,
          type: 'DECIMAL',
          stats: {
            min: 0,
            max: 12400009,
            percentiles: [0, 12400009],
          },
        },
        {
          hidden: false,
          key: false,
          name: 'location',
          numeric: false,
          searchable: false,
          type: 'GEOMETRY',
          stats: undefined,
        },
        {
          hidden: false,
          key: false,
          name: '_geo_json',
          numeric: false,
          searchable: false,
          type: 'STRING',
          stats: undefined,
        },
      ],
    },
  ],
}

const baseGEO = {
  ...base,
  visualization: {
    ...base.visualization,
    name: 'GEO App',
    id: '0',
    type: 'GEO',
    zoomRange: {
      min: {fixed: {value: 8}},
      max: {fixed: {value: 17}},
    },
    filters: [],
    initialPosition: {
      x: -71.1426267,
      y: 42.3785379,
      zoom: 13,
    },
  },
}

const baseCHART = {
  ...base,
  visualization: {
    ...base.app,
    name: 'Graph App',
    id: '0',
    type: 'CHART',
    zoomBehavior: {
      x: 'SCALE',
      y: 'SCALE',
    },
    filters: [],
  },
}

const circleApp = {
  ...baseGEO,
  visualization: {
    ...baseGEO.visualization,
    id: 'circle',
    layers: [
      {
        name: 'Circle Layer',
        id: 'circle-layer',
        data: {source: 'hopara', query: 'queryName'},
        type: 'Circle',
        actions: [],
        visible: {
          value: true,
        },
        encoding: {
          color: {value: '#1f78b4'},
          size: {value: 20},
          position: {
            x: {
              field: 'longitude',
              scale: {type: 'linear'},
            },
            y: {
              field: 'latitude',
              scale: {type: 'linear'},
            },
          },
        },
      },
    ],
  },
}

const circleWithEntitiesApp = {
  ...circleApp,
  visualization: {
    ...circleApp.visualization,
    entities: [
      {
        id: 'entity-1',
        layer: 'circle-layer',
        icon: 'sensor',
        name: 'query name',
        data: {source: 'hopara', query: 'queryName'},
      },
    ],
  },
}

const polygonApp = {
  ...baseGEO,
  visualization: {
    ...baseGEO.visualization,
    id: 'polygon',
    layers: [
      {
        name: 'Polygon Layer',
        id: 'polygon-layer',
        type: 'Polygon',
        data: {source: 'hopara', query: 'queryName'},
        visible: {
          value: true,
        },
        encoding: {
          polygon: {contentType: 'geo-json'},
          color: {value: '#1f78b4'},
          line: {width: 1, color: '#3690C0'},
          position: {
            coordinates: {
              field: '_geo_json',
            },
          },
        },
      },
    ],
  },
}

const iconApp = {
  ...baseGEO,
  visualization: {
    ...baseGEO.visualization,
    id: 'icon',
    layers: [
      {
        name: 'Icon Layer',
        id: 'icon-layer',
        type: 'Icon',
        data: {source: 'hopara', query: 'queryName'},
        visible: {
          value: true,
        },
        encoding: {
          size: {value: 40},
          color: {value: '#FF0000'},
          position: {
            x: {
              field: 'longitude',
              scale: {type: 'linear'},
            },
            y: {
              field: 'latitude',
              scale: {type: 'linear'},
            },
          },
        },
      },
    ],
  },
}

const bitmapApp = {
  ...baseGEO,
  visualization: {
    ...baseGEO.visualization,
    filters: [],
    id: '0',
    initialPosition: {
      y: -21.976796517596085,
      x: -46.723753705097195,
      zoom: 5.5,
    },
    layers: [{
      name: 'Floor',
      id: 'floor',
      data: {source: 'hopara', query: 'queryName'},
      type: 'image',
      visible: {
        value: true,
      },
      position: {
        coordinates: {
          field: '_bounds',
        },
      },
      encodings: {
        image: {field: '_image'},
      },
    }],
    type: 'GEO',
    zoomRange: {
      max: {fixed: {value: 22}},
      min: {fixed: {value: 0}},
    },
  },
  id: 'image',
  name: 'Image test',
}

const chartApp = {
  ...baseCHART,
  visualization: {
    ...baseCHART.visualization,
    id: 'chart',
    layers: [
      {
        name: 'Line',
        id: 'chart-layer',
        type: 'line',
        data: {source: 'hopara', query: 'queryName'},
        visible: {
          value: true,
        },
        encoding: {
          position: {
            x: {
              field: 'timestamp',
            },
            y: {
              field: 'value',
            },
          },
          size: {
            value: 2,
          },
        },
      },
    ],
  },
}

const tooltipApp = {
  ...circleApp,
  visualization: {
    ...circleApp.visualization,
    id: 'tooltip',
  },
}

module.exports = {
  circle: circleApp,
  circleWithEntities: circleWithEntitiesApp,
  polygon: polygonApp,
  icon: iconApp,
  bitmap: bitmapApp,
  chart: chartApp,
  tooltip: tooltipApp,
}
