import { put } from '@redux-saga/core/effects'
import {takeBufferedLeading, takeBufferedLeadingPerKeyWithCancel} from './TakeBufferedLeading'
import { SagaTest } from './Saga.test'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('TakeLeadingPerKey', () => {
  test('should take latest action after first execution', async () => {
    function* worker(action) {
      yield sleep(400)
      yield put({type: 'responsePattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeBufferedLeading('patternA', worker)], 'responsePattern')

    st.dispatch({type: 'patternA', payload: {val: 1, key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual({val: 1, key: 'key1'})

    st.clearResponses()

    st.dispatch({type: 'patternA', payload: {val: 3, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 4, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 5, key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual({val: 3, key: 'key1'})

    st.end()
  })

  test('should take latest action after first execution with different keys', async () => {
    function* worker(action) {
      yield sleep(400)
      yield put({type: 'responsePattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeBufferedLeadingPerKeyWithCancel('patternA', worker, (action: any) => action.payload.key, 'cancelPattern', (action: any) => action.payload.key)], 'responsePattern')

    st.dispatch({type: 'patternA', payload: {val: 1, key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual({val: 1, key: 'key1'})

    st.clearResponses()

    st.dispatch({type: 'patternA', payload: {val: 2, key: 'key1'}})
    st.dispatch({type: 'cancelPattern', payload: {key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual(undefined)

    st.clearResponses()

    st.dispatch({type: 'patternA', payload: {val: 3, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 4, key: 'key1'}})
    st.dispatch({type: 'patternA', payload: {val: 5, key: 'key1'}})
    await sleep(600)
    st.dispatch({type: 'patternA', payload: {val: 6, key: 'key1'}})
    await sleep(600)
    expect(st.responses[0]).toEqual({val: 3, key: 'key1'})
    expect(st.responses[1]).toEqual({val: 6, key: 'key1'})


    st.end()
  })
})
