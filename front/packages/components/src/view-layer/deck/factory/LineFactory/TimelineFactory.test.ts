import { Row, Rows } from '@hopara/dataset'
import { getTimelineData } from './TimelineFactory'
import { RowCoordinates } from '@hopara/spatial'

describe('TimelineFactory', () => {
  it('should create a simple timeline', () => {
    const timeline = getTimelineData(new Rows(), 10, true)
    expect(timeline).toEqual({ durationMs: 0, timestampFn: expect.any(Function) })
  })

  it('should create a timeline with data geo', () => {
    const testRow = new Row({_coordinates: RowCoordinates.fromGeometry([[0, 0], [0.001, 0.001], [0.002, 0.002]])})
    const data = new Rows(new Row({_coordinates: RowCoordinates.fromGeometry([[0, 0], [0.002, 0.002], [0.003, 0.003]])}), testRow)
    const timeline = getTimelineData(data, 10, true)

    expect(timeline).toEqual({ durationMs: 47176.077149850025, timestampFn: expect.any(Function) })
    expect(timeline.timestampFn(testRow)).toEqual([[0, 15725.35905314349], [15725.35905314349, 31450.718103891864]])
  })

  it('should create a timeline with data not geo', () => {
    const testRow = new Row({_coordinates: RowCoordinates.fromGeometry([[0, 0], [0.001, 0.001], [0.002, 0.002]])})
    const data = new Rows(new Row({_coordinates: RowCoordinates.fromGeometry([[0, 0], [0.002, 0.002], [0.003, 0.003]])}), testRow)
    const timeline = getTimelineData(data, 10, false)

    expect(timeline).toEqual({ durationMs: 424.2640687119285, timestampFn: expect.any(Function) })
    expect(timeline.timestampFn(testRow)).toEqual([[0, 141.4213562373095], [141.4213562373095, 282.842712474619]])
  })

  it('should not explode if the row doesn\'t have any coordinates', () => {
    const data = new Rows(new Row({_coordinates: RowCoordinates.fromArray([0, 0])}))
    const timeline = getTimelineData(data, 10, false)

    expect(timeline).toEqual({ durationMs: 0, timestampFn: expect.any(Function) })
  })
})
