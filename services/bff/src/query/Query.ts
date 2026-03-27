import {Column} from './Column'

export interface QueryTransform {
    type: string
    columns: Column[]
}

export interface Query {
    name: string
    dataSource: string
    writeLevel: string,
    columns: Column[]
    transforms: QueryTransform[]
    smartLoad?: boolean
}

export type QueryKey = {
    name: string,
    dataSource: string
}

export class Queries extends Array<Query> {
    findByKey(key:QueryKey) : Query | undefined {
        return this.find((query) => query.name === key.name && query.dataSource === key.dataSource)
    }
}
