import {DataLoaders, Queries, Query} from '@hopara/dataset'
import { DataLoader, PlainDataLoader } from '@hopara/dataset/src/loader/DataLoader'

class QueryStore {
  queries: Queries
  loaders: DataLoaders

  constructor(props?: Partial<QueryStore>) {
    Object.assign(this, props)
    if (!this.queries) this.queries = new Queries()
    if (!this.loaders) this.loaders = new DataLoaders()
  }

  addQuery(query:Query) {
    const cloned = this.clone()
    cloned.queries.push(query)
    return cloned
  }

  addQueries(queries:Queries) {
    const cloned = this.clone()
    for (const query of queries) {
      cloned.queries.push(query)
    }
    return cloned
  }

  clone() {
    return new QueryStore({ queries: this.queries.clone(), loaders: this.loaders.clone() })
  }

  setQueries(queries:Queries): QueryStore {
    return new QueryStore({ ...this, queries: queries.unionWith(this.queries) })
  }

  setQuery(query: Query): QueryStore {
    return this.setQueries(new Queries(query))
  }

  setLoaders(dataLoaders: (DataLoader | PlainDataLoader)[]): QueryStore {
    return new QueryStore({
      ...this,
      loaders: new DataLoaders(...dataLoaders.map((loader) => new DataLoader(loader))),
    })
  }

  isSameLoaders(dataLoaders: (DataLoader | PlainDataLoader)[]): boolean {
    if (this.loaders?.length !== dataLoaders?.length) return false
    return this.loaders.every((loader) => {
      const stateLoader = dataLoaders.find((stateLoader) => stateLoader.query === loader.query)
      if (!stateLoader) return false
      return loader.query === stateLoader.query && loader.source === stateLoader.source && loader.cache === stateLoader.cache
    })
  }
}

export default QueryStore
