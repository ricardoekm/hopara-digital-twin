import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { Image } from '../image/Image'
import {Theme, withTheme} from '../theme'
import { RgbaColor } from '@hopara/encoding'
import { TextField } from '../form'
import { PureComponent } from '../component/PureComponent'

export type DetailsLine = {
  title: string
  value?: string
  image?: string
  color?: RgbaColor
}

export type EditableDetailsLine = DetailsLine & {
  onChange?: (value) => void
}

interface Props {
  lines?: DetailsLine[]
  editableLines?: EditableDetailsLine[]
  theme: Theme
  collapsible?: boolean
}

const getRgbaString = (color?: RgbaColor) => {
  if (!color) {
    return 'inherit'
  }

  return `rgba(${color.join(',')})`
}

const DetailsTableItem = ({ line }) => {
  return (
    <TableRow
      component="tr"
      sx={{
        'display': 'table-row',
      }}
    >
      <TableCell
        component="th"
        sx={{
          display: 'table-cell',
          lineHeight: 1.5,
          padding: '8px 0px',
          fontWeight: '500',
          border: 'none',
          opacity: 0.66,
          wordBreak: 'break-word',
          hyphens: 'auto',
        }}
      >
        {line.title}
      </TableCell>
      <TableCell
      component="td"
        sx={{
          display: 'table-cell',
          overflowX: 'hidden',
          overflowY: 'auto',
          wordBreak: 'break-word',
          hyphens: 'auto',
          lineHeight: 1.5,
          padding: '8px 0 8px 16px',
          maxHeight: '40vh',
          border: 'none',
          fontWeight: '500',
        }}
      >
        {line.image &&
          <Image
            src={line.image}
            sx={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        }
        {line.onChange &&
          <TextField
            value={line.value}
            onChange={(e) => line.onChange(e.target.value)}
            debounce={1000}
            autoComplete='off'
            variant='outlined' />
        }
        {!line.image && !line.onChange &&
          <span
            style={{ color: getRgbaString(line.color) }}>
            {line.value}
          </span>
        }
      </TableCell>
    </TableRow>
  )
}

class DetailsTableClass extends PureComponent <Props> {
  hasLines() {
    return (this.props.lines && this.props.lines.length) ||
           (this.props.editableLines && this.props.editableLines.length)
  }

  render() {
    if (!this.hasLines()) return null
    const firstLineWithImage = this.props.lines?.find((line) => !!line.image)

    const editableLines = this.props.editableLines ?? []
    const regularLines = (this.props.lines ?? []).filter((line) => line.value || line.image && firstLineWithImage !== line)

    const allLines = [...editableLines, ...regularLines]

    return (
      <TableContainer
        component={Box}
        sx={{
          gridArea: 'table',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Table
          aria-label="row details"
          className={editableLines.length > 0 ? 'isEditing' : ''}
          sx={{
            'display': 'table',
            'fontSize': 12,
            'width': '100%',
            '&.isEditing th': {
              wordBreak: 'normal',
              hyphens: 'none',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '24ch',
            },
          }}
        >
          <TableBody
            sx={{
              '& tr': {
                borderBlockEnd: `1px solid ${this.props.theme.palette.spec.tableBorder}`,
              },
              '& tr:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            {allLines.map((line, i) => (
              <DetailsTableItem 
                line={line} 
                key={line.title + i} 
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

export const DetailsTable = withTheme<Props>(DetailsTableClass)
