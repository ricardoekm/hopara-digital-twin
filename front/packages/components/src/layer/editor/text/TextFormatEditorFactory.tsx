import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {TextFormatEditorContainer} from './TextFormatEditorContainer'

export class TextFormatEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingText
  public readonly group = EditorGroup.appearance
  create = TextFormatEditorContainer

  getAliases(): string[] {
    return super.getAliases(['TextEncoding'])
  }
}
