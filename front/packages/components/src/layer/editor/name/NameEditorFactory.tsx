import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {NameEditorContainer} from './NameEditorContainer'

export class NameEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.name
  public readonly group = EditorGroup.meta
  create = NameEditorContainer
}
