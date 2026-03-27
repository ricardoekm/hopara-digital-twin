import {i18n} from '@hopara/i18n'
import {MenuItemOrDivider} from '@hopara/design-system/src/buttons/MoreButton'
import {Layer} from '../Layer'

type Callback = (id: string) => void

interface Props {
  onAdvancedModeClick: Callback
  onLayerDeleteClick: Callback
  onLayerDuplicateClick: Callback
  onLayerEjectClick: Callback
}

const advancedModeMenu = (props: Partial<Props>) => {
  return {
    label: i18n('ADVANCED_MODE'),
    onClick: props.onAdvancedModeClick,
  }
}

const ejectMenu = (props: Partial<Props>) => {
  return {
    label: i18n('EJECT'),
    onClick: props.onLayerEjectClick,
  }
}

const duplicateMenu = (props: Partial<Props>) => {
  return {
    label: i18n('DUPLICATE'),
    onClick: props.onLayerDuplicateClick,
  }
}

const deleteMenu = (props: Partial<Props>) => {
  return {
    label: i18n('DELETE'),
    onClick: props.onLayerDeleteClick,
    color: 'error',
  }
}


export const genericLayerMenuFactory = (props: Props) => {
  return [
    advancedModeMenu(props),
    'divider',
    duplicateMenu(props),
    deleteMenu(props),
  ] as MenuItemOrDivider[]
}

export const templateLayerMenuFactory = (props: Props) => {
  return [
    advancedModeMenu(props),
    'divider',
    ejectMenu(props),
    'divider',
    duplicateMenu(props),
    deleteMenu(props),
  ] as MenuItemOrDivider[]
}

interface ChildrenProps {
  onAdvancedModeClick: Callback
  onLayerDeleteClick: Callback
  onLayerDuplicateClick: Callback
}

export const childrenLayerMenuFactory = (props: ChildrenProps) => {
  return [
    advancedModeMenu(props),
    'divider',
    duplicateMenu(props),
    deleteMenu(props),
  ] as MenuItemOrDivider[]
}

export const layerMenuFactory = (props: { layer: Layer, callbacks: Props }) => {
  if (props.layer.type === 'template') {
    return templateLayerMenuFactory(props.callbacks)
  }
  return props.layer.parentId ? childrenLayerMenuFactory(props.callbacks) : genericLayerMenuFactory(props.callbacks)
}
