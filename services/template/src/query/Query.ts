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

export interface QueryTransform {
    type: string
    columns: Column[]
}

export interface Query {
    name: string
    dataSource: string
    writeMode: string,
    upsert: boolean,
    columns: Column[]
    transforms: QueryTransform[]
    writeColumns: Column[]
    smartLoad: boolean
}
