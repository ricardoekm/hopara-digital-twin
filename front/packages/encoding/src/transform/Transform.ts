export enum TransformType {
  cluster = 'cluster',
  roomCluster = 'roomCluster',
  unit = 'unit',
  neighborCount = 'neighborCount',
  place = 'place',
  placeAround = 'placeAround',
  groupBy = 'groupBy'
}

export interface Transform {
  type: TransformType
  getParams() : Object
  isRowProcessing() : boolean
  isRowPlacing() : boolean

  // We don't need to fetch two rowsets if the transform is front end only
  isFrontOnly() : boolean
  isFetchable() : boolean
  isZoomBased() : boolean
}
