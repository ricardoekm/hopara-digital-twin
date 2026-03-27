import { RowTranslator } from '@hopara/dataset'
import { DetailsCallbacks, DetailsCallbackFactory } from './DetailsCallbackFactory'
import { EditCallbackFactory, EditCallbackProps, EditCallbacks } from './EditCallbackFactory'

export type DeckLayerCallbacks = EditCallbacks & DetailsCallbacks

export class CallbacksFactory {
  static create(props: EditCallbackProps, rowTranslator?: RowTranslator): DeckLayerCallbacks {
    return {
      ...DetailsCallbackFactory.createCallbacks(props.callbacks, props, rowTranslator),
      ...EditCallbackFactory.createCallbacks(props, rowTranslator),
    }
  }
}
