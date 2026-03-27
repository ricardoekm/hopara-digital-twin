import { ZoomValue } from './ZoomValue'

export class ZoomRange {
  min?: ZoomValue
  max?: ZoomValue

  constructor(props?: Partial<ZoomRange>) {
    Object.assign(this, props)
  }

  getMin(): number {
    if (this.min?.value === undefined) return 0
    return this.min.value
  }

  getMax(): number {
    if (this.max?.value === undefined) return 24
    return this.max.value
  }

  getMaxVisible(): number {
    return this.getMax() - 0.01
  }

  getInterval(): number {
    return this.getMax() - this.getMin()
  }

  multiply(multiplier:number): ZoomRange {
    const intervalDelta = (this.getInterval() * multiplier) - this.getInterval()
    return new ZoomRange({
      min: {
        ...this.min,
        value: this.getMin() - (intervalDelta / 2),
      },
      max: {
        ...this.max,
        value: this.getMax() + (intervalDelta / 2),
      },
    })
  }

  isInRange(value?:number) : boolean {
    if (value === undefined) return false
    return value >= this.getMin() && value < this.getMax()
  }
}
