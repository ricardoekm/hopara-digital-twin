import {DataSourceContext} from '../service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {DataFile} from '../DataFile'
import {ListListSkeleton} from '@hopara/design-system/src/card-list/ListListSkeleton'
import {i18n} from '@hopara/i18n'
import {ListList} from '@hopara/design-system/src/card-list/ListList'
import {FileListItem} from '../FileListItem'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import { useContext, useEffect } from 'react'
import React from 'react'
import { Box } from '@mui/material'
import { DataSource, DataSourceType } from '../DataSource'

export const ListFiles = (props: { dataSource?: DataSource, dataSourceName: string }) => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)

  const [loadingDataFiles, setLoadingDataFiles] = React.useState(true)
  const [dataFiles, setDataFiles] = React.useState<DataFile[]>([])
  const [dataFilesError, setDataFilesError] = React.useState<string>('')

  useEffect(() => {
    setLoadingDataFiles(true);
    (async () => {
      if (!props.dataSource) return
      try {
        if (props.dataSource.type === 'DUCKDB') {
          const dataFiles = await dataSourceContext.dataFileService.list(
            props.dataSourceName,
            authContext.authorization,
          )
          setDataFiles(dataFiles)
        }
      } catch (err: any) {
        setDataFilesError(err.message)
      }
      setLoadingDataFiles(false)
    })()
  }, [props.dataSource])

  return (
    <Box
      sx={{
        padding: '0 2em 2em',
        display: 'grid',
        gridAutoFlow: 'row',
      }}
    >
      {loadingDataFiles ? (
        <ListListSkeleton count={5} testId="dataFilesLoading"/>
      ) : dataFiles.length === 0 ? (
        <Box sx={{width: 'max-content', justifySelf: 'center'}}>
          {props.dataSource?.getType() === DataSourceType.JS_FUNCTION ? i18n('NO_FUNCTIONS_FOUND') : i18n('NO_DATA_FILES_FOUND')}
        </Box>
      ) : (
        <ListList data-testid="dataFilesContent">
          {dataFiles.map((dataFile) => (
            <FileListItem
              type={props.dataSource?.getType() === DataSourceType.JS_FUNCTION ? 'function' : 'file'}
              key={dataFile.name}
              file={dataFile}
              onDeleted={() => {
                setDataFiles(dataFiles.filter((f) => f.name !== dataFile.name))
              }}
              dataSourceName={props.dataSourceName}
            />
          ))}
        </ListList>
      )}
      <ErrorPanel testId="dataFilesError" error={dataFilesError}/>
    </Box>
  )
}
