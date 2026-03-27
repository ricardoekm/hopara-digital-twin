export class Range {
  min?: number
  max?: number

  constructor({min, max}: {min?:number, max?:number} = {}) {
    this.min = min
    this.max = max
  }

  hasValues(): boolean {
    return this.min !== undefined || this.max !== undefined
  }

  getInterval(): number {
    return Math.abs(this.getMax() - this.getMin())
  }

  getCount(): number {
    return (this.getMax() - this.getMin()) + 1
  }

  multiply(multiplier:number): Range {
    const intervalDelta = (this.getInterval() * multiplier) - this.getInterval()
    return new Range({
      min: this.getMin() - (intervalDelta / 2),
      max: this.getMax() + (intervalDelta / 2),
    })
  }

  getMin():number {
    if (this.min === undefined) return Number.MIN_SAFE_INTEGER
    return this.min
  }

  getMax():number {
    if (this.max === undefined) return Number.MAX_SAFE_INTEGER
    return this.max
  }

  isInRange(value?:number) : boolean {
    if (value === undefined) return false
    return value >= this.getMin() && value < this.getMax()
  }

  toPlain(): number[] {
    return [this.getMin(), this.getMax()]
  }

  getCenter(): number {
    return (this.getMin() + this.getMax()) / 2
  }

  clamp(range: Range) {
    let min = this.getMin()
    if (min < range.getMin()) {
      min = range.min!
    }

    let max = this.getMax()
    if (max > range.getMax()) {
      max = range.max!
    }

    return new Range({min, max})
  }
}
