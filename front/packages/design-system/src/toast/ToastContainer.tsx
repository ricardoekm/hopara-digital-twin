import React, { useEffect } from 'react'
import {Toaster} from 'sonner'
import {useTheme} from '../theme'

export const ToastContainer = () => {
  const theme = useTheme()

  // Cores baseadas no tema do projeto (igual ao LayerHelper)
  const foregroundColor = theme.palette.spec.foregroundCanvasButton
  const backgroundColor = theme.palette.spec.backgroundCanvasButton
  const boxShadow = theme.palette.spec.shadowCanvasButton
  const backdropFilter = theme.palette.spec.backgroundBlur
  const errorColor = theme.palette.error.main
  const successColor = theme.palette.spec.success
  const infoColor = theme.palette.primary.main

  // Inject CSS styles for toast colors and icons
  useEffect(() => {
    const styleId = 'toast-styles'

    // Remove existing style if it exists
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    // Create and inject new style
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .toast-container [data-type="error"] {
        color: ${errorColor} !important;
      }
      .toast-container [data-type="error"] svg {
        color: ${errorColor} !important;
        fill: ${errorColor} !important;
      }
      .toast-container [data-type="success"] svg {
        color: ${successColor} !important;
        fill: ${successColor} !important;
      }
      .toast-container [data-type="info"] svg {
        color: ${infoColor} !important;
        fill: ${infoColor} !important;
      }
    `
    document.head.appendChild(style)

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById(styleId)
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [errorColor, successColor, infoColor])

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors={false}
        closeButton={false}
        duration={4000}
        visibleToasts={3}
        toastOptions={{
          style: {
            color: foregroundColor,
            backgroundColor,
            backdropFilter,
            boxShadow,
            border: 'none',
            borderRadius: '4px',
          }
        }}
        className="toast-container"
      />
    </>
  )
}
