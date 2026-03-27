import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {TypeEditorContainer} from './TypeEditorContainer'

export class TypeEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.type
  public readonly group = EditorGroup.meta
  create = TypeEditorContainer
}
