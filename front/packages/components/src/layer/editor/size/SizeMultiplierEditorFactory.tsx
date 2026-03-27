import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {SizeMultiplierEditorContainer} from './SizeMultiplierEditorContainer'

export class SizeMultiplierEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingMultiplier
  public readonly group = EditorGroup.appearance
  aliases: ['SizeMultiplierEncoding']
  create = SizeMultiplierEditorContainer

  getAliases(): string[] {
    return super.getAliases(['SizeMultiplierEncoding'])
  }
}
