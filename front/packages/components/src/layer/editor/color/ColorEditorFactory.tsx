import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ColorEditorContainer} from './ColorEditorContainer'

export class ColorEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingColor
  public readonly group = EditorGroup.appearance
  create = ColorEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ColorEncoding'])
  }
}
