import { put } from '@redux-saga/core/effects'
import {takeAfter} from './TakeAfter'
import { SagaTest } from './Saga.test'

describe('TakeAfter', () => {
  test('should take action after 3 calls', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeAfter(3, 'patternA', worker)], 'pattern')

    st.dispatch({type: 'patternA', payload: {val: 1}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternA', payload: {val: 2}})
    expect(st.responses[0]).toEqual(undefined)

    st.dispatch({type: 'patternA', payload: {val: 3}})
    expect(st.responses[0]).toEqual({val: 3})

    st.end()
  })
})
