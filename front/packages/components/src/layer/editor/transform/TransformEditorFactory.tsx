import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {TransformEditorContainer} from './TransformEditorContainer'

export class TransformEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.transform
  public readonly group = EditorGroup.data
  create = TransformEditorContainer

  getAliases(): string[] {
    return super.getAliases(['Transform'])
  }
}
