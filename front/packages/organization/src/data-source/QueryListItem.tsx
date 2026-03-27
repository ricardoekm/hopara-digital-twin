import {Icon} from '@hopara/design-system/src/icons/Icon'
import {i18n} from '@hopara/i18n'
import {ListListItem} from '@hopara/design-system/src/card-list/ListListItem'
import {Query} from './Query'
import {toastError, toastSuccess} from '@hopara/design-system/src/toast/Toast'
import React, {useContext} from 'react'
import {DataSourceContext} from './service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {queryMenuFactory} from './QueryMenu'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'

interface Props {
  query: Query
  onDeleted: (query: Query) => void
  dataSourceName: string
  onAdvancedModeClick: () => void
}

export const QueryListItem = (props: Props) => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)

  const queryDeleteClicked = async (query: Query) => {
    try {
      await dataSourceContext.queryService.delete(
        query,
        authContext.authorization,
      )
      toastSuccess(i18n('QUERY_DELETED_SUCCESSFULLY'))
      props.onDeleted(query)
    } catch (err: any) {
      toastError(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  return <>
    <ListListItem
      name={props.query.name}
      icon={<Icon icon="query" size="md"/>}
      menuItems={queryMenuFactory(props.query.name, {
        onDeleteClick: async () => {
          await queryDeleteClicked(props.query)
        },
        onAdvancedModeClick: () => {
          props.onAdvancedModeClick()
        },
        onDuplicateQuery: async () => {
          try {
            const loadedQuery = await dataSourceContext.queryService.get(
              props.query.name,
              props.dataSourceName,
              await authContext.getRefreshedAuthorization(),
            )

            pageNavigation.navigate(
              PageType.CreateQuery,
              {dataSourceName: props.dataSourceName},
              {
                state: {
                  duplicatedFrom: {
                    ...loadedQuery,
                    name: `${props.query.name}_copy`,
                  },
                },
              },
            )
          } catch (err: any) {
            toastError(err?.message ?? i18n('UNKNOWN_ERROR'))
          }
        },
      })}
      href={pageNavigation.getUrl(PageType.EditQuery, {dataSourceName: props.dataSourceName, name: props.query.name})}
    />
  </>
}
