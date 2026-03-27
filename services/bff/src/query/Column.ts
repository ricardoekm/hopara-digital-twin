export type ColumnStats = {
  min: number
  max: number
  minY: number
  maxY: number
}

export type Column = {
  name: string
  query: string
  dataSource: string
  values?: string[]
  stats?: ColumnStats
}
