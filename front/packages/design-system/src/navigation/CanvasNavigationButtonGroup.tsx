import { styled } from '../theme'


export const CanvasNavigationButtonGroup = styled('div', { name: 'CanvasNavigationButtonGroup' })(({ theme }) => {
  return {
    'display': 'grid',
    'gridAutoFlow': 'row',
    'gap': 2,
    'borderRadius': 3,
    'padding': 0,
    'backgroundColor': theme.palette.spec.backgroundCanvasButton,
    'boxShadow': theme.palette.spec.shadowCanvasButton,
    'backdropFilter': theme.palette.spec.backgroundBlur,
    'width': 'min-content',
    'overflow': 'hidden',
    'scrollbarWidth': 'thin',
    'scrollbarColor': 'transparent transparent',
    '&::-webkit-scrollbar': {'width': 0},
    '&::-webkit-scrollbar-track': {'background': 'transparent'},
    '&::-webkit-scrollbar-thumb': {
      'backgroundColor': 'transparent',
    },
    '& a': {
      'padding': 4,
      'margin': 'auto',
    },
    '& button': {
      'borderRadius': 0,
      '&.horizontal': {
        'borderRadius': 1.75,
      },
    },
    '&.horizontal': {
      'gridAutoFlow': 'column',
      'padding': 2,
    },
    '&.rounded': {
      'borderRadius': '50%',
    },
    '&.rounded a': {
      'padding': 0,
    },
    '&.contextual': {
      'borderRadius': 8,
      'padding': 3,
      'boxShadow': '0 0 0 1px rgba(0,0,0,0.05), 0 1px 3px -0.5px rgba(0,0,0,0.20)',
      'overflow': 'visible',
    },
    '@media (max-height: 300px)': {
      'display': 'grid',
      '&.hideOnSmallViewport': {
        display: 'none',
      },
    },
  }
})
