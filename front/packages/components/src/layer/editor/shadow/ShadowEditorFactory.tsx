import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ShadowEditorContainer} from './ShadowEditorContainer'

export class ShadowEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingShadow
  public readonly group = EditorGroup.appearance
  create = ShadowEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ShadowEncoding'])
  }
}
