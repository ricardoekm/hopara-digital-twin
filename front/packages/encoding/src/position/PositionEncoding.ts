import { BaseEncoding } from '../BaseEncoding'
import { isNil } from 'lodash/fp'
import { Data } from '../data/Data'
import { DataRef } from '../data/DataRef'
import { Transform } from 'class-transformer'
import { plainToData } from '../data/DataFactory'
import { Anchor } from '@hopara/spatial'

export interface AxisPositionEncoding {
  value?: number
  field?: string
}

export interface CoordinatesPositionEncoding {
  field?: string
}

export interface FloorPositionEncoding {
  field: string
}

export enum PositionType {
  MANAGED = 'MANAGED',
  CUSTOM = 'CUSTOM',
  CLIENT = 'CLIENT',
  FIXED = 'FIXED',
  REF = 'REF'
}

export class PositionEncoding extends BaseEncoding<PositionEncoding> {
  x?: AxisPositionEncoding
  x2?: AxisPositionEncoding
  y?: AxisPositionEncoding
  y2?: AxisPositionEncoding
  z?: AxisPositionEncoding
  coordinates?: CoordinatesPositionEncoding
  detailedCoordinates?: CoordinatesPositionEncoding
  floor?: FloorPositionEncoding
  scope?: string
  anchor?: Anchor
  type: PositionType

  @Transform(plainToData, { toClassOnly: true })
  data?: Data | DataRef

  constructor(props?: Partial<PositionEncoding>) {
    super()
    Object.assign(this, props)
  }

  isDataRef() : boolean {
    return this.data instanceof DataRef
  }

  getFields() : string[] {
    const fields:string[] = []

    if (this.x?.field) fields.push(this.x.field)
    if (this.x2?.field) fields.push(this.x2.field)
    if (this.y?.field) fields.push(this.y.field)
    if (this.y2?.field) fields.push(this.y2.field)
    if (this.z?.field) fields.push(this.z.field)
    if (this.coordinates?.field) fields.push(this.coordinates.field)

    return fields
  }

  getX() : AxisPositionEncoding | undefined {
    return this.x
  }

  getX2() : AxisPositionEncoding | undefined {
    return this.x2
  }

  getY() : AxisPositionEncoding | undefined {
    return this.y
  }

  getY2() : AxisPositionEncoding | undefined {
    return this.y
  }

  getZ() : AxisPositionEncoding | undefined {
    return this.z
  }

  getFloor(): FloorPositionEncoding | undefined {
    return this.floor
  }

  hasFloor() : boolean {
    return !!this.floor
  }

  isOfType(type: PositionType) : boolean {
    return this.getType() === type
  }

  getType() : PositionType {
    return this.type
  }

  get(axis:string) : AxisPositionEncoding | undefined {
    if (axis === 'x') {
      return this.getX()
    } else if (axis === 'y') {
      return this.getY()
    } else if (axis === 'z') {
      return this.getZ()
    } else if (axis === 'floor') {
      return this.getFloor()
    }
  }

  hasCoordinates(): boolean {
    return !!this.coordinates
  }

  hasFirstAxis() : boolean {
    return !!(this.x?.field || !isNil(this.x?.value) || this.y2?.field || !isNil(this.y2?.value))
  }

  hasSecondAxis() : boolean {
    return !!(this.y?.field || !isNil(this.y?.value) || this.x2?.field || !isNil(this.x2?.value))
  }

  hasOneAxis() : boolean {
    return this.hasFirstAxis() || this.hasSecondAxis() || !isNil(this.coordinates)
  }

  isRenderable(): boolean {
    return (this.hasFirstAxis() && this.hasSecondAxis()) || !isNil(this.coordinates)
  }

  isFixed(): boolean {
    const isXFixed = !isNil(this.x?.value) && isNil(this.x?.field)
    const isYFixed = !isNil(this.y?.value) && isNil(this.y?.field)
    const isZFixed = !isNil(this.z?.value) && isNil(this.z?.field)
    return isXFixed || isYFixed || isZFixed
  }

  getId() : string {
    const keys = [
      this.floor?.field ?? 'no-floor',
      this.x?.field ?? this.coordinates?.field ?? 'no-x',
      this.y?.field ?? this.coordinates?.field ?? 'no-y',
      this.z?.field ?? 'no-z',
      this.scope ?? 'no-scope',
    ]

    return keys.join('#')
  }

  isSharedScope(parentScope:string) : boolean {
    return this.getType() === PositionType.MANAGED && this.scope === parentScope
  }
}
