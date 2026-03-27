import React from 'react'
import { Box, Typography } from '@mui/material'
import { Icon } from '@hopara/design-system/src/icons/Icon'
import { styled, useTheme } from '@hopara/design-system/src/theme'

interface Props {
  title: string
  onClick: Function
  expanded: boolean
  description?: string
}

const LegendTitleStyle = styled(Box, { name: 'LegendTitle' })(() => ({
  'marginBlockEnd': 0,
  '&.expanded': {
    marginBlockEnd: 8,
  },
}))

const ColorLegendButton = styled(Box, { name: 'ColorLegendButton' })({
  'opacity': 0.3,
  'height': 20,
}).withComponent('span')

export const LegendTitle = ({ title, onClick, expanded, description }: Props) => {
  const theme = useTheme()

  return (
    <LegendTitleStyle className={expanded ? 'expanded' : ''}>
      <Box sx={{
        'display': 'grid',
        'gridTemplateColumns': '1fr auto',
        'alignItems': expanded ? 'start' : 'center',
        'columnGap': 2,
        '&:hover': {
          color: theme.palette.spec.foregroundCanvasButtonHover,
          cursor: 'pointer',
        },
        '&:hover span': {
          opacity: theme.palette.mode === 'dark' ? 0.4 : 0.6,
        },
        '&:active': {
          color: theme.palette.spec.foregroundCanvasButton,
          opacity: 0.9,
        },
      }}>
        <Typography
          sx={{
            'typography': 'body2',
            'fontWeight': 600,
            'fontSize': 12.5,
            'cursor': 'pointer',
            'userSelect': 'none',

          }}
          onClick={() => onClick()}
        >
          {title}
        </Typography>
        {!expanded && (
          <ColorLegendButton onClick={() => onClick()}>
            <Icon icon={'color-legend-expand'} size={20} />
          </ColorLegendButton>
        )}
        {expanded && <ColorLegendButton onClick={() => onClick()}>
          <Icon icon={'color-legend-close'} size={20} />
        </ColorLegendButton>
        }
      </Box>
      {expanded && <Typography
        sx={{
          opacity: 0.5,
          typography: 'body2',
          gridColumn: '1 / -1',
          alignSelf: 'center',
        }}
      >
        {description}
      </Typography>
      }
    </LegendTitleStyle>
  )
}
