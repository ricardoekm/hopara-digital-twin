import { Data } from './domain/spec/Data.js'

export class QueryKey {
  source: string
  query: string
  transform?: string

  constructor(props: Partial<QueryKey>) {
    if ( !props.transform ) {
      delete props.transform
    }
    
    Object.assign(this, {...props})
  }

  static baseFromData(data:Data): QueryKey {
    return new QueryKey({source: data.source, query: data.query})
  }

  static fromData(data:Data): QueryKey {
    if ( data.transform ) {
      return new QueryKey({source: data.source, query: data.query, transform: data.transform.type})
    }

    return this.baseFromData(data)
  }

  getId() : string {
    const keyParams = [this.source, this.query]
    if ( this.transform ) {
      keyParams.push(this.transform.toLowerCase())
    }
    return keyParams.join()
  }

  getPath() : string {
    const path = `${this.source}/${this.query}`
    if ( this.transform ) {
      return path + `/${this.transform}`
    }

    return path
  }
}
