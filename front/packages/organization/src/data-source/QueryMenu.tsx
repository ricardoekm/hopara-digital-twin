import {i18n} from '@hopara/i18n'
import {MenuItemOrDivider} from '@hopara/design-system/src/buttons/MoreButton'

interface Props {
  onAdvancedModeClick: () => void
  onDuplicateQuery?: () => void
  onDeleteClick: () => void
  disableDuplicateAndDelete?: boolean
}

export const queryMenuFactory = (name: string, props: Props) => {
  const items: MenuItemOrDivider[] = [
    {
      label: i18n('ADVANCED_MODE'),
      onClick: () => {
        props.onAdvancedModeClick()
      },
    },
    {
      label: i18n('DUPLICATE'),
      disabled: props.disableDuplicateAndDelete,
      onClick: props.disableDuplicateAndDelete ? undefined : () => {
        props.onDuplicateQuery?.()
      },
    },
    'divider',
    {
      label: i18n('DELETE'),
      color: 'error',
      disabled: props.disableDuplicateAndDelete,
      onClick: props.disableDuplicateAndDelete ? undefined : () => {
        props.onDeleteClick()
      },
      deleteConfirmMessage: props.disableDuplicateAndDelete ? undefined : () =>
        i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_QUERY', {name}),
    },
  ]

  return items
}
