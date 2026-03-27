import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ArcEditorContainer} from './ArcEditorContainer'

export class ArcEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingArc
  public readonly group = EditorGroup.appearance
  create = ArcEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ArcEncoding'])
  }
}
