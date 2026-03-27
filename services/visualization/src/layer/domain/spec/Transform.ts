import { CoordinatesPositionEncoding } from '../../../encoding/domain/spec/PositionEncoding.js'
import { SizeEncoding } from '../../../encoding/domain/spec/SizeEncoding.js'

export enum TransformType {
  cluster = 'cluster',
  roomCluster = 'roomCluster',
  unit = 'unit',
  neighborCount = 'neighborCount',
  place = 'place',
  placeAround = 'placeAround',
  groupBy = 'groupBy'
}

interface BaseTransform<TType extends TransformType> {
  type: TType
}

interface ClusterTransform extends BaseTransform<TransformType.cluster> {
  radius: number
}

interface NeighborCountTransform extends BaseTransform<TransformType.neighborCount> {
  radius: number
}

interface GroupByTransform extends BaseTransform<TransformType.groupBy> {
  fields: string[]
}

interface RoomClusterTransform extends BaseTransform<TransformType.roomCluster> {
  cellSize?: number
  roomCoordinates?: CoordinatesPositionEncoding
  itemGroup?: {
    field: string
  },
  floor?: {
    field: string
  }
}

enum SortOder {
  ASC = 'ASC',
  DESC = 'DESC'
}

interface UnitTransform extends BaseTransform<TransformType.unit> {
  group: {
    field: string
    limit?: number
  }
  sort?: {
    field: string
    order?: SortOder
  }
}

interface PlaceTransform extends BaseTransform<TransformType.place> {
  padding?: number
  zoom?: number
}

interface PlaceAroundTransform extends BaseTransform<TransformType.placeAround> {
  parentId: {
    field: string
  },
  spacing?: SizeEncoding
  row?: {
    minSize: SizeEncoding
  }
}

export type Transform = ClusterTransform | RoomClusterTransform | UnitTransform | NeighborCountTransform 
                        | PlaceTransform | GroupByTransform | PlaceAroundTransform
