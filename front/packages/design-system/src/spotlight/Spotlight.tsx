import {Box} from '@mui/material'
import React from 'react'
import './Spotlight.css'
import {SpotlightPortal} from './SpotlightPortal'
import { PureComponent } from '../component/PureComponent'
import { Theme, withTheme } from '../theme'

function renderConfig(
  ctx: CanvasRenderingContext2D,
  elementId: string | undefined,
) {
  const el = document.getElementById(elementId!)
  if (el) {
    const padding = 12
    const radius = 12
    const rect = el.getBoundingClientRect()

    const top = rect.top - padding
    const left = rect.left - padding

    const width = rect.width + padding * 2
    const height = rect.height + padding * 2
    ctx.beginPath()
    ctx.moveTo(left + radius, top)
    ctx.lineTo(left + width - radius, top)
    ctx.arcTo(left + width, top, left + width, top + radius, radius)
    ctx.lineTo(left + width, top + height - radius)
    ctx.arcTo(left + width, top + height, left + width - radius, top + height, radius)
    ctx.lineTo(left + radius, top + height)
    ctx.arcTo(left, top + height, left, top + height - radius, radius)
    ctx.lineTo(left, top + radius)
    ctx.arcTo(left, top, left + radius, top, radius)
    ctx.closePath()
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fill()
    ctx.restore()
  }
}

function getCanvasContext(canvas: HTMLCanvasElement, isDarkMode: boolean) {
  const pixelRatio = window.devicePixelRatio ?? 1

  canvas.width = window.innerWidth * pixelRatio
  canvas.height = window.innerHeight * pixelRatio
  canvas.style.height = `100%`
  canvas.style.width = `100%`

  const canvasRect = canvas.getBoundingClientRect()
  const ctx = canvas.getContext('2d')

  if (ctx == null) return null

  ctx.scale(pixelRatio, pixelRatio)
  ctx.fillStyle = 'black'
  ctx.globalAlpha = isDarkMode ? 0.5 : 0.25
  ctx.fillRect(0, 0, canvasRect.width, canvasRect.height)
  ctx.globalAlpha = 1

  return ctx
}

export interface Props {
  elementId?: string;
  theme: Theme;
}

class SpotlightComponent extends PureComponent<Props> {
  drawSpotlight(canvas: HTMLCanvasElement) {
    if (!canvas) return
    const ctx = getCanvasContext(canvas, this.props.theme.palette.mode === 'dark')
    if (ctx == null) return
    renderConfig(ctx, this.props.elementId)
  }

  render() {
    return (
      <SpotlightPortal visible={!!this.props.elementId}>
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000000,
            pointerEvents: 'none',
            height: '100%',
            width: '100%',
          }}
        >
          <canvas ref={this.drawSpotlight.bind(this)}/>
        </Box>
      </SpotlightPortal>
    )
  }
}

export const Spotlight = withTheme<Props>(SpotlightComponent)
