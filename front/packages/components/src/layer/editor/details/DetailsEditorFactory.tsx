import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {DetailsEditorContainer} from './DetailsEditorContainer'
import {DetailsFieldEditorContainer} from './DetailsFieldEditorContainer'

export class DetailsEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.details
  public readonly group = EditorGroup.details
  create = DetailsEditorContainer
  createItem = DetailsFieldEditorContainer

  getAliases(): string[] {
    return super.getAliases(['Details'])
  }
}
