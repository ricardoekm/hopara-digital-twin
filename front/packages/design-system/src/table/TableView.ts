import {styled} from '../theme'
import {css} from '@emotion/react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'

export const TableLayerBox = styled(Box, {name: 'TableLayerBox'})(({theme}) => ({
  width: '100%',
  height: '100%',
  borderTop: `1px solid ${theme.palette.spec.borderColor}`,
})) 

export const TableLayerPaper = styled(Box, {name: 'TableLayerPaper'})(({theme}) => ({
  width: '100%',
  height: '100%',
  mb: 2,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.spec.background,
}))

export const TableLayerContainer = styled(TableContainer, {name: 'TableLayerContainer'})({
  overflow: 'auto',
  flex: '1 1',
})

export const TableLayerTable = styled(Table, {name: 'TableLayerTable'})({
  position: 'relative',
})

export const TableLayerTableCell = styled(TableCell, {name: 'TableLayerTable'})(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: 'var(--cellWidth)',
}))

export const TableLayerTableCellBox = styled(Box, {name: 'TableLayerTableCellBox'})({
  display: 'inline-block',
  overflow: 'hidden',
  width: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const TableLayerHeaderCell = styled(TableCell, {name: 'TableLayerHeaderCell'})({
  'width': 'var(--cellWidth)',
  'position': 'relative',
})

export const TableLayerHeaderSortLabel = styled(TableSortLabel, {name: 'TableLayerHeaderSortLabel'})(() => ({
  display: undefined,
  overflow: 'hidden',
  width: 'var(--cellWidth)',
}))

export const TableLayerHeaderLabel = styled(Box, {name: 'TableLayerHeaderLabel'})({
  display: 'inline-block',
  overflow: 'hidden',
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const TableLayerHeaderLabelAria = styled(Box, {name: 'TableLayerHeaderLabelAria'})({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})

export const TableLayerHeaderResizer = styled('div', {name: 'TableLayerHeaderResizer'})((props) => {
  return css({
    'alignItems': 'center',
    'display': 'flex',
    'height': '70%',
    'justifyContent': 'center',
    'position': 'absolute',
    'right': 3,
    'top': 0,
    'touchAction': 'none',
    'transform': 'translate(50%, 15%)',
    'width': 10,
    'zIndex': 3,

    ':before': {
      borderLeft: `1px solid ${props.theme.palette.spec.borderColor}`,
      content: '""',
      height: '100%',
      left: '50%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      transition: 'border 0.2s ease',
    },

    ':after': {
      background: props.theme.palette.spec.borderColor,
      border: `1px solid ${props.theme.palette.spec.borderColor}`,
      borderRadius: '50%',
      content: '""',
      height: 6,
      transition: 'border 0.2s ease',
      width: 6,
      zIndex: 2,
    },

    ':hover:before': {
      borderColor: props.theme.palette.primary.main,
    },
    ':hover:after': {
      borderColor: props.theme.palette.primary.main,
    },

    '&.isResizing': {
      ':before': {
        borderColor: props.theme.palette.primary.main,
      },
      ':after': {
        borderColor: props.theme.palette.primary.main,
      },
    },
  })
})

export const TableLayerPagination = styled(TablePagination, {name: 'TableLayerPagination'})<{ component }>((props) => ({
  borderTop: `1px solid ${props.theme.palette.spec.borderColor}`,
}))
