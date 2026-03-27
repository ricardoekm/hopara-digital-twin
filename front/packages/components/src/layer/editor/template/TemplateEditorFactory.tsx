import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {TemplateEditorContainer} from './TemplateEditorContainer'

export class TemplateEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.template
  public readonly group = EditorGroup.appearance
  create = TemplateEditorContainer

  getAliases(): string[] {
    return super.getAliases(['Template'])
  }
}
