import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {LineEditorContainer} from './LineEditorContainer'

export class LineEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingLine
  public readonly group = EditorGroup.appearance
  create = LineEditorContainer

  getAliases(): string[] {
    return super.getAliases(['LineEncoding'])
  }
}
