import { put } from '@redux-saga/core/effects'
import {takeBoth} from './TakeBoth'
import { SagaTest } from './Saga.test'

describe('TakeBoth', () => {
  test('should take action after both calls', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeBoth('patternA', 'patternB', worker)], 'pattern')

    st.dispatch({type: 'patternA', payload: {val: 1}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternB', payload: {val: 2}})
    expect(st.responses[0]).toEqual({val: 1})

    st.end()
  })
})
