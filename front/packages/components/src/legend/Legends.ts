import { Legend } from './Legend'

export class Legends extends Array<Legend> {
  move(index: number, number: number) {
    const item = this[index]
    this.splice(index, 1)
    this.splice(index + number, 0, item)
    return this
  }

  hasLegend(layerId:string) {
    return this.some((legend:Legend) => legend.layer === layerId)
  }

  removeFromLayerId(layerId: string) {
    return new Legends(...this.filter((l) => l.layer !== layerId))
  }
}
