import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {SizeEditorContainer} from './SizeEditorContainer'

export class SizeEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingSize
  public readonly group = EditorGroup.appearance
  create = SizeEditorContainer

  getAliases(): string[] {
    return super.getAliases(['SizeEncoding'])
  }
}
