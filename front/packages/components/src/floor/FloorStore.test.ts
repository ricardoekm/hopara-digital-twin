import {FloorContext, FloorStore} from './FloorStore'
import {Floor} from './Floor'
import {Floors} from './Floors'

describe('updateCurrent', () => {
  test('should set first value if current is null', () => {
    let floors = new FloorStore()
    floors = floors.setDataFloors(Floors.fromStringArray(['0', '1']))
    floors = floors.updateCurrent()

    expect(floors.getCurrent()).toMatchObject({name: '0'})
  })
  
  test('should keep current if its inside the new values list', () => {
    let floors = new FloorStore()
    floors = floors.setCurrent(new Floor({name: '1'}))
    floors = floors.setDataFloors(Floors.fromStringArray(['0', '1']))
    floors = floors.updateCurrent()

    expect(floors.getCurrent()).toMatchObject({name: '1'})
  })

  it('should prioritize layer floors if current if not set', () => {
    let floors = new FloorStore()
    floors = floors.setVisualizationFloors(Floors.fromStringArray(['0', '1', '2']))
    floors = floors.setDataFloors(Floors.fromStringArray(['1']))
    floors = floors.updateCurrent()

    expect(floors.getCurrent()?.name).toEqual('1')
  })

  it('should change current if its not inside the new values list', () => {
    let floors = new FloorStore()
    floors = floors.setCurrent(new Floor({name: '3'}))
    floors = floors.setDataFloors(Floors.fromStringArray(['0', '1']))
    floors = floors.updateCurrent()

    expect(floors.getCurrent()?.name).toEqual('0')
  })
})

describe('getFloors', () => {
  it('should work with integer names', () => {
    let floors = new FloorStore()
    floors = floors.setVisualizationFloors(new Floors(new Floor({name: 0 as any})))
      .setContext(FloorContext.ALL)
    expect(floors.getFloors().toStringArray()).toEqual([0])
  })

  it('should be empty if nothing is set', () => {
    const floors = new FloorStore()
    expect(floors.getFloors().toStringArray()).toEqual([])
  })

  it('should return service floors if layer floor is emply', () => {
    const floors = new FloorStore()
      .setVisualizationFloors(Floors.fromStringArray(['2', '1']))
    expect(floors.getFloors().toStringArray()).toEqual(['2', '1'])
  })

  it('should get layer floors if context is layer', () => {
    const floors = new FloorStore()
      .setContext(FloorContext.LAYER)
      .setDataFloors(Floors.fromStringArray(['1', '2', '3']))
      .setVisualizationFloors(Floors.fromStringArray(['a', 'b', 'c']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '3'])
  })

  it('should never duplicate', () => {
    let floors = new FloorStore()
    floors = floors
      .setVisualizationFloors(Floors.fromStringArray(['0', '1', '2']))
      .setDataFloors(Floors.fromStringArray(['0', '1', '2']))
    expect(floors.getFloors().toStringArray()).toEqual(['0', '1', '2'])
  })

  it('should sort naturally layer floors', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['2', '11', 'A', '1']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '11', 'A'])
  })

  it('should put all service floors at the end if no service floors match with layer floor', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['1', '2']))
      .setVisualizationFloors(Floors.fromStringArray(['3', '4']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '3', '4'])
  })

  it('should merge into layer floors all service floors that match acronym', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['1', '2', '3']))
      .setVisualizationFloors(Floors.fromStringArray(['4', '3']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '3', '4'])
  })

  it('should sort all layer floors using service floors if all floors matches', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['1', '2']))
      .setVisualizationFloors(Floors.fromStringArray(['2', '1']))
    expect(floors.getFloors().toStringArray()).toEqual(['2', '1'])
  })

  it('should merge into layer floors all service floors that match acronym and put the rest at the end', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['2', '3', '4', '5']))
      .setVisualizationFloors(Floors.fromStringArray(['1', '2', '3', '4', '5', '6']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '3', '4', '5', '6'])
  })

  it('should merge into layer floors service floors at the end', () => {
    const floors = new FloorStore()
      .setDataFloors(Floors.fromStringArray(['1', '2']))
      .setVisualizationFloors(Floors.fromStringArray(['1', '2', '3', '4']))
    expect(floors.getFloors().toStringArray()).toEqual(['1', '2', '3', '4'])
  })
})


test('dont add repeated floors', () => {
  let floors = new FloorStore()
  floors = floors.setDataFloors(Floors.fromStringArray(['0', '1']))
  floors = floors.addDataFloor(new Floor({name: '0'}))
  floors = floors.addDataFloor(new Floor({name: '2'}))
  expect(floors.getFloors().toStringArray()).toEqual(['0', '1', '2'])
})
