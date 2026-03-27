import { Columns } from './query/Columns.js'
import { QueryKey } from './QueryKey.js'

export class ColumnsMap {
  columnsMap:Record<string, Columns> = {}

  add(key:Partial<QueryKey>, columns:Columns) : void {
    const id = new QueryKey(key).getId()
    this.columnsMap[id] = columns
  }

  find(key:QueryKey) : Columns {
    return this.columnsMap[key.getId()] ?? new Columns()
  }
}
