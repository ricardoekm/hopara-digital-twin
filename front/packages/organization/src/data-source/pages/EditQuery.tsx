import React, { useCallback, useContext, useEffect } from 'react'
import { i18n } from '@hopara/i18n'
import { Query } from '../Query'
import { DataSourceContext } from '../service/DataSourceContext'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { useMatch, useLocation, useNavigate } from 'react-router-dom'
import { PageType } from '@hopara/page/src/Pages'
import { usePageNavigation } from '@hopara/page/src/PageNavigation'
import { Sidebar } from '../../sidebar/Sidebar'
import { Helmet } from 'react-helmet'
import { SidebarLayout } from '@hopara/design-system/src/SidebarLayout'
import { useBeforeunload } from 'react-beforeunload'
import { Column, Columns } from '@hopara/dataset'
import { EditQueryPage, Metadata } from './EditQueryPage'
import { formatTableColumns } from '@hopara/design-system/src/table/Table'
import { toastError, toastSuccess } from '@hopara/design-system/src/toast/Toast'
import { ModalDialog } from '@hopara/design-system/src/dialogs/ModalDialog'

const EditQuery = () => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const location = useLocation() as any
  const navigate = useNavigate()
  const [queryResult, setQueryResult] = React.useState<any>()
  const [queryColumns, setQueryColumns] = React.useState<Columns>(new Columns())

  const [saving, setSaving] = React.useState(false)
  const [running, setRunning] = React.useState(false)
  const [loading, setQueryLoading] = React.useState(true)
  const [metadataLoading, setMetadataLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [metadata, setMetadata] = React.useState<Metadata>({ columns: [], tables: [] })
  const [advancedMode, setAdvancedMode] = React.useState(
    pageNavigation.getRouteParams().advancedMode === 'true',
  )
  const [dirty, setDirty] = React.useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = React.useState(false)
  const [validateError, setValidateError] = React.useState<string | undefined>(undefined)

  useBeforeunload(dirty ? (event) => event.preventDefault() : undefined)

  const editQueryParams = useMatch({ path: `${pageNavigation.getPath(PageType.EditQuery)}/*` }) as any
  const createQueryParams = useMatch({ path: `${pageNavigation.getPath(PageType.CreateQuery)}/*` }) as any

  const dataSourceName = decodeURIComponent(createQueryParams?.params.dataSourceName ??
    editQueryParams?.params.dataSourceName)
  const [query, setQuery] = React.useState<Query>(new Query({
    dataSource: dataSourceName,
  }))

  const valid = !!(query?.name?.length && query?.query?.length)
  const canRunQuery = !!query?.query?.length && !running
  const [queryName, setQueryName] = React.useState<string | undefined>(editQueryParams?.params.name as string | undefined)
  const duplicatedFrom = location?.state?.duplicatedFrom
  const [handledDuplicateKey, setHandledDuplicateKey] = React.useState<string | null>(null)

  useEffect(() => {
    setQueryName(editQueryParams?.params.name as string)
  }, [editQueryParams?.params.name])

  const loadMetadata = useCallback(async function(query: string) {
    setMetadataLoading(true)
    setMetadata({ columns: [], tables: [] })
    try {
      const metadata = await dataSourceContext.queryService.getMetadata(dataSourceName, query, await authContext.getRefreshedAuthorization())
      setMetadata(metadata)
    } catch (err: any) {
      setMetadata({ columns: [], tables: [], error: err?.message })
    }
    setMetadataLoading(false)
  }, [dataSourceContext, dataSourceName, authContext])

  const validateQuery = useCallback(async function(query: Query) {
    try {
      await dataSourceContext.queryService.validate(query, await authContext.getRefreshedAuthorization())
      setValidateError(undefined)
    } catch (err: any) {
      setValidateError(err?.message)
    }
  }, [])

  const runQuery = useCallback(async function runQuery(query: Query) {
    setErrorMessage('')
    setRunning(true)
    try {
      const result = await dataSourceContext.queryService.run(query, await authContext.getRefreshedAuthorization())
      const cs = result.columns.map((c: any) => new Column(c))
      setQueryColumns(new Columns(...cs))
      setQueryResult({ ...result, columns: formatTableColumns(new Columns(...cs), []) })
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setRunning(false)
  }, [dataSourceContext, authContext])

  const runButtonClicked = async () => {
    await runQuery(query)
  }

  useEffect(() => {
    (async () => {
      if (duplicatedFrom && handledDuplicateKey !== location?.key) {
        const newQuery = new Query({
          ...duplicatedFrom,
          dataSource: dataSourceName,
        })

        setHandledDuplicateKey(location?.key ?? null)
        setQueryName(undefined)
        setQuery(newQuery)
        setDirty(true)
        setQueryLoading(false)
        setRunning(false)

        await loadMetadata(newQuery.query)
        await runQuery(newQuery)

        window.history.replaceState({}, document.title)

        return
      }

      if (!queryName) {
        if (!query?.name && !query?.query) {
          setQuery(new Query({
            dataSource: dataSourceName,
          }))
          setDirty(false)
        }
        setQueryLoading(false)
        setMetadataLoading(false)
        setRunning(false)
        return
      }

      setQueryLoading(true)
      setRunning(true)
      setMetadataLoading(true)

      try {
        const loadedQuery = await dataSourceContext.queryService.get(
          queryName,
          dataSourceName as string,
          await authContext.getRefreshedAuthorization(),
        )

        setQuery(loadedQuery)
        setQueryLoading(false)

        await Promise.all([
          loadMetadata(loadedQuery.query),
          runQuery(loadedQuery),
        ])
      } catch (err: any) {
        if (err.status === 404) {
          pageNavigation.navigate(PageType.NotFound)
        } else {
          toastError(err.message)
        }
      }

      setQueryLoading(false)
    })()
  }, [queryName, duplicatedFrom, dataSourceName, loadMetadata, runQuery, handledDuplicateKey, location?.key])

  const saveButtonClicked = async () => {
    setErrorMessage('')
    setSaving(true)
    try {
      await dataSourceContext.queryService.upsert(query, await authContext.getRefreshedAuthorization())
      setDirty(false)
      setQueryName(query.name)
      setExitConfirmOpen(false)
      toastSuccess(i18n('QUERY_SAVED_SUCCESSFULLY'))
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setDirty(false)
    setSaving(false)
  }

  const back = () => {
    pageNavigation.navigate(PageType.ViewDataSource, { name: dataSourceName, tab: 'queries' })
  }

  const onDuplicateQuery = () => {
    if (!dataSourceName) {
      return
    }

    navigate(
      pageNavigation.getUrl(PageType.CreateQuery, {
        dataSourceName,
      }),
      {
        state: {
          duplicatedFrom: {
            ...query,
            name: `${query.name}_copy`,
          },
        },
      },
    )
  }


  return (
    <SidebarLayout>
      <Helmet>
        <title>{
          queryName ?
            pageNavigation.getTitle(PageType.EditQuery) :
            pageNavigation.getTitle(PageType.CreateQuery)
        }</title>
      </Helmet>
      <Sidebar />
      <EditQueryPage
        query={query}
        loading={loading}
        saving={saving}
        running={running}
        valid={valid}
        canRunQuery={canRunQuery}
        queryNameFromURL={queryName}
        queryResult={queryResult}
        queryColumns={queryColumns}
        errorMessage={errorMessage}
        queryError={validateError}
        onBack={() => {
          if (advancedMode) {
            setAdvancedMode(false)
          } else if (dirty) {
            setExitConfirmOpen(true)
          } else {
            back()
          }
        }}
        onSetQueryName={(name) => {
          setQuery(new Query({ ...query, name }))
          setDirty(true)
        }}
        onRun={runButtonClicked}
        onSave={saveButtonClicked}
        onSetSQL={async (sql) => {
          const q = new Query({ ...query, query: sql })
          setQuery(q)
          setDirty(true)
          await validateQuery(q)
        }}
        onSetPrimaryKeyColumn={(primaryKeyColumn) => {
          setQuery(new Query({ ...query, primaryKey: primaryKeyColumn }))
          setDirty(true)
        }}
        metadataLoading={metadataLoading}
        metadata={metadata}
        onToggleAdvancedMode={() => {
          setAdvancedMode(!advancedMode)
        }}
        advancedMode={advancedMode}
        onSetQuery={(query) => {
          setDirty(true)
          setQuery(query)
        }}
        onDuplicateQuery={onDuplicateQuery}
        onDelete={async () => {
          try {
            setSaving(true)
            await dataSourceContext.queryService.delete(
              query,
              authContext.authorization,
            )
            toastSuccess(i18n('QUERY_DELETED_SUCCESSFULLY'))
            setSaving(false)
            back()
          } catch (err: any) {
            toastError(err?.message ?? i18n('UNKNOWN_ERROR'))
            setSaving(false)
          }
        }}
        onQueryColumnOpen={async () => {
          await loadMetadata(query.query)
        }}
      />
      <ModalDialog
        open={exitConfirmOpen}
        onCancel={() => setExitConfirmOpen(false)}
        onConfirm={() => {
          setExitConfirmOpen(false)
          back()
        }}
        title={i18n('CLOSE')}
        description={i18n('ARE_YOU_SURE_YOU_WANT_TO_DISCARD_CHANGES_AND_CLOSE')}
        confirmText={i18n('DISCARD_AND_CLOSE')}
      />
    </SidebarLayout>
  )
}

export default EditQuery
