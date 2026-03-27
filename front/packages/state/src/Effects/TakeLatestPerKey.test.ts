import { put } from '@redux-saga/core/effects'
import {takeLatestPerKey} from './TakeLatestPerKey'
import { SagaTest } from './Saga.test'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('TakeLatestPerKey', () => {
  test('should take latest action with same key', async () => {
    function* worker(action) {
      yield sleep(400)
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeLatestPerKey('patternA', worker, (action: any) => action.payload.key)], 'pattern')

    st.dispatch({type: 'patternA', payload: {val: 1, key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual({val: 1, key: 'key1'})

    st.dispatch({type: 'patternA', payload: {val: 3, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 4, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 5, key: 'key1'}})
    await sleep(600)
    expect(st.responses[1]).toEqual({val: 5, key: 'key1'})

    st.dispatch({type: 'patternA', payload: {val: 6, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 7, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 1, key: 'key2'}})
    st.dispatch({type: 'patternA', payload: {val: 2, key: 'key2'}})
    await sleep(600)
    expect(st.responses[2]).toEqual({val: 7, key: 'key1'})
    expect(st.responses[3]).toEqual({val: 2, key: 'key2'})

    st.end()
  })
})
