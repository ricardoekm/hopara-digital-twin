import {i18n} from '@hopara/i18n'
import {MenuItemOrDivider} from '@hopara/design-system/src/buttons/MoreButton'

interface Props {
  onDownloadClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export const fileMenuFactory = (name: string, props: Props) => {
  return [
    {
      label: i18n('DOWNLOAD'),
      onClick: (id) => {
        props.onDownloadClick(id as string)
      },
    },
    'divider',
    {
      label: i18n('DELETE'),
      color: 'error',
      onClick: (id) => {
        props.onDeleteClick(id as string)
      },
      deleteConfirmMessage: () => i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_FILE', {name}),
    }] as MenuItemOrDivider[]
}
