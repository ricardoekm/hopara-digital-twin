import {styled} from '../theme'
import {css, keyframes} from '@emotion/react'

const dotBricksKeyframes = keyframes`
    0% {
        box-shadow: 9991px -16px 0 0, 9991px 0 0 0, 10007px 0 0 0
    }
    8.333% {
        box-shadow: 10007px -16px 0 0, 9991px 0 0 0, 10007px 0 0 0
    }
    16.667% {
        box-shadow: 10007px -16px 0 0, 9991px -16px 0 0, 10007px 0 0 0
    }
    25% {
        box-shadow: 10007px -16px 0 0, 9991px -16px 0 0, 9991px 0 0 0
    }
    33.333% {
        box-shadow: 10007px 0 0 0, 9991px -16px 0 0, 9991px 0 0 0
    }
    41.667% {
        box-shadow: 10007px 0 0 0, 10007px -16px 0 0, 9991px 0 0 0
    }
    50% {
        box-shadow: 10007px 0 0 0, 10007px -16px 0 0, 9991px -16px 0 0
    }
    58.333% {
        box-shadow: 9991px 0 0 0, 10007px -16px 0 0, 9991px -16px 0 0
    }
    66.666% {
        box-shadow: 9991px 0 0 0, 10007px 0 0 0, 9991px -16px 0 0
    }
    75% {
        box-shadow: 9991px 0 0 0, 10007px 0 0 0, 10007px -16px 0 0
    }
    83.333% {
        box-shadow: 9991px -16px 0 0, 10007px 0 0 0, 10007px -16px 0 0
    }
    91.667% {
        box-shadow: 9991px -16px 0 0, 9991px 0 0 0, 10007px -16px 0 0
    }
    100% {
        box-shadow: 9991px -16px 0 0, 9991px 0 0 0, 10007px 0 0 0
    }
`

export const LoadingSpinnerView = styled('div', {name: 'LoadingSpinnerView'})(() => {
  return [css({
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'zIndex': '9000',
    '&.fullscreen': {
      'width': '100vw',
      'height': '100vh',
      '&.relative': {
        'width': '100%',
        'height': '100%',
      },
    },
  })]
})

export const LoadingSpinnerLoader = styled('div', {name: 'LoadingSpinnerLoader'})({
  position: 'relative',
  width: '10px',
  height: '10px',
})

export const LoadingSpinnerSpinner = styled('div', {name: 'LoadingSpinnerSpinner'})(({theme}) => ({
  position: 'relative',
  top: '8px',
  left: '-9999px',
  width: '10px',
  height: '10px',
  borderRadius: '5px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  boxShadow: `9991px -16px 0 0, 9991px 0 0 0, 10007px 0 0 0`,
  animationName: dotBricksKeyframes,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease',
}))
