import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {ChildrenEditorContainer} from './ChildrenEditorContainer'

export class ChildrenEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.children
  public readonly group = EditorGroup.childLayers
  create = ChildrenEditorContainer

  getAliases(): string[] {
    return super.getAliases(['ComposableLayerSpec'])
  }
}
