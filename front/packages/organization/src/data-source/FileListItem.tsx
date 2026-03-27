import {Icon} from '@hopara/design-system/src/icons/Icon'
import {i18n} from '@hopara/i18n'
import {ListListItem} from '@hopara/design-system/src/card-list/ListListItem'
import {toastError, toastSuccess} from '@hopara/design-system/src/toast/Toast'
import React, {useContext} from 'react'
import {DataSourceContext} from './service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {DataFile} from './DataFile'
import {fileMenuFactory} from './FileMenu'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'

interface Props {
  type?: 'file' | 'function'
  file: DataFile
  onDeleted: (file: DataFile) => void
  dataSourceName: string
}

export const FileListItem = (props: Props) => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)

  const deleteClicked = async (file: DataFile) => {
    try {
      await dataSourceContext.dataFileService.delete(
        file.name,
        props.dataSourceName,
        authContext.authorization,
      )
      toastSuccess(i18n('DATA_FILE_DELETED_SUCCESSFULLY'))
      props.onDeleted(file)
    } catch (err: any) {
      toastError(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  return <>
    <ListListItem
      name={props.file.name}
      icon={<Icon icon="document" size="md"/>}
      menuItems={fileMenuFactory(props.file.name, {
        onDownloadClick: () => {
          dataSourceContext.dataFileService.download(props.file, authContext.authorization)
        },
        onDeleteClick: async () => {
          await deleteClicked(props.file)
        },
      })}
      href={pageNavigation.getUrl(props.type === 'function' ? PageType.EditFunction : PageType.EditDataFile, {dataSourceName: props.dataSourceName, name: props.file.name})}
    />
  </>
}
