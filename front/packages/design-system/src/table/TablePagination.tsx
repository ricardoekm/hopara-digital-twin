import React from 'react'
import { TableLayerPagination } from './TableView'

export const TablePagination = ({
  gotoPage,
  pageIndex,
  pageSize,
  setPageSize,
  dataLength,
}) => {
  return (
    <TableLayerPagination
      rowsPerPageOptions={[10, 20, 50, 100]}
      component="div"
      count={dataLength}
      rowsPerPage={pageSize}
      page={pageIndex}
      onPageChange={(e, page) => gotoPage(page)}
      onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
      sx={{}}
    />
  )
}
