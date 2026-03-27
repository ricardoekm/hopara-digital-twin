import { keyframes } from '@emotion/react'

export const loadingRotation = keyframes`
  0% {
    transform: rotate(0deg);
    transform-origin: center;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: center;
  }
`
