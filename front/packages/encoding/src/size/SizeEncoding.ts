import {isNil, isNumber} from 'lodash/fp'
import { BaseEncoding } from '../BaseEncoding'
import { DomainInput } from '../scale/ScaleBehavior'
import { Column, Row, Rows } from '@hopara/dataset'
import { Exclude } from 'class-transformer'
import { LinearScaleBehavior } from '../color/scale/LinearScaleBehavior'
import { SizeTranslator } from './SizeTranslator'
import { coalesce } from './coalesce'
import { NullSizeTranslator } from './NullSizeTranslator'

export enum SizeUnits {
  METERS = 'meters',
  COMMON = 'common',
  PIXELS = 'pixels'
}

export type SizeScale = {
  range: number[]
}

export const SIZE_MANAGED_FIELD = 'hopara_size'
export const REFERENCE_ZOOM_MANAGED_FIELD = 'hopara_size_reference_zoom'

export class SizeMultiplierEncoding extends BaseEncoding<SizeMultiplierEncoding> {
  constructor(props?: Partial<SizeMultiplierEncoding> | any) {
    super()
    Object.assign(this, props)
  }


  multiplier: number
  isRenderable(): boolean {
    return true
  }
}

export class SizeEncoding extends BaseEncoding<SizeEncoding> {
  field?: string
  value: number
  maxPixelValue?: number
  scale?: SizeScale
  multiplier?: number
  referenceZoom?: number
  animation: any

  @Exclude()
  sizeTranslator: SizeTranslator

  constructor(props?: Partial<SizeEncoding> | any) {
    super()
    Object.assign(this, props)

    if ( !this.sizeTranslator ) {
      this.sizeTranslator = new NullSizeTranslator()
    }
  }
  
  getRenderValue() : number {
    return this.sizeTranslator.getRenderSize(this.value, this.referenceZoom)
  }

  getPixelValue(currentZoom?: number) : number {
    return this.sizeTranslator.getPixelSize(this.value, this.referenceZoom, currentZoom) * this.getMultiplier()
  }

  coalesceMutate(value:number, referenceZoom?: number) {
    return new SizeEncoding({...this, value: coalesce(value, this.value), 
                             referenceZoom: coalesce(referenceZoom, this.referenceZoom)})
  }

  getValue() : number {
    return this.value
  }

  setValue(value: number) {
    this.value = value
  }

  clone() {
    return new SizeEncoding(this)
  }

  getMultiplier() : number {
    return this.multiplier ?? 1
  }

  getColumnStats(rows: Rows, column: Column | undefined) {
    return rows.columns?.get(column?.name)?.getStats() || column?.getStats()
  }

  getDomainInput(rows: Rows, column: Column | undefined) : DomainInput {
    return { columnStats: this.getColumnStats(rows, column),
             columnType: column?.type,
             rows }
  }

  doGetSize(fieldValue: number | undefined, domainInput: DomainInput) : number {
    const range = this.scale?.range.map((value) => this.sizeTranslator.getRenderSize(value, this.referenceZoom))
    if (!fieldValue || !range) {
      return this.sizeTranslator.getRenderSize(this.value, this.referenceZoom)
    }

    const scaleBehavior = new LinearScaleBehavior(this.field)
    return scaleBehavior.getScale(range, domainInput)(fieldValue) as number
  }

  getFieldValue(row:Row) {
    return this.field && typeof row[this.field] === 'number' ? Number(row[this.field]) : undefined
  }

  getManagedField() : string {
    return SIZE_MANAGED_FIELD
  }

  getSize(row:Row, rows: Rows, column?: Column): number {
    const fieldValue = this.getFieldValue(row) 
    if (this.isManaged()) {
      if (!isNil(fieldValue)) {
        return this.sizeTranslator.getRenderSize(fieldValue, row[REFERENCE_ZOOM_MANAGED_FIELD]) as number
      }

      return this.sizeTranslator.getRenderSize(this.value, this.referenceZoom) as number
    }

    const domainInput = this.getDomainInput(rows, column)
    return this.doGetSize(fieldValue, domainInput)
  }

  getMaxPixelSize() {
    return this.maxPixelValue ?? Number.MAX_SAFE_INTEGER
  }

  isFieldBased(): boolean {
    return !!this.field
  }

  isManaged() : boolean {
    return this.field === this.getManagedField()
  }

  getField(): string | undefined {
    return this.field
  }

  setField(fieldName:string): void {
    this.field = fieldName
  }

  isRenderable(): boolean {
    return !!(this.field && this.scale) || isNumber(this.value)
  }
}
