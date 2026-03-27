import React from 'react'
import { styled } from '../theme'

const CanvasNavigationDividerContainer = styled('div', {name: 'CanvasNavigationDivider'})(() => {
  return {
    display: 'grid',
    placeItems: 'center',
    paddingInline: 2,
  }
})

const CanvasNavigationDividerVertical = styled('div', {name: 'CanvasNavigationDividerVertial'})(({theme}) => {
  return {
      backgroundColor: theme.palette.spec.borderColor,
      height: 18,
      width: 1,
      borderRadius: 1,
    }
  })

export const CanvasNavigationDivider = () => {
  return (
    <CanvasNavigationDividerContainer>
      <CanvasNavigationDividerVertical />
    </CanvasNavigationDividerContainer>
  )
}
