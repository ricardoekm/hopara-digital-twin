import React from 'react'
import {omit} from 'lodash/fp'
import {
  TableLayerHeaderCell,
  TableLayerHeaderLabel,
  TableLayerHeaderLabelAria,
  TableLayerHeaderResizer,
  TableLayerHeaderSortLabel,
} from './TableView'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import {Column} from './Table'
import {Icon} from '../icons/Icon'
import {Tooltip} from '../tooltip/Tooltip'
import {Theme} from '../theme'

export const TableHeader = ({headerGroups, tableColumns, theme}: { headerGroups, tableColumns: Column[], theme: Theme }): JSX.Element => {
  return (
    <TableHead sx={{position: 'sticky', top: 0, backgroundColor: theme.palette.spec.background}}>
      {headerGroups.map((headerGroup, index) => (
        <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
          {headerGroup.headers.map((column, i) => {
            const cellProps = column.getHeaderProps(column.getSortByToggleProps())
            const tableColumn = tableColumns.find((c) => c.accessor === column.id)
            return (
              <TableLayerHeaderCell
                sortDirection={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : false}
                key={i}
                sx={{'--cellWidth': cellProps.style.width}}
              >
                <TableLayerHeaderSortLabel
                  key={cellProps.key}
                  {...omit(['style', 'key'], cellProps)}
                  active={column.isSorted}
                  direction={column.isSorted && column.isSortedDesc ? 'desc' : 'asc'}
                  sx={{'--cellWidth': cellProps.style.width}}
                >
                  <TableLayerHeaderLabel component="span" title={column.Header}>
                    {column.render('Header')}
                  </TableLayerHeaderLabel>
                  {tableColumn?.type && <Tooltip title={tableColumn.type.toString().toLowerCase()}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: '4px',
                      opacity: 0.5,
                    }}>
                      <Icon icon={`type-${tableColumn.type.toString().toLowerCase()}` as any} size="sm"/>
                    </div>
                  </Tooltip>}
                  {column.isSorted ? (
                    <TableLayerHeaderLabelAria component="span">
                      {column.isSortedDesc ? 'sorted descending' : 'sorted ascending'}
                    </TableLayerHeaderLabelAria>
                  ) : null}
                </TableLayerHeaderSortLabel>
                <TableLayerHeaderResizer
                  className={column.isResizing ? 'isResizing' : ''}
                  {...column.getResizerProps()}
                />
              </TableLayerHeaderCell>
            )
          })}
        </TableRow>
      ))
      }
    </TableHead>
  )
}
