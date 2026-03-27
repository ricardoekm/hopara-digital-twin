 
import {ColorScaleType, scaleTypeEquals} from './scale/ScaleType'
import {getHexScheme, getRgbScheme} from './Schemes'
import {Column, Rows} from '@hopara/dataset'
import {BaseEncoding} from '../BaseEncoding'
import {createScaleBehavior} from './scale/ScaleBehaviorFactory'
import {DomainInput} from '../scale/ScaleBehavior'
import {isEmpty} from 'lodash/fp'
import {Condition} from '../condition/Condition'

export enum ColorFormat {
  hex = 'hex',
  rgb = 'rgb'
}

export type ColorScale = {
  type: ColorScaleType
  values?: string[] | number[]
  scheme?: string
  colors?: string[]

  reverse?: boolean
}

export const COLOR_MANAGED_FIELD = 'hopara_color'

interface Channel {
  duration: number,
  repeat?: number | null,
}

export interface ColorAnimation {
  field?: string,
  channel: Channel,
  keyFrames: any,
  type?: string
  speed?: number
  condition?: Condition
}

export type ColorCondition = Condition & Partial<ColorEncoding>

export class ColorEncoding extends BaseEncoding<ColorEncoding> {
  field?: string | null
  scale: ColorScale
  opacity?: number
  saturation?: number
  value?: string
  animation?: ColorAnimation
  conditions?: ColorCondition[]

  constructor(props?: Partial<ColorEncoding>) {
    super()
    Object.assign(this, props)
  }

  clone() {
    return new ColorEncoding(this)
  }

  getDefaultScale() {
    return {type: ColorScaleType.SORTED}
  }

  getScale(): ColorScale {
    if (!this.scale) {
      return this.getDefaultScale()
    }

    return this.scale
  }

  isManaged() : boolean {
    return this.field === this.getManagedField()
  }

  getManagedField() : string {
    return COLOR_MANAGED_FIELD
  }

  getField(): string | undefined | null {
    return this.field
  }

  isFieldBased(): boolean {
    return !!this.field
  }

  hasCondition(): boolean {
    return !isEmpty(this.conditions)
  }

  setField(field: string): ColorEncoding {
    this.field = field
    return this
  }

  getScaleType(): ColorScaleType {
    return this.getScale().type
  }

  requiresQuantitativeValues(): boolean {
    return scaleTypeEquals(this.getScaleType(), ColorScaleType.LINEAR) ||
      scaleTypeEquals(this.getScaleType(), ColorScaleType.GROUPED)
  }

  getColumnStats(rows: Rows, column: Column | undefined) {
    return rows.columns?.get(column?.name)?.getStats() || column?.getStats()
  }

  getDomainInput(rows: Rows, column: Column | undefined): DomainInput {
    return {
      fixedDomain: this.getScale().values,
      columnStats: this.getColumnStats(rows, column),
      columnType: column?.type,
      rows,
    }
  }

  canCreateLegend() {
    return this.field && (this.scale?.type !== ColorScaleType.HASHED)
  }

  getScaleFunction(rows = new Rows(), column?: Column, colorFormat: ColorFormat = ColorFormat.rgb) {
    const colors = this.getColors(colorFormat)
    const scaleParams = {
      type: this.getScaleType(),
      column, domain: this.getScale().values,
      colors,
    }
    const scaleBehavior = createScaleBehavior(this.field as string, scaleParams)
    return scaleBehavior.getScale(colors, this.getDomainInput(rows, column))
  }

  getColors(colorFormat: ColorFormat = ColorFormat.rgb): [number, number, number, number?][] | string[] {
    if (colorFormat === 'rgb') {
      return getRgbScheme(this.getScale().scheme || this.getScale().colors,
        this.getScale().reverse, this.opacity).colors
    }
    return getHexScheme(this.getScale().scheme || this.getScale().colors,
      this.getScale().reverse).colors
  }

  getFallback(): string {
    return this.value as string
  }

  isRenderable(): boolean {
    return !!(this.field && this.getScale().scheme) || !!this.value
  }
}


