import {i18n} from '@hopara/i18n'
import {MenuItemOrDivider} from '@hopara/design-system/src/buttons/MoreButton'

type Callback = (id: string) => void

interface Props {
  onAdvancedModeClick: Callback
  onDeleteClick: Callback
}

const advancedModeMenu = (props: Partial<Props>) => {
  return {
    label: i18n('ADVANCED_MODE'),
    onClick: props.onAdvancedModeClick,
  }
}

const deleteMenu = (props: Partial<Props>) => {
  return {
    label: i18n('DELETE'),
    onClick: props.onDeleteClick,
    color: 'error',
  }
}


export const filterMenuFactory = (props: Props) => {
  return [
    advancedModeMenu(props),
    'divider',
    deleteMenu(props),
  ] as MenuItemOrDivider[]
}
