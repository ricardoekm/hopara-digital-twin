import { Coordinates } from '@hopara/spatial'

export function getUserLocationPlainLayer(coordinates:Coordinates, accuracy: number) : any {
  const pinPlainLayer = {
    id: 'user-location',
    name: 'User Location',
    type: 'circle',
    encoding: {
      color: {
        opacity: 1,
        value: '#0D8EF1',
      },
      strokeColor: {
        opacity: 1,
        value: '#FFFFFF',
      },
      strokeSize: {
        value: 4,
      },
      size: {
        value: 18,
      },
      position: {
        x: {
          value: coordinates.x,
        },
        y: {
          value: coordinates.y,
        },
        type: 'MANAGED',
        data: {
          source: 'hopara',
          query: 'user_location',
        },
      },
      shadow: {
        inner: false,
        outer: true,
      },
    },
    data: {
      source: 'hopara',
      query: 'user_location',
    },
    actions: [],
    visible: {
      value: true,
      zoomRange: {
        min: {
          value: 0,
        },
        max: {
          value: 24,
        },
      },
    },
  }

  const accuracyPlainLayer = {
    id: 'user-location-accuracy',
    name: 'User Location Accuracy',
    type: 'circle',
    encoding: {
      color: {
        opacity: 0.15,
        value: '#0D8EF1',
      },
      size: {
        value: accuracy * 2, // we use size as diameters
      },
      position: {
        x: {
          value: coordinates.x,
        },
        y: {
          value: coordinates.y,
        },
        type: 'MANAGED',
        data: {
          source: 'hopara',
          query: 'user_location',
        },
      },
      config: {
        units: 'meters',
      },
    },
    data: {
      source: 'hopara',
      query: 'user_location',
    },
    actions: [],
    visible: {
      value: true,
      zoomRange: {
        min: {
          value: 0,
        },
        max: {
          value: 24,
        },
      },
    },
  }

  return [pinPlainLayer, accuracyPlainLayer]
}
