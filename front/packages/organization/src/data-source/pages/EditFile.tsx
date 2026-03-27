import React, {useContext} from 'react'
import {i18n} from '@hopara/i18n'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {useMatch} from 'react-router-dom'
import {Sidebar} from '../../sidebar/Sidebar'
import {Helmet} from 'react-helmet'
import {SidebarLayout} from '@hopara/design-system/src/SidebarLayout'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {TitleBar} from '@hopara/design-system/src/title-bar/TitleBar'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {styled} from '@hopara/design-system/src/theme'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {toastError, toastSuccess} from '@hopara/design-system/src/toast/Toast'
import {DataSourceContext} from '../service/DataSourceContext'
import {FileUpload} from '@hopara/design-system/src/form/FileUpload'
import {Alert, Checkbox, FormControl, FormControlLabel} from '@mui/material'
import {Query} from '../Query'
import {fileMenuFactory} from '../FileMenu'
import {DataFile} from '../DataFile'
import { Link } from '@hopara/design-system/src/Link'

const Form = styled('form', {name: 'Form'})({
  gridArea: 'container',
  gridTemplateRows: 'auto 1fr 1fr',
  gap: '1em',
})

const DataLoaderDocLink = () => {
  return <Link target="_blank" href="https://www.npmjs.com/package/@hopara/iframe#data-loader">
    {i18n('DATA_LOADER_LIST')}
  </Link>
}

const EditFile = () => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const [formData, setFormData] = React.useState<FormData | undefined>(undefined)
  const [fileName, setFileName] = React.useState('')


  const [saving, setSaving] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const editFileMatch = useMatch({ path: `${pageNavigation.getPath(PageType.EditDataFile)}/*` })
  const editFunctionMatch = useMatch({ path: `${pageNavigation.getPath(PageType.EditFunction)}/*` })
  const editParams = editFileMatch ?? editFunctionMatch as any

  const createFileMatch = useMatch({ path: `${pageNavigation.getPath(PageType.CreateDataFile)}/*` })
  const createFunctionMatch = useMatch({ path: `${pageNavigation.getPath(PageType.CreateFunction)}/*` })
  const createParams = createFileMatch ?? createFunctionMatch as any

  const isFunctionPage = !!editFunctionMatch || !!createFunctionMatch

  const dataSourceName = decodeURIComponent(editParams?.params.dataSourceName ?? createParams?.params.dataSourceName)
  const name = createParams?.params.name ?? editParams?.params.name
  const [createQuery, setCreateQuery] = React.useState(!name)

  const saveButtonClicked = async () => {
    setErrorMessage('')
    setSaving(true)
    try {
      const res = await dataSourceContext.dataFileService.upsert(
        name ?? fileName,
        dataSourceName,
        formData,
        authContext.authorization,
      )
      const newName = res.name
      if (createQuery) {
        await dataSourceContext.queryService.upsert(
          new Query({
            name: newName,
            dataSource: dataSourceName,
            query: `SELECT * FROM ${newName}`,
          }),
          authContext.authorization,
          true,
        )
      }

      if (createQuery && !isFunctionPage) {
        pageNavigation.navigate(PageType.EditQuery, {
          dataSourceName,
          name: newName,
        })
      } else {
        pageNavigation.navigate(PageType.ViewDataSource, {
          name: dataSourceName, 
        })
      }

      toastSuccess(i18n('DATA_FILE_SAVED_SUCCESSFULLY'))
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setSaving(false)
  }

  const back = () => {
    pageNavigation.navigate(PageType.ViewDataSource, {
      name: dataSourceName,
      tenant: authContext.authorization.tenant,
    })
  }

  const filePageTitle = name ? pageNavigation.getTitle(PageType.EditDataFile) : pageNavigation.getTitle(PageType.CreateDataFile)
  const functionPageTitle = name ? pageNavigation.getTitle(PageType.EditFunction) : pageNavigation.getTitle(PageType.CreateFunction)
  const title = isFunctionPage ? (name ? i18n('EDIT_FUNCTION') : i18n('ADD_FUNCTION')) : (name ? i18n('EDIT_DATA_FILE') : i18n('CREATE_DATA_FILE'))

  return (
    <SidebarLayout>
      <Helmet>
        <title>
          {isFunctionPage ? functionPageTitle : filePageTitle}
        </title>
      </Helmet>
      <Sidebar/>
      <Form noValidate autoComplete="off">
        <TitleBar
          title={title}
          titleTestId={name ? 'edit-title' : 'create-title'}
          onBack={back}
          buttons={[
            {
              testId: 'save-button',
              primary: true,
              disabled: saving || !formData,
              onClick: saveButtonClicked,
              label: saving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE'),
              responsiveIcon: <Icon icon="check"/>,
            },
          ]}
          menuItems={fileMenuFactory(name, {
            onDeleteClick: async () => {
              try {
                setSaving(true)
                await dataSourceContext.dataFileService.delete(name, dataSourceName, await authContext.getRefreshedAuthorization())
                toastSuccess(i18n('QUERY_DELETED_SUCCESSFULLY'))
                setSaving(false)
                back()
              } catch (err: any) {
                toastError(err?.message ?? i18n('UNKNOWN_ERROR'))
                setSaving(false)
              }
            },
            onDownloadClick: () => {
              dataSourceContext.dataFileService.download(new DataFile({
                name,
                dataSource: dataSourceName,
              }), authContext.authorization)
            },
          })}
        ></TitleBar>

        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            maxWidth: '400px',
            margin: '4em auto 0',
            gap: '1em',
          }}
        >
          <TextField
            testId="name"
            value={name ?? fileName}
            onSetValue={setFileName}
            label={i18n('NAME') + ' *'}
            disabled={saving || !!name}
            autoComplete='off'
            labelLayout="vertical"
          />
          {!name && !isFunctionPage && (
            <FormControl>
              <FormControlLabel
                sx={{paddingInlineStart: '1em'}}
                value={createQuery}
                control={
                  <Checkbox
                    checked={createQuery}
                    onChange={(event) => setCreateQuery(event.target.checked)}
                  />
                }
                label={i18n(
                  'CREATE_A_QUERY_WITH_THE_SAME_NAME_AS_THIS_DATA_FILE',
                )}
              />
            </FormControl>
          )}
          <FileUpload
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (
                event.target.files !== null &&
                event.target?.files?.length > 0
              ) {
                const file = event.target.files[0]
                if (file) {
                  const formData = new FormData()
                  formData.append('file', file)
                  const filename = file.name.replace(/\.[^/.]+$/, '')
                  setFileName(filename)
                  setFormData(formData)
                }
              }
            }}
            onDrop={(file) => {
              const formData = new FormData()
              formData.append('file', file)
              const filename = file.name.replace(/\.[^/.]+$/, '')
              setFileName(filename)
              setFormData(formData)
            }}
            accept={['text/csv', 'application/json']}
            fileName={name ?? fileName}
            tenant={authContext.authorization.tenant}
            accessToken={authContext.authorization.accessToken}
          />
          <Alert severity="info">
            {
              isFunctionPage ?
              <>{i18n('FUNCTION_UPLOAD_FILE_INFO_MESSAGE')} <DataLoaderDocLink /></> :
              i18n('YOU_CAN_UPLOAD_JSON_OR_CSV_AND_WE_WILL_USE_THEM_AS_TABLES')
            }
          </Alert>
          <ErrorPanel error={errorMessage}/>
        </div>
      </Form>
    </SidebarLayout>
  )
}

export default EditFile
