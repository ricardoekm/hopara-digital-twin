import { Data } from '@hopara/encoding'
import {clone} from '@hopara/object/src/clone'

const anyData = new Data({
  source: 'any-source',
  query: 'my_query',
})

export function getAnyData(props:any = {}) : Data {
  return clone<Data>(anyData, props)
}

// so the build doesnt break
 
test('nothing', () => {
})
