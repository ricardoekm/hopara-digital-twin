import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ImageEditorContainer} from './ImageEditorContainer'

export class ImageEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingImage
  public readonly group = EditorGroup.appearance
  create = ImageEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ImageEncoding'])
  }
}
