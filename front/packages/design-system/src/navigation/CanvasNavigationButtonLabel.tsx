import React from 'react'
import { styled } from '../theme'

const CanvasNavigationLabel = styled('span', {name: 'CanvasNavigationLabelContainer'})(() => {
  return {
    paddingInline: 5,
  }
})

export const CanvasNavigationButtonLabel = ({ children }) => {
  return (
    <CanvasNavigationLabel>
        {children}
    </CanvasNavigationLabel>
  )
}
