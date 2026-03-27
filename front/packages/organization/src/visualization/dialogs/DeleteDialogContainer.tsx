import React from 'react'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {VisualizationContext} from '../service/VisualizationContext'
import {toastSuccess} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import {DeleteDialog} from '@hopara/design-system/src/dialogs/DeleteDialog'
import {useContext} from 'react'

interface Props {
  id: string
  name: string
  onDelete: () => void
  onClose: () => void
  open: boolean
  onDeleteStatusChange: (deleting: boolean) => void
  isDeleting: boolean
}

export const DeleteDialogContainer = (props: Props) => {
  const authContext = useContext(AuthContext)
  const appContext = useContext(VisualizationContext)
  const [deleteError, setDeleteError] = React.useState('')

  const handleDelete = async (visualizationId) => {
    try {
      props.onDeleteStatusChange(true)
      await appContext.appService.delete(visualizationId, authContext.authorization)
      props.onDelete()
      toastSuccess(i18n('VISUALIZATION_DELETED'))
      props.onClose()
    } catch (e: any) {
      setDeleteError(e.message)
    } finally {
      props.onDeleteStatusChange(false)
    }
  }
  return <DeleteDialog
    message={i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_VISUALIZATION', {name: props.name})}
    open={props.open}
    onCancel={props.onClose}
    isDeleting={props.isDeleting}
    onDelete={() => handleDelete(props.id)}
    error={deleteError}
  />
}
