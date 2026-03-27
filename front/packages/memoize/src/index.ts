import fastMemoize from 'fast-memoize'

export type MemoizeOptions = {
  cacheStore?: Map<string, any>
  cacheKey?: string
  storeCountLimit?: number
}

const defaultStore = new Map

function getSerializer(options?:MemoizeOptions) {
  if (!options) {
    return
  }

  return (_args) => options.cacheKey ?? JSON.stringify(_args)
}

const MAX_ITEMS = 1000

 
export const memoize = (fn: (...args: any[]) => any, options?:MemoizeOptions) => {
  return fastMemoize(fn, {
    serializer: getSerializer(options),
    cache: {
      create() {
        const store = options?.cacheStore ?? defaultStore
        return {
          has(key: string) {
            return store.has(key)
          },
          get(key: string) {
            return store.get(key)
          },
          set(key: string, value: any) {
            if (store.size > (options?.storeCountLimit ?? MAX_ITEMS)) {
              store.clear()
            }

            store.set(key, value)
          },
        }
      },
    },
  })
}
 
