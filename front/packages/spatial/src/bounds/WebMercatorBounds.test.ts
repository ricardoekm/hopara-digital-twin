import { createAnyGeometry } from './BaseBounds.test'
import { WebMercatorBounds } from './WebMercatorBounds'

const anyBounds = WebMercatorBounds.fromGeometry(createAnyGeometry({positionCount: 3}))

describe('WebMercatorBounds', () => {
  it('should create bounds from geometry', () => {
    const bounds = WebMercatorBounds.fromGeometry([
      [-43.18296850758833, -22.901808468518116],
      [-43.182724863495935, -22.901712902193662],
      [-43.18257481537256, -22.902037513770377],
      [-43.18281845983864, -22.902133079802837],
      [-43.18296850758833, -22.901808468518116],
  ])

  expect(bounds.toPolygon()).toEqual([
      [-43.1829685078381, -22.901808468469078],
      [-43.18272486337122, -22.90171290214476],
      [-43.18257481537256, -22.902037513770374],
      [-43.182818459761165, -22.902133079970394],
      [-43.1829685078381, -22.901808468469078],
    ])
  })

  it('should return a feature collection with just one item', () => {
    const featureCollection = anyBounds.toFeatureCollection()
    expect(featureCollection).toEqual({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [anyBounds.toPolygon()],
        },
      }],
    })
  })

  it('should return centroid', () => {
    const bounds = WebMercatorBounds.fromGeometry([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]])
    expect(bounds.getCentroid()).toEqual([5, 5])
  })

  it('should extrude angled rectangle using 3/1 ratio', () => {
    const bounds = WebMercatorBounds.fromGeometry([
      [-71.1087928851, 42.3566827933],
      [-71.1095294371, 42.3571005172],
      [-71.1088312042, 42.3577728053],
      [-71.1080946521, 42.3573550858],
      [-71.1087928851, 42.3566827933],
    ])

    const newBounds = bounds.extrudeGeometry(1500, 500)

    expect(newBounds.toPolygon()).toEqual([
      [-71.1090095325277, 42.35680565727273],
      [-71.10931279343805, 42.35697764807275],
      [-71.10861455689468, 42.35764994145083],
      [-71.1083112937481, 42.357477952162],
      [-71.1090095325277, 42.35680565727273],
    ])
  })

  it('should extrude not angled rect using 2/1 ratio', () => {
    const bounds = WebMercatorBounds.fromGeometry([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]])
    const newBounds = bounds.extrudeGeometry(4, 2)
    expect(newBounds.toPolygon()).toEqual([
      [-0.040656358662545244, 2.583639848526387],
      [0.04196503511218452, 7.568912767494672],
      [10.040800026780516, 7.417922153478411],
      [9.958193340402772, 2.4320729825694305],
      [-0.040656358662545244, 2.583639848526387],
    ])
  })
})
