import {DataSourceContext} from '../service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {Query} from '../Query'
import {ListListSkeleton} from '@hopara/design-system/src/card-list/ListListSkeleton'
import {i18n} from '@hopara/i18n'
import {ListList} from '@hopara/design-system/src/card-list/ListList'
import {QueryListItem} from '../QueryListItem'
import {PageType} from '@hopara/page/src/Pages'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import { useContext, useEffect } from 'react'
import React from 'react'
import { Box } from '@mui/material'

export const ListQueries = (props: { dataSourceName: string }) => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)

  const [loadingQueries, setLoadingQueries] = React.useState(true)
  const [queries, setQueries] = React.useState<Query[]>([])
  const [queriesError, setQueriesError] = React.useState<string>('')

  useEffect(() => {
    setLoadingQueries(true);
    (async () => {
      try {
        const queries = await dataSourceContext.queryService.list(
          props.dataSourceName,
          await authContext.getRefreshedAuthorization(),
        )
        setQueries(queries)
      } catch (err: any) {
        setQueriesError(err.message)
      }
      setLoadingQueries(false)
    })()
  }, [props.dataSourceName])

  return (
    <Box
      sx={{
        padding: '0 2em 2em',
        display: 'grid',
        gridAutoFlow: 'row',
      }}
    >
      {loadingQueries ? (
        <ListListSkeleton count={5} testId="queriesLoading"/>
      ) : queries.length === 0 ? (
        <Box sx={{width: 'max-content', justifySelf: 'center'}}>
          {i18n('NO_QUERIES_FOUND')}
        </Box>
      ) : (
        <ListList data-testid="queriesContent">
          {queries.map((query) => (
            <QueryListItem
              key={query.name}
              query={query}
              onDeleted={() => {
                setQueries(queries.filter((q) => q.name !== query.name))
              }}
              dataSourceName={props.dataSourceName}
              onAdvancedModeClick={() => {
                pageNavigation.navigate(PageType.EditQuery, {
                  dataSourceName: props.dataSourceName,
                  name: query.name,
                  advancedMode: 'true',
                })
              }}
            />
          ))}
        </ListList>
      )}
      <ErrorPanel testId="queriesError" error={queriesError}/>
    </Box>
  )
}
