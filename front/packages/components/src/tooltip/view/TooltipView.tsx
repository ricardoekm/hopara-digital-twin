import React, {Component} from 'react'
import {Coordinates} from '@hopara/spatial'
import {TooltipPlacement} from '../domain/TooltipPlacement'
import {styled} from '@hopara/design-system/src/theme'
import {css} from '@emotion/react'

type TooltipProps = {
  coordinates: Coordinates
  children?: React.ReactNode;
  onMouseEnter?: (e:any) => void
  onMouseLeave?: (e:any) => void
}

type State = {
  placement?: TooltipPlacement | null
}

interface Props {
  placement?: TooltipPlacement | null
}

export const TooltipView = styled('div', {name: 'TooltipView'})<Props>(({theme}) => {
  const styles = [css({
    'fontSize': theme.typography.fontSize,
    'display': 'block',
    'position': 'absolute',
    'zIndex': 9999,
    'maxWidth': 'min(90vw, 500px)',
    'width': 'fit-content',
    'pointerEvents': 'none',
    'backdropFilter': theme.palette.spec.backgroundBlur,
    'border': `1px solid ${theme.palette.spec.tableBorder}`,
    'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
    'backgroundColor': theme.palette.spec.backgroundPanel,
    'overflow': 'hidden',
    'borderRadius': '8px',
    'paddingInline': '10px',
    'paddingBlock': '2px',
    '&.top': {
      marginBottom: 15,
      transform: 'translate3d(-50%, calc(-100% - 15px), 0)',
    },
    '&.bottom': {
      transform: 'translate3d(-50%, 15px, 0)',
    },
    '&.left': {
      marginRight: 15,
      transform: 'translate3d(calc(-100% - 15px), -50%, 0)',
    },
    '&.right': {
      marginLeft: 15,
      transform: 'translate3d(15px, -50%, 0)',
    },
    '&.topRight': {
      transform: 'translate3d(15px, calc(-100% - 15px), 0)',
    },
    '&.topLeft': {
      transform: 'translate3d(calc(-100% - 15px), calc(-100% - 15px), 0)',
    },
    '&.bottomRight': {
      transform: 'translate3d(15px, 15px, 0)',
    },
    '&.bottomLeft': {
      transform: 'translate3d(calc(-100% - 15px), 15px, 0)',
    },
  })]

  return styles
})

export const TooltipTableView = styled('table', {name: 'TooltipTableView'})({
  borderCollapse: 'collapse',
})

export const TooltipRow = styled('tr', {name: 'TooltipRow'})(({theme}) => ({
  'textAlign': 'left',
  'borderBlockEnd': `1px solid ${theme.palette.spec.tableBorder}`,
  'fontWeight': 500,
  '&:last-child': {
    borderBlockEnd: 'none',
  },
}))

export const TooltipHeading = styled('th', {name: 'TooltipHeading'})({
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontWeight: 500,
  opacity: 0.66,
  paddingInlineEnd: '10px',
})

export const TooltipField = styled('td', {name: 'TooltipField'})({
  paddingBlock: '5px',
})

export class Tooltip extends Component<TooltipProps, State> {
  _ref: React.RefObject<any> = React.createRef<any>()

  constructor(props) {
    super(props)
    this.state = {}
  }

  hasCoordinates(): boolean {
    return !!(this.props.coordinates?.x && this.props.coordinates?.y) && this.props.coordinates.x >= 0 && this.props.coordinates.y >= 0
  }

  getPlacement(): TooltipPlacement | undefined {
    const offset = 10

    if (!this._ref.current || !this.hasCoordinates()) return

    const tooltipWidth = this._ref.current.clientWidth
    const tooltipHeight = this._ref.current.clientHeight

    const parentWidth = this._ref.current.parentElement ? this._ref.current.parentElement.clientWidth : window.innerWidth
    const parentHeight = this._ref.current.parentElement ? this._ref.current.parentElement.clientHeight : window.innerHeight

    const hasTopSpace = this.props.coordinates.y > (tooltipHeight + offset)
    const hasBottomSpace = (parentHeight - this.props.coordinates.y) > (tooltipHeight + offset)
    const hasRightSpace = (parentWidth - this.props.coordinates.x) > (tooltipWidth + offset)
    const hasLeftSpace = this.props.coordinates.x > (tooltipWidth + offset)

    const hasMiddleTopSpace = this.props.coordinates.y > (tooltipHeight / 2)
    const hasMiddleBottomSpace = (parentHeight - this.props.coordinates.y) > (tooltipHeight / 2)
    const hasMiddleRightSpace = (parentWidth - this.props.coordinates.x) > (tooltipWidth / 2)
    const hasMiddleLeftSpace = this.props.coordinates.x > (tooltipWidth / 2)

    if (hasTopSpace && hasMiddleRightSpace && hasMiddleLeftSpace) return TooltipPlacement.top
    if (hasBottomSpace && hasMiddleRightSpace && hasMiddleLeftSpace) return TooltipPlacement.bottom
    if (hasLeftSpace && hasMiddleTopSpace && hasMiddleBottomSpace) return TooltipPlacement.left
    if (hasRightSpace && hasMiddleTopSpace && hasMiddleBottomSpace) return TooltipPlacement.right
    if (hasTopSpace && hasRightSpace) return TooltipPlacement.topRight
    if (hasTopSpace && hasLeftSpace) return TooltipPlacement.topLeft
    if (hasBottomSpace && hasRightSpace) return TooltipPlacement.bottomRight
    if (hasBottomSpace && hasLeftSpace) return TooltipPlacement.bottomLeft

    // if it cannot place properly show the best partial position
    if (hasBottomSpace) return TooltipPlacement.bottom
    if (hasLeftSpace) return TooltipPlacement.left
    if (hasRightSpace) return TooltipPlacement.right
    if (hasTopSpace) return TooltipPlacement.top
  }

  componentDidUpdate(): void {
    if (!this.hasCoordinates() || !this.props.children) return
  }

  render() {
    if (!this.props.children) return

    const placement = this.getPlacement()

    return (
      <TooltipView
        id='__hopara__tooltip__'
        ref={this._ref}
        className={placement ? placement : ''}
        data-placement={placement}
        style={{
          display: this.hasCoordinates() && !!placement ? 'block' : 'none',
          left: this.props.coordinates?.x,
          top: this.props.coordinates?.y,
        }}>
        {this.props.children && this.props.children}
      </TooltipView>
    )
  }
}

