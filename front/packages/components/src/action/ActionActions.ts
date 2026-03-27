import { Row } from '@hopara/dataset'
import {createAction} from 'typesafe-actions'
import { Action } from './Action'
import { PageNavigation } from '@hopara/page/src/PageNavigation'
import { Coordinates } from '@hopara/spatial'

export const actionActions = {
  objectActionTriggered: createAction('ACTION_OBJECT_ACTION_TRIGGERED')<{row?: Row, layerId: string, action: Action, navigation: PageNavigation, pixel?:Coordinates}>(),
  functionCallback: createAction('ACTION_FUNCTION_CALLBACK')<{name: string, row: Row, rowsetId?: string, layerId?: string, pixel?:Coordinates}>(),
  visualizationChanged: createAction('LAYER_ACTION_VISUALIZATION_CHANGED')<{ visualization: string }>(),
}
