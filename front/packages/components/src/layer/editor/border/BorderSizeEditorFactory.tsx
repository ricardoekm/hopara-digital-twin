import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {BorderSizeEditorContainer} from './BorderSizeEditorContainer'

export class BorderSizeEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingBorderSize
  public readonly group = EditorGroup.appearance
  create = BorderSizeEditorContainer
}
