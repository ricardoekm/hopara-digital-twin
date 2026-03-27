import React from 'react'
import { styled as muiStyled } from '@mui/material/styles'
import { Tabs, TabsProps } from '@mui/material'
import { Theme } from '../theme/Theme'

const DetailsTabsStyle = muiStyled(Tabs)<{ theme?: Theme }>(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    margin: 8,
    padding: 5,
    background: theme?.palette.spec.backgroundObjectEditorTabContainer,
    height: 'fit-content',
    borderRadius: 10,
  },
  '& .MuiTab-root': {
    'minWidth': 'auto',
    'width': '50%',
    'paddingBlock': 4,
    'border': 'none',
    'borderRadius': '5px',
    'transition': 'none',
    'textTransform': 'none',
    'fontSize': 12.5,
    'fontWeight': 500,
    'lineHeight': 'revert',
    'color': theme?.palette.text.primary,
    'background': 'transparent',
    'minHeight': '28px !important',
    '&:hover': {
      opacity: 0.75,
    },
    '&.Mui-selected': {
      'color': theme?.palette.text.primary,
      'boxShadow': theme?.palette.spec.shadowCanvasButton,
      'background': theme?.palette.spec.backgroundObjectEditorTab,
      'fontWeight': 600,
    },
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

export type DetailsTabsProps = TabsProps

export const DetailsTabs: React.FC<DetailsTabsProps> = (props) => {
  return <DetailsTabsStyle {...props} />
}

export default DetailsTabs
