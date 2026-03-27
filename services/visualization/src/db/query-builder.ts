
import knex, {Knex} from 'knex'
import {FindOptionsOrder, FindOptionsWhere} from 'typeorm'
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity.js'
import {UserInfo} from '@hopara/http-server'


const knexObj = knex({client: 'pg'})

const DIGIT_EXPRESSION = /^\d$/

const isDigit = (character) => {
    return character && DIGIT_EXPRESSION.test(character)
}

const sanitize = (name: string): string => {
  const sanitized = name.replace(/\W/g, '_')
  if ( sanitized.length === 0 ) {
    throw new Error('Empty string after sanitization')
  }

  if ( isDigit(sanitized[0]) ) {
    return 'a_' + sanitized
  }

  return sanitized.toLowerCase()
}

export interface FindOptions<T> {
  where?: FindOptionsWhere<T>,
}

export interface FindManyOptions<T> {
  where?: FindOptionsWhere<T>,
  order?: FindOptionsOrder<T>,
  select?: string[],
  limit?: number,
}

export interface DeleteOptions<T> {
  where: FindOptionsWhere<T>,
}

export interface UpdateOptions<T> {
  partialEntity: QueryDeepPartialEntity<T>,
  where: FindOptionsWhere<T>
}

function fillWhere<T extends Record<any, any>>(qb: Knex.QueryBuilder<T>, where?: FindOptionsWhere<T>): void {
  if (where) {
    Object.entries(where).forEach(([key, value]) => {
      const anyValue = value as any
      if (value && anyValue._type === 'like') {
        qb = qb.where(key, 'like', anyValue._value)
      } else {
        qb = qb.where(key, (value as any).toString())
      }
    })
  }
}

function fillOrder<T extends Record<any, any>>(qb: Knex.QueryBuilder<T>, order: FindOptionsOrder<T> | undefined): void {
  if (order) {
    Object.entries(order).forEach(([column, o]) => {
      qb.orderBy(column, (o as any).toString())
    })
  }
}

export class QueryBuilder<T extends Record<any, any>> {
  private readonly builder: Knex.QueryBuilder<T>

  constructor(
    private readonly userInfo: UserInfo,
    private readonly entity: string,
  ) {
    this.builder = knexObj.from<T>(`${sanitize(this.userInfo.tenant)}.${this.entity}`)
  }

  find({where, order, select, limit}: FindManyOptions<T>): string {
    const qb = this.builder.clone()

    if ( select ) {
      qb.select(select)
    }

    fillWhere(qb, where)
    fillOrder(qb, order)
    if (limit) {
      qb.limit(limit)
    }
    return qb.toString()
  }

  findOne({where}: FindOptions<T>): string {
    const qb = this.builder.clone()
    fillWhere(qb, where)
    return qb.first().toString()
  }

  count({where}: FindOptions<T>): string {
    const qb = this.builder.clone()
    fillWhere(qb, where)
    return qb.count().toString()
  }

  delete({where}: DeleteOptions<T>): string {
    const qb = this.builder.clone()
    fillWhere(qb.del(), where)
    return qb.toString()
  }

  insert(entity: T): string {
    const qb = this.builder.clone()
    return qb.insert(entity as any).toString()
  }

  update(options: UpdateOptions<T>): string {
    const qb = this.builder.clone()
    qb.update(options.partialEntity as any)
    fillWhere(qb, options.where)
    return qb.toString()
  }
}
