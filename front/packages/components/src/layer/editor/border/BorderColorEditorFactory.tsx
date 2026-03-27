import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {BorderColorEditorContainer} from './BorderColorEditorContainer'

export class BorderColorEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingBorderColor
  public readonly group = EditorGroup.appearance
  create = BorderColorEditorContainer
}
