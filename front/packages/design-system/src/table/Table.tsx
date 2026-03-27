import React from 'react'
import {omit} from 'lodash/fp'
import {useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable} from 'react-table'
import {useTheme} from '@mui/material/styles'
import {
  TableLayerBox,
  TableLayerContainer,
  TableLayerPaper,
  TableLayerTable,
  TableLayerTableCell,
  TableLayerTableCellBox,
} from './TableView'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import {TableHeader} from './TableHeader'
import {TablePagination} from './TablePagination'
import {PureComponent} from '../component/PureComponent'
import {Columns, ColumnType} from '@hopara/dataset'
import {TableField} from '@hopara/encoding'
import {Theme} from '../theme'

export type Column = {
  Header: string
  accessor: string
  type: ColumnType
}

type TableProps = {
  columns: Column[]
  rows: any
  valueFormatter?: (row, column) => string
}

const ColumnCell = ({value, column, valueFormatter}) => {
  return valueFormatter ? valueFormatter(value, column.id) : value
}

const TableLayout = ({columns, rows, valueFormatter}: TableProps): JSX.Element => {
  const theme = useTheme()
  const tableData = React.useMemo(
    () => rows,
    [rows],
  )

  const tableColumns = React.useMemo(
    () => columns,
    [columns],
  )

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 180,
      maxWidth: 400,
      Cell: ColumnCell,
    }),
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize,
    },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      defaultColumn,
      initialState: {
        pageSize: 20,
      },
      valueFormatter,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy,
    usePagination)

  return (
    <TableLayerBox data-testid="table">
      <TableLayerPaper>
        <TableLayerContainer>
          <TableLayerTable {...getTableProps()}>
            <TableHeader headerGroups={headerGroups} tableColumns={tableColumns} theme={theme as Theme} />
            <TableBody {...getTableBodyProps()}>
              {page?.map((row, index) => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, i) => {
                      const cellProps = cell.getCellProps()
                      const cellValue = valueFormatter ? valueFormatter(cell.value, cell.column.id) : cell.value
                      const cellTitle = typeof cellValue === 'string' || typeof cellValue === 'number' ? String(cellValue) : undefined
                      return (
                        <TableLayerTableCell
                          {...omit(['style'], cellProps)}
                          sx={{'--cellWidth': cellProps.style.width}}
                          key={i}
                        >
                          <TableLayerTableCellBox component="span" title={cellTitle}>
                            {cell.render('Cell')}
                          </TableLayerTableCellBox>
                        </TableLayerTableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </TableLayerTable>
        </TableLayerContainer>
        <TablePagination {...{
          gotoPage,
          pageIndex,
          pageSize,
          setPageSize,
          dataLength: tableData?.length,
        }} />
      </TableLayerPaper>
    </TableLayerBox>
  )
}

export class Table extends PureComponent<TableProps> {
  render() {
    return (
      <TableLayout
        rows={this.props.rows ?? []}
        columns={this.props.columns ?? []}
        valueFormatter={this.props.valueFormatter}/>
    )
  }
}

export const formatTableColumns = (columns?: Columns, fields?: TableField[]): Column[] => {
  if (!columns) return []
  if (fields?.length) {
    return fields.map((field) => {
      const column = columns.get(field.value.encoding.text.field)
      if (!column) return
      return {
        Header: field.title ?? column?.getName(),
        accessor: column?.getName(),
      }
    }).filter((tableColumn) => !!tableColumn) as Column[]
  }

  return columns.map((column) => {
    return {
      Header: column.getName(),
      accessor: column.getName(),
      type: column.getType(),
    }
  })
}
