import React from 'react'
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import {Theme, withTheme} from '../theme'
import { RgbaColor } from '@hopara/encoding'
import { PureComponent } from '../component/PureComponent'
import { Icon } from '../icons/Icon'

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
  pdfs: { name: string, url: string }[]
  theme: Theme
}

class DetailsPDFsClass extends PureComponent <Props> {
  render() {
    if (!this.props.pdfs) return null

    return (
      <TableContainer
        component={Box}
        sx={{gridArea: 'links', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4, marginTop: 8}}
      >
        <Table
          aria-label="row details"
          sx={{ display: 'table', fontSize: 12, width: '100%' }}
        >
          <TableBody
            sx={{
              '& tr': {borderBlockEnd: `1px solid ${this.props.theme.palette.spec.tableBorder}`},
              '& tr:last-child': { borderBottom: 'none' },
            }}
          >
          {this.props.pdfs.map((pdf, i) => (
            <TableRow key={i}>
              <TableCell
                component="td"
                  sx={{
                  padding: '4px 0px',
                  fontWeight: '500',
                  opacity: 0.66,
                  whiteSpace: 'nowrap',
                  border: 'none',
                }}
              >
                <Link href={pdf.url} target="_blank" rel="noopener noreferrer" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                }}>
                  <Icon icon="pdf" />
                  {pdf.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

export const DetailsPDFs = withTheme<Props>(DetailsPDFsClass)
