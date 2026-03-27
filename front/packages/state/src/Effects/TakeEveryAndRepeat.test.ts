import { put } from '@redux-saga/core/effects'
import { SagaTest } from './Saga.test'
import { takeEveryAndRepeat } from './TakeEveryAndRepeat'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('TakeEveryAndRepeatWithInterval', () => {
  test('should take action and execute the worker in a loop interval until cancel was executed', async () => {
    function* worker(action) {
      yield put({type: 'pattern', payload: action.payload})
    }

    const st = new SagaTest(() => [takeEveryAndRepeat('patternA', 500, worker, ['patternB', 'patternC'])], 'pattern')

    st.dispatch({type: 'patternA'})
    expect(st.responses.length).toEqual(1)

    await sleep(600)
    expect(st.responses.length).toEqual(2)

    st.dispatch({type: 'patternB'})

    await sleep(600)
    expect(st.responses.length).toEqual(2)

    st.dispatch({type: 'patternA'})
    expect(st.responses.length).toEqual(3)

    await sleep(600)
    expect(st.responses.length).toEqual(4)

    st.dispatch({type: 'patternC'})

    await sleep(600)
    expect(st.responses.length).toEqual(4)

    st.end()
  })
})
