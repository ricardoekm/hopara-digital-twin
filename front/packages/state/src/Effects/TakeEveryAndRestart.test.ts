import { put } from '@redux-saga/core/effects'
import {takeEveryAndRestart} from './TakeEveryAndRestart'
import { SagaTest } from './Saga.test'
import { takeOnce } from './TakeOnce'

describe('TakeEveryAndRestart', () => {
  test('should take action after both calls', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeEveryAndRestart('patternA', worker), takeOnce('patternB', worker)], 'pattern')

    st.dispatch({type: 'patternB', payload: {val: 1}})
    expect(st.responses[0]).toEqual({val: 1})

    st.clearResponses()

    st.dispatch({type: 'patternB', payload: {val: 1}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternA', payload: {val: 2}})
    expect(st.responses[0]).toEqual({val: 2})

    st.dispatch({type: 'patternB', payload: {val: 1}})
    expect(st.responses[1]).toEqual({val: 1})

    st.clearResponses()

    st.dispatch({type: 'patternB', payload: {val: 1}})
    expect(st.responses[0]).toEqual(undefined)

    st.end()
  })
})
