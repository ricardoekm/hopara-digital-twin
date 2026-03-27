import { isEmpty, mean, omit } from 'lodash/fp'

import {FetchProgressPayload} from '@hopara/resource'

export class FetchProgressStore {
  progress: {[fetchKey:string]: number}
  
  constructor(progress?: any) {
    this.progress = progress ?? {}
  }

  addProgress({key, entity, progress}: FetchProgressPayload): FetchProgressStore {
    const fetchKey = `${entity}-${key}`

    const progressMap = Object.assign(
      {},
      omit(fetchKey, this.progress),
      progress !== undefined ? {[fetchKey]: progress} : {},
    )
    

    return new FetchProgressStore(progressMap)
  }

  getProgressMean(): number | undefined {
    return !isEmpty(this.progress) ? mean(Object.values(this.progress)) : undefined
  }
}
