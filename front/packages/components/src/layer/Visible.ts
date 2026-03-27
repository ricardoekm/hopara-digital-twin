 
import { Type } from 'class-transformer'
import { ZoomRange } from '../zoom/ZoomRange'
import { Condition } from '@hopara/encoding'
import { Exclude } from 'class-transformer'

export class Visible {
  value: boolean

  @Type(() => ZoomRange)
  zoomRange: ZoomRange

  condition?: Condition

  @Exclude()
  updatedTimestamp: Date

  constructor(props: Partial<Visible>) {
    Object.assign(this, props)
  }

  getZoomRange() {
    if (this.zoomRange) {
      return this.zoomRange
    }

    const min = {value: 0}
    const max = {value: 24 }
    return new ZoomRange({min, max})
  }

  resetUpdatedTimestamp() {
    this.updatedTimestamp = new Date()
  }

  getUpdatedTimestamp() {
    return this.updatedTimestamp?.getTime() ?? 0
  }
}
