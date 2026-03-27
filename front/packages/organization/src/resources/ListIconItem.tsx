import React, {useContext} from 'react'
import {CardButton, CardListItem} from '@hopara/design-system/src/card-list/CardListItem'
import {i18n} from '@hopara/i18n'
import {Box} from '@mui/material'
import {Icon} from './domain/Icon'
import {toastSuccess} from '@hopara/design-system/src/toast/Toast'
import {ResourceContext} from './service/ResourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {DeleteDialog} from '@hopara/design-system/src/dialogs/DeleteDialog'
import { Logger } from '@hopara/internals'
import {ResourceIcon} from '@hopara/design-system/src/icons/ResourceIcon'

interface Props {
  icons: Icon[]
  style: any
  rowIndex: number
  itemsPerRow: number
  columnIndex: number
  editable: boolean
  onDeleted: (icon: Icon) => void
  editUrl: (icon: Icon) => string | undefined
  hasMore: boolean
  libraryName: string
}

export const ListIconItem = (props: Props) => {
  const resourceContext = useContext(ResourceContext)
  const authContext = useContext(AuthContext)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string>('')

  const itemIndex = (props.rowIndex * props.itemsPerRow) + props.columnIndex
  const isItemLoaded = (index) => !props.hasMore || index < props.icons.length
  if (!isItemLoaded(itemIndex)) return <CardListItem loading={true} size="small" style={props.style}/>

  const icon = props.icons[itemIndex]
  if (!icon) return null

  const deleteClicked = async (icon: Icon) => {
    try {
      setIsDeleting(true)
      await resourceContext.iconService.delete(props.libraryName, icon.name, authContext.authorization)
      toastSuccess(i18n('RESOURCE_DELETED_SUCCESSFULLY'))
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      props.onDeleted(icon)
    } catch (err: any) {
      Logger.error(err)
      setError(err?.message ?? i18n('UNKNOWN_ERROR'))
      setIsDeleting(false)
    }
  }

  const buttons: CardButton[] = [{
    label: i18n('COPY_NAME'),
    onClick: () => {
      navigator.clipboard.writeText(icon.name)
      toastSuccess(i18n('ICON_NAME_COPIED_TO_CLIPBOARD'))
    },
  }]

  if (props.editable) {
    buttons.push({
      label: i18n('DELETE'),
      onClick: () => setIsDeleteDialogOpen(true),
      color: 'error',
    })
  }

  return <>
    <Box sx={{
      ...props.style,
      paddingBottom: 29,
      display: 'flex',
      placeItems: 'center',
    }}>
      <CardListItem
        key={icon.name}
        color="transparent"
        size="small"
        name={icon.name}
        flat={true}
        icon={<ResourceIcon
          libraryName={props.libraryName}
          icon={icon.name}
          size={60}
          tenant={authContext.authorization.tenant}
        />}
        backgroundImage={''}
        buttons={buttons}
        href={props.editable ? props.editUrl(icon) : undefined}
        style={{
          margin: 'auto',
          width: '100%',
        }}
      />
    </Box>
    <DeleteDialog
      open={isDeleteDialogOpen}
      onCancel={() => setIsDeleteDialogOpen(false)}
      onDelete={() => deleteClicked(icon)}
      isDeleting={isDeleting}
      message={i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ICON', {name: icon.name})}
      error={error}
    />
  </>
}
