import React, {useContext} from 'react'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {VisualizationContext} from '../service/VisualizationContext'
import {toastSuccess, toastError} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import {EditDialog} from './EditDialog'

interface Props {
  id: string
  oldName: string
  onSave: (newName: string) => void
  onClose: () => void
  open: boolean
  onSaveStatusChange: (saving: boolean) => void
  isSaving: boolean
}

export const RenameDialogContainer = (props: Props) => {
  const authContext = useContext(AuthContext)
  const appContext = useContext(VisualizationContext)

  const handleSave = async (visualizationId, newName: string) => {
    try {
      props.onSaveStatusChange(true)
      await appContext.appService.updateName(visualizationId, newName, authContext.authorization)
      props.onSave(newName)
      toastSuccess(i18n('VISUALIZATION_NAME_UPDATED'))
      props.onClose()
    } catch (e: any) {
      toastError(`${i18n('AN_ERROR_OCCURRED')}: ${e.message}`)
    } finally {
      props.onSaveStatusChange(false)
    }
  }
  return <EditDialog
    name={props.oldName}
    open={props.open}
    onCancel={props.onClose}
    isSaving={props.isSaving}
    onSave={(newName) => handleSave(props.id, newName)}
    title={i18n('RENAME_VISUALIZATION')}
    placeholder={i18n('VISUALIZATION_NAME')}
    helperText={i18n('ENTER_A_NAME_FOR_THIS_VISUALIZATION')}
  />
}
