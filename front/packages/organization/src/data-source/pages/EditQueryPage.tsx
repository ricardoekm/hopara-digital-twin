import React, {useState, useRef, useCallback, useEffect} from 'react'
import {LoadingSpinner} from '@hopara/design-system/src/loading-spinner/Spinner'
import {styled, useTheme} from '@hopara/design-system/src/theme'
import {Columns, ColumnType, formatValue as columnTypeFormatValue} from '@hopara/dataset'
import {Box, FormLabel} from '@mui/material'
import {BarButton, TitleBar} from '@hopara/design-system/src/title-bar/TitleBar'
import {i18n} from '@hopara/i18n'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {TextField} from '@hopara/design-system/src'
import {SqlEditor} from '@hopara/design-system/src/code-editor/SqlEditor'
import {CodeEditorFontSize} from '@hopara/design-system/src/code-editor/CodeEditor'
import { acceleratorForPlatform } from '@hopara/design-system/src/shortcuts'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {Table} from '@hopara/design-system/src/table/Table'
import {Query} from '../Query'
import JsonWithSchemaEditor from '@hopara/design-system/src/code-editor/JsonWithSchemaEditor'
import {queryMenuFactory} from '../QueryMenu'
import {FilterableSelect} from '@hopara/design-system/src/form/FilterableSelect'
import {useQueryPageShortcuts} from './EditQueryPageShortcuts'

const allowedColumnTypes = [ColumnType.STRING, ColumnType.INTEGER]

export interface Metadata {
  columns: { name: string, type: ColumnType }[]
  tables: string[]
  error?: string
}

type Props = {
  loading: boolean
  saving: boolean
  running: boolean
  valid: boolean
  queryNameFromURL?: string
  queryColumns: Columns
  errorMessage?: string
  queryResult?: { columns: any, rows: any }
  onBack: () => void
  onSetQueryName: (e: any) => void
  onRun: () => void
  onSave: () => void
  onSetSQL: (e: any) => void
  onSetPrimaryKeyColumn: (value: string) => void
  metadataLoading: boolean
  metadata: Metadata
  onToggleAdvancedMode: () => void
  advancedMode: boolean
  query: Query
  onSetQuery: (query: Query) => void
  canRunQuery: boolean
  onDelete: () => void
  onDuplicateQuery: () => void
  queryError?: string
  onQueryColumnOpen: () => void
}

const QueryForm = styled('form', {name: 'EditQueryPageForm'})({
  gridArea: 'container',
  display: 'grid',
  gridTemplateColumns: '1fr 250px',
  gridTemplateRows: 'var(--query-height, 0.75fr) 8px var(--result-height, 1.25fr)',
  gridTemplateAreas: `
    'sql form'
    'divider divider'
    'result result'
  `,
  columnGap: 16,
  height: '100%',
  minHeight: 0,
})

const QueryArea = styled('div', {name: 'QueryArea'})({
  gridArea: 'sql',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflow: 'hidden',
})

const ResultArea = styled('div', {name: 'ResultArea'})({
  gridArea: 'result',
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
})

const ResizeHandle = styled('div', {name: 'ResizeHandle'})(({theme}) => ({
  'gridArea': 'divider',
  'height': 8,
  'cursor': 'row-resize',
  'backgroundColor': theme.palette.spec.borderColor,
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'transition': 'background-color 0.2s ease',
  'userSelect': 'none',
  'position': 'relative',
  
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  
  '&.resizing': {
    backgroundColor: theme.palette.primary.main,
  },
  
  '&::after': {
    content: '""',
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
  },

  '&.resizing::after': {
    backgroundColor: theme.palette.spec.borderColor,
  },
  '&:hover::after': {
    backgroundColor: theme.palette.spec.borderColor,
  },

}))

const $schema = {
  properties: {
    name: {
      type: 'string',
    },
    query: {
      type: 'string',
    },
    dataSource: {
      type: 'string',
    },
    primaryKey: {
      type: 'string',
    },
    writeTable: {
      type: 'string',
    },
    versionColumn: {
      type: 'string',
    },
    writeLevel: {
      type: 'string',
      enum: [
        'NONE',
        'UPDATE',
        'INSERT',
      ],
    },
    filterTables: {type: 'boolean'},
    smartLoad: {type: 'boolean'},
    upsert: {type: 'boolean'},
    editableColumns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
        },
        required: ['name'],
      },
    },
  },
  required: ['name', 'query', 'dataSource'],
}


export const EditQueryPage = (props: Props) => {
  const theme = useTheme()
  const [queryHeight, setQueryHeight] = useState(0.375) // 37.5% (0.75fr out of 2fr total)
  const [isResizing, setIsResizing] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
  useQueryPageShortcuts({onRunCmd: props.onRun, onSaveCmd: props.onSave})

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault() // Prevent text selection
    setIsResizing(true)
  }, [])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !formRef.current) return
    
    e.preventDefault() // Prevent text selection during drag
    
    const formRect = formRef.current.getBoundingClientRect()
    const relativeY = e.clientY - formRect.top
    const percentage = relativeY / formRect.height
    
    const clampedPercentage = Math.min(Math.max(percentage, 0.2), 0.8)
    setQueryHeight(clampedPercentage)
  }, [isResizing])
  
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])
  
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
      document.documentElement.style.userSelect = 'none'
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.documentElement.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (props.loading) {
    return <Box
      sx={{
        gridArea: 'container',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}><LoadingSpinner/></Box>
  }

  const disabled = props.running || props.saving || !props.valid
  const buttons = [] as BarButton[]

  if (!props.advancedMode) {
    buttons.push({
      testId: 'run-button',
      disabled: !props.canRunQuery,
      onClick: props.onRun,
      primary: false,
      label: props.running ? i18n('RUNNING_ELLIPSIS') : i18n('RUN'),
      responsiveIcon: <Icon icon="play"/>,
      tooltip: acceleratorForPlatform('CmdOrCtrl+Enter')
    }, {
      testId: 'save-button',
      primary: true,
      disabled,
      onClick: props.onSave,
      label: props.saving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE'),
      responsiveIcon: <Icon icon="check"/>,
      tooltip: acceleratorForPlatform('CmdOrCtrl+S')
    })
  }

  const menuItems = !props.advancedMode ? queryMenuFactory(props.query.name, {
    onAdvancedModeClick: () => {
      props.onToggleAdvancedMode()
    },
    onDuplicateQuery: () => {
      props.onDuplicateQuery()
    },
    onDeleteClick: async () => {
      props.onDelete()
    },
    disableDuplicateAndDelete: !props.queryNameFromURL,
  }) : []

  let options = props.metadata?.columns
    .filter((column) => allowedColumnTypes.includes(column.type))
    .map((column) => ({
      value: column.name,
      label: column.name,
    })) ?? []

  if (props.metadataLoading) {
    options = [{value: 'loading', label: i18n('LOADING_ELLIPSIS')}]
  }


  return (<Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gridArea: 'container',
      minHeight: 0,
    }}>
      <TitleBar
        title={props.queryNameFromURL
          ? i18n('EDIT_QUERY') + ': ' + props.query.name
          : (props.query?.name
              ? i18n('EDIT_QUERY') + ': ' + props.query.name
              : i18n('NEW_QUERY'))}
        titleTestId={props.queryNameFromURL ? 'edit-title' : 'create-title'}
        onBack={props.onBack}
        buttons={buttons}
        menuItems={menuItems}
      />

      {props.advancedMode && (
        <JsonWithSchemaEditor
          onChange={(query) => {
            props.onSetQuery(new Query(query))
          }}
          value={props.query}
          schema={$schema}
          errorMessage={i18n('INVALID_QUERY')}
          onCtrlEnter={props.onRun}
          onCtrlS={props.onSave}
        />
      )}
      {!props.advancedMode &&
        <QueryForm 
          ref={formRef}
          noValidate 
          autoComplete="off"
          style={{
            '--query-height': `${queryHeight}fr`,
            '--result-height': `${1 - queryHeight}fr`,
          } as React.CSSProperties}
        >
          <Box sx={{
            gridArea: 'form',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingInlineEnd: 24,
          }}>
            <TextField
              value={props.query.name}
              onSetValue={(value) => {
                props.onSetQueryName(value.trim())
              }}
              label={i18n('QUERY_NAME') + ' *'}
              disabled={props.saving || !!props.queryNameFromURL}
              testId="name"
              size="small"
              labelLayout="vertical"
            />
            <FormLabel>{i18n('PRIMARY_KEY_COLUMN')}</FormLabel>
            <FilterableSelect
              placeholder={props.metadataLoading ? i18n('LOADING_ELLIPSIS') : i18n('SELECT_ELLIPSIS')}
              disabled={props.saving}
              testId="query-column"
              value={props.query.primaryKey}
              onOpen={props.onQueryColumnOpen}
              onChange={(event) => {
                props.onSetPrimaryKeyColumn(event.target.value)
              }}
              options={options}
            />
          </Box>

          <QueryArea>
            <SqlEditor
              onChange={props.onSetSQL}
              fontSize={CodeEditorFontSize.Medium}
              value={props.query.query}
              error={props.queryError}
              onCtrlEnter={props.onRun}
              onCtrlS={props.onSave}
            />
          </QueryArea>

          <ResizeHandle 
            onMouseDown={handleMouseDown}
            className={isResizing ? 'resizing' : ''}
          />

          <ResultArea>
            {props.errorMessage && <ErrorPanel fullWidth error={props.errorMessage}/>}
            {props.queryResult && !props.errorMessage && !props.running && (
              <Table
                columns={props.queryResult.columns}
                rows={props.queryResult.rows}
                valueFormatter={(value, columnName) => {
                  const column = props.queryColumns.get(columnName)
                  if (!column) return String(value)
                  return columnTypeFormatValue(value, column.getType())
                }}
              />
            )}
            {!props.queryResult && !props.errorMessage && (!props.running) && (
              <div style={{
                margin: 'auto',
                width: '100%',
                height: '100%',
                display: 'flex',
                placeItems: 'center',
                placeContent: 'center',
                backgroundColor: theme.palette.spec.inputBackground,
                borderRadius: '0.5em',
              }}>
                {i18n('RUN_QUERY_TO_SEE_RESULTS')}
              </div>
            )}
            {props.running && (<Box sx={{
              margin: 'auto',
              width: '100%',
              height: '100%',
              display: 'flex',
              placeItems: 'center',
              placeContent: 'center',
            }}><LoadingSpinner/></Box>)}
          </ResultArea>
        </QueryForm>
      }
    </Box>
  )
}
