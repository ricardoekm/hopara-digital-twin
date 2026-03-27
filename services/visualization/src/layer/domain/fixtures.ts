import {ActionType} from './spec/Action.js'
import {ZoomRange} from './spec/ZoomRange.js'

export const anyActions = [{
  id: '48e02bbc-5396-40b7-8c30-ce470a7ad0c7',
  type: ActionType.EXTERNAL_LINK_JUMP,
  href: 'https://www.google.com',
  title: 'Google',
}]

export const anyData = {
  source: 'any source',
  query: 'any query',
}

export const anyTransform = {
  cluster: {
    radius: 10,
  },
}

export const anyDetails = {
  tooltip: false,
}

export const anyColorEncoding = {
  value: 'red',
}

export const anyTextEncoding = {
  field: 'name',
}

export const anyOffsetEncoding = {
  x: {
    value: 10,
  },
  y: {
    value: 20,
  },
}

export const anySizeEncoding = {
  value: 30,
}

export const anyPositionEncoding = {
  x: {
    field: 'x',
  },
  y: {
    field: 'y',
  },
}

export const anyVisible = {
  value: true,
  zoomRange: {
    min: {value: 0},
    max: {value: 20},
  } as ZoomRange,
}

export const expectUuid = expect.stringMatching(/^[\w-]+$/)
