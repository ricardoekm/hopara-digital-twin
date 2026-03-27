import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ActionsEditorContainer} from './ActionsEditorContainer'
import {ActionEditorContainer} from './ActionEditorContainer'

export class ActionsEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.actions
  public readonly group = EditorGroup.actions
  create = ActionsEditorContainer
  createItem = ActionEditorContainer

  getAliases() {
    return super.getAliases(['Actions'])
  }
}
