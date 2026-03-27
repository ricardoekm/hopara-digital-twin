import { Box } from '@mui/material'
import { styled } from '../theme'

export const
DetailsStyle = styled(Box, { name: 'Details' })(
  () => ({
    'display': 'grid',
    'gridTemplateAreas': '"header" "buttons" "links" "table" "editor"',
    'gridTemplateRows': 'min-content auto auto auto auto',
    'width': '100%',
    'overflowX': 'visible',
    'padding': '8px 16px',
    'paddingBlockStart': 0,
    '&.isTitleBarFloating': {
      'paddingBlockStart': 16,
    },
    '&.isCollapsed': {
      'padding': 0,
    },
  }),
)

export const ActionsBox = styled(Box, { name: 'ActionsBox' })({
  'display': 'flex',
  'placeItems': 'center',
  'justifyContent': 'center',
  'gap': 6,
  'flexWrap': 'wrap',
  'gridArea': 'buttons',
  'margin': '16px 16px 10px',
  '&.isThumbImage': {
    margin: '9px 16px 12px',
  },
})

export const DetailsHeaderStyle = styled(Box, { name: 'DetailsHeaderStyle' })(() => ({
  'display': 'grid',
  'gridArea': 'header',
  'gridTemplateColumns': '80px 1fr',
  'gap': 12,
  'width': '100%',
  'alignItems': 'center',
  '&.isThumbImage': {
    'gridTemplateColumns': '1fr',
    'gap': 0,
  },
}))
