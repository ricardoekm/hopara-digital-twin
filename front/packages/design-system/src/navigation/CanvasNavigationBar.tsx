import { styled } from '../theme'

export const CanvasNavigationBar = styled('nav', {name: 'CanvasNavigationBar'})(() => {
  return {
    'gridArea': 'var(--gridArea)',
    'zIndex': 1,
    'display': 'grid',
    'alignContent': 'start',
    'gridAutoFlow': 'row',
    'gap': 3,
    'maxHeight': '100%',
    'maxWidth': '100%',
    'overflowX': 'visible',
    'overflowY': 'auto',
    'padding': '1px',
    'margin': '3px',
    'scrollbarWidth': 'thin',
    'position': 'relative',
    'scrollbarColor': 'transparent transparent',
    '&::-webkit-scrollbar': {'width': 0},
    '&::-webkit-scrollbar-track': {'background': 'transparent'},
    '&::-webkit-scrollbar-thumb': {
      'backgroundColor': 'transparent',
    },
    '@media print': {
      'display': 'none',
    },
    '&.horizontal': {
      'gridAutoFlow': 'column',
      'overflow': 'visible',
      'margin': '3px 0',
    },
    '&.canvasNavigationBarisVisible': {
        opacity: 1,
        maxWidth: '48px',
        width: 'fit-content',
        transition: 'opacity 400ms ease-out 200ms, max-width 400ms ease-out',
    },
    '&.canvasNavigationBarisHidden': {
        opacity: 0,
        maxWidth: 0,
        width: 'fit-content',
        transition: 'opacity 400ms ease-out, max-width 400ms ease-out 250ms',
    }
  }
})
