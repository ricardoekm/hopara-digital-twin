import { css } from '@emotion/react'
import { styled } from '@hopara/design-system/src/theme'

export const LegendView = styled('div', { name: 'LegendView' })(({ theme }) => {
  return css({
    'color': theme.palette.spec.foregroundCanvasButton,
    'backdropFilter': theme.palette.spec.backgroundBlur,
    'backgroundColor': theme.palette.spec.backgroundCanvasButton,
    'borderRadius': '6px',
    'bottom': `${theme.shape.paddingInner + 30}px`,
    'boxShadow': theme.palette.spec.shadowCanvasButton,
    'fontSize': theme.typography.fontSize,
    'left': 'auto',
    'opacity': '0',
    'overflow': 'hidden',
    'paddingBlock': '6px',
    'paddingInline': '10px 8px',
    'pointerEvents': 'none',
    'transform': 'scale(0.95)',
    'transformOrigin': 'center bottom',
    'transition': 'transform 200ms ease-out, opacity 200ms ease-out',
    'maxWidth': 200,
    'minWidth': 120,
    'zIndex': 99,
    'gridArea': 'legend',
    'placeSelf': 'end',
    'marginBlock': '0px 32px',
    'marginInline': '0px 8px',
    '&.isWhiteboard': {
      'marginBlock': '0px 8px',
    },
    '&.expanded': {
      'borderRadius': '8px',
      'paddingBlock': '8px',
      'maxWidth': 280,
    },
    '&.isChart': {
      'bottom': 'auto',
      'left': '74px',
      'transformOrigin': 'center top',
      'gridArea': 'legend-chart',
      'placeSelf': 'start',
      'marginBlock': '4px 0px',
      'marginInline': '2px 0px',
    },
    '&.visible': {
      'opacity': '1',
      'pointerEvents': 'auto',
      'transform': 'scale(1)',
    },
    '& .LegendViewBox': {
      transform: 'translate(0, 0)',
    },
    '& text': {
      'fontSize': theme.typography.body2.fontSize,
      'fontFamily': theme.typography.body2.fontFamily,
      'fill': theme.palette.spec.foregroundCanvasButton,
    },
    '& .legendTitle': {
      display: 'none',
    },
    '& .role-legend-title': {
      display: 'none',
    },
    '& .role-legend-entry > g': {},
    '& .role-mark': {
      display: 'none',
    },
    '& .role-legend > g': {},
    '& .legendCells': {
      opacity: 0,
    },
    '&.expanded .legendCells': {
      opacity: 1,
      transform: 'translate(5px, 6px)',
    },
    '&.expanded .role-legend-entry': {
      opacity: 1,
    },
  })
})

export const LegendViewContent = styled('div', { name: 'LegendViewContent' })(() => ({
  'overflow': 'hidden',
}))
