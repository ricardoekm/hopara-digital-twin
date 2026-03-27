import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ModelEditorContainer} from './ModelEditorContainer'

export class ModelEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingModel
  public readonly group = EditorGroup.appearance
  create = ModelEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ModelEncoding'])
  }
}
