import {i18n} from '@hopara/i18n'
import {CardButton, CardListItem} from '@hopara/design-system/src/card-list/CardListItem'
import {DeleteDialog} from '@hopara/design-system/src/dialogs/DeleteDialog'
import {DataSource} from './DataSource'
import React, {useContext} from 'react'
import {useTheme} from '@hopara/design-system/src'
import {toastSuccess} from '@hopara/design-system/src/toast/Toast'
import {DataSourceContext} from './service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import MySQLImage from './images/mysql.png'
import PostgresImage from './images/postgres.png'
import SinglestoreImage from './images/singlestore.png'
import TimescaleImage from './images/timescale.png'
import DuckDbImage from './images/duckdb.png'
import SnowFlakeImage from './images/snowflake.png'
import JSImage from './images/js.png'
import { Logger } from '@hopara/internals'

const getCoverImageFromType = (type) => {
  switch (type) {
    case 'MYSQL':
      return MySQLImage
    case 'POSTGRES':
      return PostgresImage
    case 'SINGLESTORE':
      return SinglestoreImage
    case 'TIMESCALE':
      return TimescaleImage
    case 'DUCKDB':
      return DuckDbImage
    case 'SNOWFLAKE':
      return SnowFlakeImage
    case 'JS_FUNCTION':
      return JSImage
    default:
      return ''
  }
}

interface Props {
  dataSource: DataSource
  editClicked: (dataSource: DataSource) => void
  viewUrl: (dataSource: DataSource) => string
  onDeleted: (dataSource: DataSource) => void
  id?: string
}

export const DataSourceListItem = (props: Props) => {
  const theme = useTheme()
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string>('')

  const deleteClicked = async (dataSource: DataSource) => {
    try {
      setIsDeleting(true)
      await dataSourceContext.dataSourceService.delete(
        dataSource.name,
        authContext.authorization,
      )
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      props.onDeleted(dataSource)
      toastSuccess(i18n('DATA_SOURCE_DELETED_SUCCESSFULLY'))
    } catch (err: any) {
      Logger.error(err)
      setError(err?.message ?? i18n('UNKNOWN_ERROR'))
      setIsDeleting(false)
    }
  }

  const buttons: CardButton[] = []

  if (props.dataSource.isEditable()) {
    buttons.push({
      label: i18n('EDIT'),
      testId: 'edit-button',
      onClick: () => props.editClicked(props.dataSource),
    })
  }

  if (!props.dataSource.isReadOnly()) {
    buttons.push({
      label: i18n('DELETE'),
      color: 'error',
      testId: 'delete-button',
      onClick: () => setIsDeleteDialogOpen(true),
    })
  }

  return (<>
      <CardListItem
        id={props.id}
        testId="data-source"
        name={props.dataSource.name}
        icon={
          <div
            style={{
              color: theme.palette.spec.tonal.neutral[70],
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,.05) 1px, transparent 1px)',
              width: '100%',
              height: '100%',
              backgroundSize: '10px, 10px',
              backgroundBlendMode: 'multiply',
              mixBlendMode: 'multiply',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <img
              src={getCoverImageFromType(props.dataSource.getType())}
              style={{width: 120}}
            />
          </div>
        }
        href={props.viewUrl(props.dataSource)}
        buttons={buttons}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onDelete={() => deleteClicked(props.dataSource)}
        isDeleting={isDeleting}
        message={i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DATA_SOURCE', {name: props.dataSource.name})}
        error={error}
      />
    </>
  )
}
