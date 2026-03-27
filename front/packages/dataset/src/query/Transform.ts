 
 
import 'reflect-metadata'
import {Type, Transform as ClassTransform} from 'class-transformer'
import { Column } from '../column/Column'
import { Columns } from '../column/Columns'

export class Transform {
  type: string

  @Type(() => Column)
  @ClassTransform(({value}) => Array.isArray(value) ? new Columns(...value) : new Columns())
  columns: Columns

  getColumns(): Columns {
    if (!this.columns) {
      return new Columns()
    }
    
    return new Columns(...this.columns)
  }
}
