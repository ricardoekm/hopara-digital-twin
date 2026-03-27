import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {TextEditorContainer} from './TextEditorContainer'

export class TextEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingText
  public readonly group = EditorGroup.appearance
  create = TextEditorContainer

  getAliases(): string[] {
    return super.getAliases(['TextEncoding'])
  }
}

