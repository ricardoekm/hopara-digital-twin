import { put } from '@redux-saga/core/effects'
import {takeOnce} from './TakeOnce'
import { SagaTest } from './Saga.test'

describe('TakeOnce', () => {
  test('should take action only one time', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeOnce('patternA', worker)], 'pattern')

    st.dispatch({type: 'patternA', payload: {val: 1}})
    st.dispatch({type: 'patternA', payload: {val: 2}})
    st.dispatch({type: 'patternA', payload: {val: 3}})
    expect(st.responses[0]).toEqual({val: 1})

    st.end()
  })
})
