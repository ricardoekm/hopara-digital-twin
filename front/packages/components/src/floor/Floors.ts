import { uniqBy } from 'lodash/fp'
import {Floor} from './Floor'

export class Floors extends Array<Floor> {
  constructor(...floors: any[]) {
    if (floors.length && typeof floors[0] === 'number') {
      super(floors[0])
    } else {
      super(...uniqBy('name', floors))
    }
  }

  clone(): Floors {
    return new Floors(...this)
  }

  findByName(name: string): Floor | undefined {
    return this.find((floor) => floor.name.toString() === name.toString())
  }

  findByAcronym(acronym: string): Floor | undefined {
    return this.find((floor) => floor.acronym.toString() === acronym.toString())
  }

  findIndexByName(name: string): number {
    return this.findIndex((floor) => floor.name.toString() === name.toString())
  }

  static fromStringArray(values?: string[]): Floors {
    return new Floors(...(values ?? []).map((value) => new Floor({name: value})))
  }

  toStringArray(): string[] {
    return this.map((floor) => floor.name)
  }

  getPrevious(floor: Floor): Floor | undefined {
    const index = this.findIndexByName(floor.name)
    if (index === 0) {
      return this[index]
    }
    return this[index - 1]
  }

  getNext(floor: Floor): Floor | undefined {
    const index = this.findIndexByName(floor.name)
    if (index === this.length - 1) {
      return this[index]
    }
    return this[index + 1]
  }

  immutableReverse() {
    return new Floors(...[...this].reverse())
  }
}
