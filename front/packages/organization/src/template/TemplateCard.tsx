import React, { useContext } from 'react'
import { EditDialog } from '../visualization/dialogs/EditDialog'
import { CardListItem } from '@hopara/design-system/src/card-list/CardListItem'
import { Template } from './domain/Template'
import { i18n } from '@hopara/i18n'
import { VisualizationContext } from '../visualization/service/VisualizationContext'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { PageType } from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import { toastSuccess, toastError } from '@hopara/design-system/src/toast/Toast'
import { TemplateIcon } from './TemplateIcon'

interface Props {
  template: Template;
}

export const TemplateCard = (props: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const appContext = useContext(VisualizationContext)
  const authorization = useContext(AuthContext).authorization
  const pageNavigation = usePageNavigation(authorization.tenant)

  const cardClicked = () => {
    setDialogOpen(true)
  }

  const cancelClicked = () => {
    setDialogOpen(false)
  }

  const onSaveClicked = async (name: string) => {
    setIsSaving(true)
    try {
      const payload = await appContext.appService.createFromTemplate(
        props.template.id,
        name,
        authorization,
      )
      toastSuccess(i18n('VISUALIZATION_CREATED'))
      setDialogOpen(false)
      pageNavigation.navigate(PageType.VisualizationDetail, { visualizationId: payload?.id })
    } catch (e: any) {
      toastError(`${i18n('AN_ERROR_OCCURRED')}: ${e.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <CardListItem
        name={props.template.getName()}
        size="medium"
        icon={<TemplateIcon type={props.template.id} />}
        color="original"
        onClick={cardClicked}
        testId={props.template.getName()}
      />
      <EditDialog
        title={i18n('CREATE_VISUALIZATION')}
        name={''}
        open={dialogOpen}
        isSaving={isSaving}
        onCancel={cancelClicked}
        onSave={onSaveClicked}
        type={props.template.id}
        placeholder={i18n('VISUALIZATION_NAME')}
        helperText={i18n('ENTER_A_NAME_FOR_THIS_VISUALIZATION')}
      />
    </>
  )
}
