import {isEmpty} from 'lodash'
import {Floor} from './Floor'
import {Floors} from './Floors'


export enum FloorContext {
  ALL = 'all',
  LAYER = 'layer'
}

export class FloorStore {
  dataFloors: Floors
  visualizationFloors: Floors
  selectedId?: string
  private context?: FloorContext
  private current?: Floor
  private changed?: boolean

  constructor(props?: Partial<FloorStore>) {
    Object.assign(this, props)

    if (isEmpty(this.visualizationFloors)) {
      this.visualizationFloors = new Floors()
    }
    if (isEmpty(this.dataFloors)) {
      this.dataFloors = new Floors()
    }
    this.dataFloors = new Floors(...this.dataFloors)
    this.visualizationFloors = new Floors(...this.visualizationFloors)
  }

  clone(): FloorStore {
    return new FloorStore({
      ...this,
      dataFloors: [...this.dataFloors],
      visualizationFloors: [...this.visualizationFloors],
    })
  }

  getFloors() {
    let sortedDataFloors = this.immutableSort(this.dataFloors)
    if (this.context === FloorContext.LAYER) return sortedDataFloors

    sortedDataFloors = this.sortByVisualizationFloors(sortedDataFloors, this.visualizationFloors)
    const firstDataFloor = sortedDataFloors[0]
    if (!firstDataFloor) return this.visualizationFloors

    const visualizationNotInDataFloors = this.visualizationFloors.filter((floor: Floor) => !sortedDataFloors.findByAcronym(floor.acronym))
    const indexOfFirst = this.visualizationFloors.findIndex((floor: Floor) => floor.equals(firstDataFloor))
    if (indexOfFirst > 0) {
      const first = this.visualizationFloors[indexOfFirst - 1]
      const index = 1 + visualizationNotInDataFloors.findIndex((floor: Floor) => floor.equals(first))
      return new Floors(...[
        ...visualizationNotInDataFloors.slice(0, index),
        ...sortedDataFloors,
        ...visualizationNotInDataFloors.slice(index),
      ])
    }
    return new Floors(...[
      ...sortedDataFloors,
      ...visualizationNotInDataFloors,
    ])
  }

  getDefaultFloor() {
    if (!isEmpty(this.dataFloors)) {
      // Quick fix to avoid underground floors to be the default
      if (this.dataFloors.findByName('0')) {
        return this.dataFloors.findByName('0')
      } else if (this.dataFloors.findByName('1')) {
        return this.dataFloors.findByName('1')
      }
      return this.dataFloors[0]
    } else if (this.context === FloorContext.ALL) {
      return this.visualizationFloors[0]
    }
  }

  updateCurrent(): FloorStore {
    if (isEmpty(this.getFloors())) {
      return this.setCurrent(undefined)
    }

    if (!this.current || !this.getFloors().findByName(this.current.name)) {
      return this.setCurrent(this.getDefaultFloor())
    }

    return this
  }

  hasChanged(): boolean {
    return !!this.changed
  }

  resetChanged() {
    const cloned = this.clone()
    cloned.changed = false
    return cloned
  }

  getCurrent(): Floor | undefined {
    return this.current
  }

  hasCurrent() : boolean {
    return !!this.current
  }

  setCurrent(floor?: Floor): FloorStore {
    const cloned = this.clone()

    // We'll ignore changes to undefined (e.g. zoom out)
    if (!floor?.name) {
      cloned.changed = false
    } else if (floor?.name !== this.current?.name) {
      cloned.changed = true
    }

    cloned.current = floor
    return cloned
  }

  setSelected(id?: string): FloorStore {
    const cloned = this.clone()
    cloned.selectedId = id
    return cloned
  }

  add() {
    const cloned = this.clone()
    const floor = new Floor({})
    cloned.visualizationFloors.push(floor)
    cloned.selectedId = floor.id
    return cloned
  }

  delete(id: string) {
    const cloned = this.clone()
    const index = cloned.visualizationFloors.findIndex((floor: Floor) => floor.id === id)
    if (index !== -1) {
      cloned.visualizationFloors.splice(index, 1)
    }
    return cloned
  }

  reorder(sourceIndex: number, destinationIndex: number) {
    const cloned = this.clone()
    const [removed] = cloned.visualizationFloors.splice(sourceIndex, 1)
    cloned.visualizationFloors.splice(destinationIndex, 0, removed)
    return cloned
  }

  changeName(id: string, name: string) {
    const cloned = this.clone()
    cloned.visualizationFloors = cloned.visualizationFloors.clone()
    const floor = cloned.visualizationFloors.find((floor: Floor) => floor.id === id)
    if (floor) {
      floor.setName(name)
    }
    return cloned
  }

  immutableSort(floors: Floors) {
    return new Floors(...floors.sort((a, b) => a.compare(b)))
  }

  private sortByVisualizationFloors(floors: Floors, visualizationFloors: Floors) {
    const clonedFloors = [...floors]

    clonedFloors.sort((a: Floor, b: Floor) => {
      const indexA = visualizationFloors.findIndex((floor: Floor) => floor.name === a.name)
      const indexB = visualizationFloors.findIndex((floor: Floor) => floor.name === b.name)
      return indexA - indexB
    })

    return new Floors(...clonedFloors)
  }

  setDataFloors(floors: Floors) {
    const cloned = this.clone()
    cloned.dataFloors = floors
    return cloned
  }

  addDataFloor(floor:Floor) {
    const cloned = this.clone()
    if (!cloned.dataFloors.findByAcronym(floor.acronym)) {
      cloned.dataFloors.push(floor)
    }
    return cloned
  }

  setVisualizationFloors(floors: Floors) {
    const cloned = this.clone()
    cloned.visualizationFloors = floors
    return cloned
  }

  setContext(context: FloorContext) {
    const cloned = this.clone()
    cloned.context = context
    return cloned
  }
}
