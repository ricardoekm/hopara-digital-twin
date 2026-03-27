import { put } from '@redux-saga/core/effects'
import {takeEveryDepends} from './TakeEveryDepends'
import {SagaTest} from './Saga.test'

describe('TakeEveryDepends', () => {
  test('should take after depends pattern was trigged', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeEveryDepends('patternA', 'patternB', worker)], 'pattern')

    st.dispatch({type: 'patternA', payload: {val: 1}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternA', payload: {val: 2}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternB', payload: {val: 3}})
    expect(st.responses[0]).toEqual({val: 1})

    st.dispatch({type: 'patternA', payload: {val: 4}})
    expect(st.responses[1]).toEqual({val: 4})

    st.end()
  })
})
