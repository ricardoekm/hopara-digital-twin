import React from 'react'
import { i18n } from '@hopara/i18n'
import { Typography, Box } from '@mui/material'
import { Icon, HoparaIconKey } from '@hopara/design-system/src/icons/Icon'
import { styled } from '@hopara/design-system/src/theme'
import { HelperButton } from '@hopara/design-system/src/HelperButton'

export enum EmptyStateType {
  NO_LAYERS = 'NO_LAYERS',
  NO_ROWS = 'NO_ROWS',
  NO_ROWS_CHART = 'NO_ROWS_CHART'
}

export interface CanvasEmptyStateConfig {
  translationKey: 'EMPTY_CANVAS_NO_LAYERS' | 'EMPTY_CANVAS_NO_ROWS' | 'EMPTY_CANVAS_NO_ROWS_CHART'
  icon: HoparaIconKey
}

export const CANVAS_EMPTY_STATES: Record<EmptyStateType, CanvasEmptyStateConfig> = {
  NO_LAYERS: {
    translationKey: 'EMPTY_CANVAS_NO_LAYERS',
    icon: 'layers',
  },
  NO_ROWS: {
    translationKey: 'EMPTY_CANVAS_NO_ROWS',
    icon: 'scene-builder',
  },
  NO_ROWS_CHART: {
    translationKey: 'EMPTY_CANVAS_NO_ROWS_CHART',
    icon: 'database',
  },
} as const

interface Props {
  type: EmptyStateType
  isTopAligned?: boolean
}

const EmptyStateBox = styled(Box, { name: 'EmptyStateBox' })(({ theme }) => ({
  'display': 'grid',
  'placeItems': 'center',
  'textAlign': 'center',
  'color': theme.palette.spec.tonal.neutral[0],
  'gap': 8,
  'transform': 'translateY(-50%)',
  'zIndex': 1,

  '&.isTopAligned': {
    transform: 'translateY(0)',
    alignSelf: 'start',
    gridTemplateColumns: 'auto auto auto',
    gap: 8,
    padding: '12px 2px 12px 12px',
    borderRadius: '4px',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.spec.backgroundCanvasButton,
    backdropFilter: theme.palette.spec.backgroundBlur,
    boxShadow: theme.palette.spec.shadowCanvasButton,
    marginTop: 4,
  },
}))

export const CanvasEmptyState: React.FC<Props> = ({ type, isTopAligned = false }) => {
  const config = CANVAS_EMPTY_STATES[type]

  return (
    <EmptyStateBox className={isTopAligned ? 'isTopAligned' : ''}>
      <Icon
        icon={config.icon as HoparaIconKey}
        size={isTopAligned ? 24 : 32}
      />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        placeItems: 'center',
        gap: isTopAligned ? 6 : 3,
      }}>
      <Typography
        fontSize={isTopAligned ? 14 : 18}
        fontWeight={600}
      >
        {i18n(config.translationKey)}
      </Typography>
      <HelperButton
        description={i18n(config.translationKey + '_HELPER' as any)}
        />
        </Box>
    </EmptyStateBox>
  )
}

