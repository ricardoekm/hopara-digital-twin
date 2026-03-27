import { LayerType } from '../layer/LayerType'
import { RowSelection } from './deck/interaction/RowSelection'

export enum ViewLayerEditingMode {
  TRANSFORM = 'transform',
  MODIFY = 'modify',
  CROP = 'crop',
}

export class EditModeStore {
  layerModes: { [layerType: string]: ViewLayerEditingMode | undefined }

  constructor(layerModes: Partial<EditModeStore> = {}) {
    Object.assign(this, { layerModes })
  }

  setEditingMode(layerType: string, editingMode?: ViewLayerEditingMode): EditModeStore {
    const cloned = new EditModeStore(this)
    cloned.layerModes[layerType] = editingMode
    return cloned
  }

  getDefaultEditingMode(layerType?: LayerType): ViewLayerEditingMode {
    return layerType === LayerType.line ? ViewLayerEditingMode.MODIFY : ViewLayerEditingMode.TRANSFORM
  }

  getEditingMode(layerType?: LayerType): ViewLayerEditingMode {
    return layerType && this.layerModes[layerType] ? this.layerModes[layerType]! : this.getDefaultEditingMode(layerType)
  }
}

export class ViewLayerStore {
  rowSelection?: RowSelection
  editingMode: EditModeStore
  crop: any

  constructor(rowSelection?: RowSelection, editingModeStore?: EditModeStore) {
    this.rowSelection = rowSelection
    this.editingMode = new EditModeStore(editingModeStore?.layerModes)
  }

  clone(): ViewLayerStore {
    return new ViewLayerStore(this.rowSelection, this.editingMode)
  }

  setRowSelection(layerId?: string, parentId?: string, rowsetId?: string, rowId?: any): ViewLayerStore {
    if (rowId === undefined) return this
    const cloned = this.clone()
    cloned.rowSelection = { layerId, parentId, rowsetId, rowId } as RowSelection
    return cloned
  }

  setEditingMode(layerType?: LayerType, editingMode?: ViewLayerEditingMode): ViewLayerStore {
    if (!layerType) return this
    const cloned = this.clone()
    cloned.editingMode = this.editingMode.setEditingMode(layerType, editingMode)
    if (editingMode === ViewLayerEditingMode.CROP) cloned.crop = { ...cloned.crop, status: 'loading' }
    return cloned
  }

  resetRowSelection(): ViewLayerStore {
    const cloned = this.clone()
    cloned.rowSelection = undefined
    return cloned
  }

  getEditingMode(layerType?: LayerType): ViewLayerEditingMode {
    return this.editingMode.getEditingMode(layerType)
  }

  isEditingModeType(layerType?: LayerType, editingMode?: ViewLayerEditingMode): boolean {
    return this.getEditingMode(layerType) === editingMode
  }

  setCrop(crop: any): ViewLayerStore {
    const cloned = this.clone()
    cloned.crop = crop
    return cloned
  }

  setAllowRotation(allowRotation: boolean): ViewLayerStore {
    if (!this.rowSelection) return this
    const cloned = this.clone()
    cloned.rowSelection = { ...cloned.rowSelection, allowRotation } as RowSelection
    return cloned
  }

  setAllowImageEdit(allowImageEdit: boolean): ViewLayerStore {
    if (!this.rowSelection) return this
    const cloned = this.clone()
    cloned.rowSelection = { ...cloned.rowSelection, allowImageEdit } as RowSelection
    return cloned
  }
}
