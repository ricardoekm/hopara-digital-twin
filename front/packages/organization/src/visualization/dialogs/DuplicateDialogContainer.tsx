import React from 'react'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {VisualizationContext} from '../service/VisualizationContext'
import {toastSuccess, toastError} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import {EditDialog} from './EditDialog'
import {useContext} from 'react'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'

interface Props {
  id: string
  srcName: string
  onDuplicate: () => void
  onClose: () => void
  open: boolean
  onDuplicateStatusChange: (duplicating: boolean) => void
  isDuplicating: boolean
}

export const DuplicateDialogContainer = (props: Props) => {
  const authContext = useContext(AuthContext)
  const appContext = useContext(VisualizationContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)

  const handleDuplicate = async (visualizationId, name) => {
    try {
      props.onDuplicateStatusChange(true)
      const payload = await appContext.appService.duplicate(visualizationId, name, authContext.authorization)
      props.onDuplicate()
      toastSuccess(i18n('VISUALIZATION_DUPLICATED_SUCCESSFULLY'))
      props.onClose()
      pageNavigation.navigate(PageType.VisualizationDetail, {visualizationId: payload.id})
    } catch (e: any) {
      toastError(`${i18n('AN_ERROR_OCCURRED')}: ${e.message}`)
    } finally {
      props.onDuplicateStatusChange(false)
    }
  }

  return <EditDialog
    title={i18n('DUPLICATE_VISUALIZATION')}
    name={`${props.srcName} (${i18n('COPY')})`}
    open={props.open}
    isSaving={props.isDuplicating}
    onCancel={props.onClose}
    onSave={(name) => handleDuplicate(props.id, name)}
    canUseSameName={true}
    placeholder={i18n('VISUALIZATION_NAME')}
    helperText={i18n('ENTER_A_NAME_FOR_THIS_VISUALIZATION')}
  />
}
