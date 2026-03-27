import {viewControllerReducer as reducer} from './ViewControllerReducer'
import actions from '../state/Actions'
import {DragMode, ViewController} from './ViewController'

test('should toggle dragMode', () => {
  const currentState = new ViewController({})
  expect(currentState.dragMode).toEqual(DragMode.PAN)

  const nextState = reducer(currentState, actions.navigation.bearingModeToggle({}), {})
  expect(nextState?.dragMode).toEqual(DragMode.ROTATE)
})
