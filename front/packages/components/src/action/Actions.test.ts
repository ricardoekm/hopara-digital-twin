import { FunctionCallback, Trigger, VisualizationJump } from './Action'
import { Actions } from './Actions'

test('Object click returns multiple callbacks but only one of the rest', () => {
  const actions = new Actions(
    new FunctionCallback({ id: '1', name: 'callback1', trigger: Trigger.OBJECT_CLICK }),
    new FunctionCallback({ id: '2', name: 'callback2', trigger: Trigger.OBJECT_CLICK }),
    new VisualizationJump({ id: '3', trigger: Trigger.OBJECT_CLICK }),
    new VisualizationJump({ id: '4', trigger: Trigger.OBJECT_CLICK })
  )

  const objectClickActions = actions.getObjectClickActions()
  expect(objectClickActions.length).toBe(3)
  expect(objectClickActions[0].id).toEqual('1')
  expect(objectClickActions[1].id).toEqual('2')
  expect(objectClickActions[2].id).toEqual('3')
})

test('Object click returns one visualization jump', () => {
  const actions = new Actions(
    new VisualizationJump({ id: '3', trigger: Trigger.OBJECT_CLICK }),
    new VisualizationJump({ id: '4', trigger: Trigger.OBJECT_CLICK })
  )

  const objectClickActions = actions.getObjectClickActions()
  expect(objectClickActions.length).toBe(1)
  expect(objectClickActions[0].id).toEqual('3')
})

test('Returns empty array if there is no object click', () => {
  const actions = new Actions(
    new VisualizationJump({ id: '3' }),
    new VisualizationJump({ id: '4' })
  )

  const objectClickActions = actions.getObjectClickActions()
  expect(objectClickActions.length).toBe(0)
})
