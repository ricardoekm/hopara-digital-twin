import {Row} from '@hopara/dataset'
import {Layer} from '../layer/Layer'
import ViewState from '../view-state/ViewState'
import {Navigate} from '../action/Action'
import { translateFixed } from './translate/TranslateFixed'
import { ZoomValue } from './ZoomValue'
import { translateBounds } from './translate/TranslateBounds'
import { isNil } from 'lodash/fp'

const getTranslateType = (action?: Navigate): 'fixed' | 'relative' | 'bounds' => {
  if (!isNil(action?.zoom?.value)) return 'fixed'
  if (!isNil(action?.zoom?.increment)) return 'relative'
  return 'bounds'
}

export function translateZoom(layer: Layer, row: Row | undefined, viewState: ViewState, action?: Navigate): number {
  switch (getTranslateType(action)) {
    case 'fixed': return translateFixed(action?.zoom as ZoomValue, viewState?.zoomRange)
    case 'relative': return viewState.zoom + (action?.zoom?.increment as number)
    default: return translateBounds(layer, row, viewState, action)
  }
}
