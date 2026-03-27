import {DeckLayer} from '../../DeckLayer'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { GeoJsonFactory } from './GeoJsonFactory'
import { GeometryFactory } from './GeometryFactory'
import { BaseFactory } from '../BaseFactory'

const geometryFactory = new GeometryFactory()
const geoJsonFactory = new GeoJsonFactory()

export class PolygonFactory extends BaseFactory<DeckLayerProps> {
  getPositionField(props:DeckLayerProps) : string {
    return props.encoding.position?.coordinates?.field as string
  }

  getFactory(props: DeckLayerProps) {
    const isGeoJson = props.encoding.polygon?.isGeoJson()
    if (isGeoJson) {
      return geoJsonFactory
    } else {
      return geometryFactory
    }
  }

  create(props: DeckLayerProps): DeckLayer[] {
    return this.getFactory(props).create(props)
  }
}
