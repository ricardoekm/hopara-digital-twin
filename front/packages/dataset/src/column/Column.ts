import {ColumnType, DEFAULT_COLUMN_TYPE} from './ColumnType'
import Case from 'case'

export type ColumnStats = {
  min: number,
  max: number,
  minY?: number
  maxY?: number
  percentiles: number[]
  values?: any[]
}

function isUpperCase(string) {
  return string === string.toUpperCase()
}

export function columnLabel(name: string) {
  // We won't change acronyms
  if (isUpperCase(name)) return name
  return Case.sentence(name)
}


export class Column {
  name: string
  primaryKey: boolean
  type?: ColumnType
  stats?: ColumnStats
  quantitative: boolean
  temporal: boolean
  isEditable: boolean

  constructor(props: Partial<Column> & { name: string }) {
    if (props) {
      this.name = props.name
      this.type = props.type
      this.stats = props.stats
      this.primaryKey = props.primaryKey ?? false
      this.quantitative = props.quantitative ?? false
    }
  }

  getType(): ColumnType {
    if (this.type) return this.type

    return DEFAULT_COLUMN_TYPE
  }

  isType(type: ColumnType) {
    return this.type === type
  }

  getLabel(): string {
    return columnLabel(this.name)
  }

  isQuantitative(): boolean {
    return this.quantitative
  }

  isTemporal(): boolean {
    return this.temporal
  }

  isPrivate(): boolean {
    return this.name.startsWith('_')
  }

  getName(): string {
    return this.name
  }

  getStats(): ColumnStats | undefined {
    return this.stats
  }

  isPrimaryKey(): boolean {
    return this.primaryKey
  }

  isCategorical() {
    return this.type === ColumnType.STRING
  }

  isGeometry() {
    return this.type === ColumnType.GEOMETRY
  }

  isComplex() {
    return this.type === ColumnType.GEOMETRY ||
      this.type === ColumnType.STRING_ARRAY ||
      this.type === ColumnType.JSON
  }

  isPrintable() {
    return !(this.type === ColumnType.GEOMETRY || this.type === ColumnType.JSON)
  }

  isDatetime() {
    return this.type === ColumnType.DATETIME
  }

  isEquivalent(name?:string | null) {
    if (!name) return false

    return this.name.toLowerCase() === name.toLowerCase()
  }
}
