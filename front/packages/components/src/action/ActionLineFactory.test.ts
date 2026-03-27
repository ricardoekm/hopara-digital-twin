import {Row} from '@hopara/dataset'
import {ExternalLinkJump, FunctionCallback} from './Action'
import {createActionButtons} from './ActionLineFactory'
import {Visible} from '../layer/Visible'
import {CallbackFunction} from './ActionReducer'

it('should remove unavailable actions', () => {
  const row = new Row({alert: false, level: 1})
  const actions = [
    new ExternalLinkJump({title: 'first action'}),
    new ExternalLinkJump({title: 'second action', visible: new Visible({condition: {test: {field: 'alert'}}})}),
    new ExternalLinkJump({title: 'third action', visible: new Visible({condition: {test: {field: 'unknownField'}}})}),
    new ExternalLinkJump({title: 'fourth action', visible: new Visible({condition: {test: {field: 'level'}}})}),
  ]

   
  const anyCallback = jest.fn(() => () => {
    return
  })

  expect(createActionButtons(row, actions, [], anyCallback)).toEqual([{
    enabled: true,
    onClick: expect.any(Function),
    title: 'first action',
  }, {
    enabled: true,
    onClick: expect.any(Function),
    title: 'fourth action',
  },
  ])
})

it('should disable action without callback registered', () => {
  const row = new Row({alert: false, level: 0})
  const actions = [
    new ExternalLinkJump({title: 'first action'}),
    new FunctionCallback({title: 'second action', name: 'callback1'}),
    new FunctionCallback({title: 'third action', name: 'callback2'}),
  ]

   
  const anyCallback = jest.fn(() => () => {
    return
  })

  expect(createActionButtons(row, actions, [{name: 'callback1'} as CallbackFunction], anyCallback)).toEqual([{
      enabled: true,
      onClick: expect.any(Function),
      title: 'first action',
    },
      {
        enabled: true,
        onClick: expect.any(Function),
        title: 'second action',
      },
      {
        enabled: false,
        onClick: expect.any(Function),
        title: 'third action',
      },
    ])
})
