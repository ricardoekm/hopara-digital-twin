import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {IconEditorContainer} from './IconEditorContainer'

export class IconEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingIcon
  public readonly group = EditorGroup.appearance
  create = IconEditorContainer

  getAliases(): string[] {
    return super.getAliases(['IconEncoding'])
  }
}
