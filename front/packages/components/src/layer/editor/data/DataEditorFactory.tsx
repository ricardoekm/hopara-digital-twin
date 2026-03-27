import {LayerEditorFactory, EditorGroup, LayerEditorType} from '../LayerEditorFactory'
import {DataEditorContainer} from './DataEditorContainer'

export class DataEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.data
  public readonly group = EditorGroup.data
  create = DataEditorContainer
}
