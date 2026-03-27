import React, {useContext} from 'react'
import {i18n} from '@hopara/i18n'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {useMatch} from 'react-router-dom'
import {Sidebar} from '../../sidebar/Sidebar'
import {Helmet} from 'react-helmet'
import {SidebarLayout} from '@hopara/design-system/src/SidebarLayout'
import {ResourceContext} from '../service/ResourceContext'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {TitleBar} from '@hopara/design-system/src/title-bar/TitleBar'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {styled} from '@hopara/design-system/src/theme'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {IconUpload} from '@hopara/design-system/src/form/IconUpload'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {toastSuccess} from '@hopara/design-system/src/toast/Toast'

const Form = styled('form', {name: 'Form'})({
  gridArea: 'container',
  gridTemplateRows: 'auto 1fr 1fr',
  gap: '1em',
})

const EditIcon = () => {
  const resourceContext = useContext(ResourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const [formData, setFormData] = React.useState<FormData>()
  const [iconName, setIconName] = React.useState('')

  const [saving, setSaving] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const editIconParams = useMatch({path: `${pageNavigation.getPath(PageType.EditIcon)}/*`}) as any
  const createIconParams = useMatch({path: `${pageNavigation.getPath(PageType.CreateIcon)}/*`}) as any

  const libraryName = createIconParams?.params.name ?? editIconParams?.params.name
  const icon = createIconParams?.params.icon ?? editIconParams?.params.icon

  const saveButtonClicked = async () => {
    setErrorMessage('')
    setSaving(true)
    try {
      await resourceContext.iconService.upsert(libraryName as string, icon ?? iconName, formData, authContext.authorization)
      toastSuccess(i18n('ICON_SAVED_SUCCESSFULLY'))
      pageNavigation.navigate(PageType.ListIcons, {name: libraryName})
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setSaving(false)
  }

  return (
    <SidebarLayout>
      <Helmet>
        <title>{
          libraryName ?
            pageNavigation.getTitle(PageType.EditIcon) :
            pageNavigation.getTitle(PageType.CreateIcon)
        }</title>
      </Helmet>
      <Sidebar/>
      <Form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
        <TitleBar
          title={icon ? i18n('EDIT') : i18n('CREATE')}
          titleTestId={icon ? 'edit-title' : 'create-title'}
          onBack={() => pageNavigation.navigate(PageType.ListIcons, {
            name: libraryName,
            tenant: authContext.authorization.tenant,
          })}
          buttons={[{
            testId: 'save-button',
            primary: true,
            disabled: saving,
            onClick: saveButtonClicked,
            label: saving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE'),
            responsiveIcon: <Icon icon="check"/>,
          }]}>
        </TitleBar>

        <div style={{
          'display': 'flex',
          'flexWrap': 'nowrap',
          'flexDirection': 'column',
          'maxWidth': '36ch',
          'margin': '4em auto 0',
          'gap': '1em',
        }}>
          <TextField
            testId="name"
            value={icon ?? iconName}
            onSetValue={setIconName}
            label={i18n('NAME') + ' *'}
            disabled={saving || !!icon}
            autoComplete='off'
            labelLayout='vertical'
          />
          <IconUpload
            size={308}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files !== null && event.target?.files?.length > 0) {
                const formData = new FormData()
                formData.append('file', event.target.files[0])
                setFormData(formData)
              }
            }}
            onDrop={(event: React.DragEvent<HTMLElement>) => {
              if (event.dataTransfer.files !== null && event.dataTransfer?.files?.length > 0
              ) {
                const formData = new FormData()
                formData.append('file', event.dataTransfer.files[0], 'file.png')
                setFormData(formData)
              }
            }}
            imageUrl={(icon || iconName) ? resourceContext.iconService.getIconUrl(libraryName as string, icon ?? iconName, authContext.authorization) : ''}
            tenant={authContext.authorization.tenant}
            accessToken={authContext.authorization.accessToken}
          />
          <ErrorPanel error={errorMessage}/>
        </div>
      </Form>
    </SidebarLayout>
  )
}

export default EditIcon


