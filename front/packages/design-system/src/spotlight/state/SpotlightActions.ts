import {ActionType, createAction} from 'typesafe-actions'

export const spotlightActions = {
  open: createAction('SPOTLIGHT_OPEN')<{ elementId: string }>(),
  close: createAction('SPOTLIGHT_CLOSE')<void>(),
}

export type SpotlightActions = ActionType<typeof spotlightActions>
