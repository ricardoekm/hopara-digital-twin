import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {VisibilityEditorContainer} from './VisibilityEditorContainer'

export class VisibilityEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.visible
  public readonly group = EditorGroup.visibility
  create = VisibilityEditorContainer

  getAliases(): string[] {
    return super.getAliases(['Visible'])
  }
}


