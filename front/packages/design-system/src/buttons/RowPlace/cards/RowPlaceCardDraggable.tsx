import React from 'react'
import ReactDOM from 'react-dom'
import slugify from 'slugify'
import {PureComponent} from '../../../component/PureComponent'
import {Icon} from '../../../icons/Icon'
import {styled, Theme, withTheme} from '../../../theme'
import {Box} from '@mui/material'
import {RowPlaceCardBorder} from '../RowPlaceCardBorder'
import {i18n} from '@hopara/i18n'
import {Tooltip} from '../../../tooltip/Tooltip'
import { VISUALIZATION_PANEL_ID } from '../../../VisualizationLayout'

const isPositionOnView = (position: { x: number, y: number }, viewRect: DOMRect): boolean => {
  return position.x > 0 &&
    position.x < viewRect.width &&
    position.y > 0 &&
    position.y < viewRect.height
}
export const getPositionOnView = (position: { x: number, y: number }, containerId): {
  x?: number,
  y?: number
} | undefined => {
  const viewHTMLElement = window && window.document && window.document.getElementById(containerId)
  if (!viewHTMLElement) return

  const viewRect = viewHTMLElement.getBoundingClientRect()

  const positionOnView = {
    x: position.x - viewRect.x,
    y: position.y - viewRect.y,
  }

  if (!isPositionOnView(positionOnView, viewRect)) return

  return positionOnView
}

export type Props = {
  id?: string
  onPlace: Function
  containerId: string
  getIcon: (placing: boolean) => React.ReactNode
  placingIcon?: React.ReactNode
  canPlace: boolean
  cantPlaceReason?: string
  isPlaced: boolean
  size?: 'small' | 'large'
  tooltipPlacement?: 'top' | 'right'
  isImage?: boolean
  isSaving: boolean
  dragContainerRef?: React.RefObject<HTMLElement>
  dragThreshold?: number
}

type state = {
  isDragging: boolean
  dragPosition: any
  initialPosition: any
  isDropped: boolean
}

const PlaceWrapper = styled(Box, {name: 'PlaceWrapper'})(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 999,
  userSelect: 'none',
  color: '#888',
  textAlign: 'center',
  display: 'grid',
  placeItems: 'center',
  cursor: 'none',
}))

export enum RowPlaceStatus {
  NOT_PLACED = 'NOT_PLACED',
  PLACING = 'PLACING',
  SAVING = 'SAVING',
  PLACED = 'PLACED',
}

class RowPlaceCardDraggableComponent extends PureComponent<Props & { theme: Theme }, state> {
  _ref: React.RefObject<HTMLElement>
  portalElementId: string
  cachedHandleMove: any
  cachedHandleUp: any
  dragContainerElement?: HTMLElement
  cachedHandleContainerDown: any
  pendingDragStart?: { x: number, y: number }
  cachedHandleCancelClick: any

  constructor(props) {
    super(props)
    this._ref = props.forwardedRef || React.createRef<HTMLElement>()
    this.portalElementId = this.getPortalElementId(this.props.id)

    this.state = {
      isDragging: false,
      isDropped: false,
      dragPosition: undefined,
      initialPosition: undefined,
    }
  }

  getPortalElementId(id?: any): string {
    const stringId = String(id ?? '')
    const slugifyedId = slugify(stringId, {strict: true})
    return `__hopara__rowPlaceCardPortal_${slugifyedId}`
  }

  createPortal() {
    const portal: HTMLElement = document.createElement('div')
    portal.id = this.portalElementId
    document.body.appendChild(portal)
  }

  getPortal() {
    return document.querySelector(`#${this.portalElementId}`)
  }

  deletePortal() {
    return this.getPortal()?.remove()
  }

  componentDidMount() {
    this.createPortal()
    this.attachDragContainerListener()
  }

  componentDidUpdate() {
    const nextContainer = this.props.dragContainerRef?.current
    if (this.dragContainerElement !== nextContainer) {
      this.detachDragContainerListener()
      this.attachDragContainerListener()
    }
  }

  componentWillUnmount() {
    this.deletePortal()
    this.detachDragContainerListener()
    this.cleanupDragListeners()
  }

  attachDragContainerListener() {
    const container = this.props.dragContainerRef?.current
    if (!container) return
    if (this.dragContainerElement === container && this.cachedHandleContainerDown) return
    this.dragContainerElement = container
    this.cachedHandleContainerDown = this.handleContainerMouseDown.bind(this)
    container.addEventListener('mousedown', this.cachedHandleContainerDown)
  }

  detachDragContainerListener() {
    if (this.dragContainerElement && this.cachedHandleContainerDown) {
      this.dragContainerElement.removeEventListener('mousedown', this.cachedHandleContainerDown)
    }
    this.dragContainerElement = undefined
    this.cachedHandleContainerDown = undefined
  }

  cleanupDragListeners() {
    if (this.cachedHandleMove) {
      document.removeEventListener('mousemove', this.cachedHandleMove, true)
      this.cachedHandleMove = undefined
    }
    if (this.cachedHandleUp) {
      document.removeEventListener('mouseup', this.cachedHandleUp, true)
      this.cachedHandleUp = undefined
    }
    this.pendingDragStart = undefined
    this.detachCancelClickListener()
  }

  attachCancelClickListener() {
    const cancelTarget = this.dragContainerElement ?? this._ref.current
    if (!cancelTarget) return
    this.cachedHandleCancelClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      this.detachCancelClickListener()
    }
    cancelTarget.addEventListener('click', this.cachedHandleCancelClick, true)
  }

  detachCancelClickListener() {
    const cancelTarget = this.dragContainerElement ?? this._ref.current
    if (cancelTarget && this.cachedHandleCancelClick) {
      cancelTarget.removeEventListener('click', this.cachedHandleCancelClick, true)
    }
    this.cachedHandleCancelClick = undefined
  }

  handleMove(e: React.MouseEvent | MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.state.isDragging) return
    this.setState({
      dragPosition: {
        x: e.clientX - (this._ref.current!.getBoundingClientRect().width / 2),
        y: e.clientY - (this._ref.current!.getBoundingClientRect().height / 2),
      },
    })
  }

  getElementPositionOnView(elm: HTMLElement): { x?: number, y?: number } | undefined {
    const elmReact = elm.getBoundingClientRect()
    const x = elmReact.x + (elmReact.width / 2)
    const y = elmReact.y + (elmReact.height / 2)
    return getPositionOnView({x, y}, this.props.containerId)
  }

  isDraggingOrDropped() {
    return this.state.isDragging || this.state.isDropped
  }

  targetElementWasPanel(position?: { x?: number, y?: number }) {
    if (!position?.x || !position?.y) return false
    const possibleTargets = document.elementsFromPoint(position.x, position.y)
    const panel = possibleTargets.find((target) => target.id === VISUALIZATION_PANEL_ID)
    return !!panel
  }

  handleUp(e: React.MouseEvent | MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const positionOnView = getPositionOnView({x: e.clientX, y: e.clientY}, this.props.containerId)
    const targetElementWasPanel = this.targetElementWasPanel(positionOnView)

    this.setState({
      isDragging: false,
      isDropped: !!positionOnView,
      dragPosition: undefined,
    }, () => {
      if (positionOnView && !targetElementWasPanel) this.props.onPlace(positionOnView)
      this.cleanupDragListeners()
    })
  }

  handleMouseDown(e: React.MouseEvent) {
    if (!this.canStartDrag()) return
    this.startPendingDrag(e, true)
  }

  handleContainerMouseDown(e: MouseEvent) {
    if (e.button !== 0) return
    if (!this.canStartDrag()) return
    if (this._ref.current && this._ref.current.contains(e.target as Node)) return
    this.startPendingDrag(e, false)
  }

  startPendingDrag(e: React.MouseEvent | MouseEvent, shouldPreventDefault: boolean) {
    if (shouldPreventDefault) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.pendingDragStart = {x: e.clientX, y: e.clientY}
    this.cachedHandleMove = this.handlePendingMove.bind(this)
    document.addEventListener('mousemove', this.cachedHandleMove, true)
    this.cachedHandleUp = this.handlePendingUp.bind(this)
    document.addEventListener('mouseup', this.cachedHandleUp, true)
  }

  handlePendingMove(e: MouseEvent) {
    if (!this.pendingDragStart) return
    if (!this.state.isDragging) {
      const threshold = this.props.dragThreshold ?? 5
      const distance = Math.hypot(e.clientX - this.pendingDragStart.x, e.clientY - this.pendingDragStart.y)
      if (distance < threshold) return
      this.startDragging(e)
      return
    }

    this.handleMove(e)
  }

  handlePendingUp(e: MouseEvent) {
    if (this.state.isDragging) {
      this.handleUp(e)
      return
    }
    this.cleanupDragListeners()
  }

  startDragging(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    this.attachCancelClickListener()

    const bbox = this._ref.current!.getBoundingClientRect()
    const dragPosition = {
      x: e.clientX - (bbox.width / 2),
      y: e.clientY - (bbox.height / 2),
    }

    this.setState({
      isDragging: true,
      initialPosition: dragPosition,
      dragPosition,
    })
  }

  getStatus() {
    if (this.state.isDragging) return RowPlaceStatus.PLACING
    if (this.props.isPlaced) return RowPlaceStatus.PLACED
    if (this.props.isSaving) return RowPlaceStatus.SAVING
    return RowPlaceStatus.NOT_PLACED
  }

  isEnabled() {
    return this.props.canPlace || this.props.isPlaced
  }

  canStartDrag() {
    return this.getStatus() === RowPlaceStatus.NOT_PLACED && this.isEnabled()
  }

  getIcon() {
    const status = this.getStatus()
    if (status === RowPlaceStatus.SAVING) {
      return <Icon icon="progress-activity" size={this.props.size === 'large' ? 'xl' : 'md'}/>
    }
    return this.props.getIcon(status === RowPlaceStatus.PLACING)
  }

  getStaticComponent() {
    const enabled = this.isEnabled()
    const status = this.getStatus()
    const canStartDrag = this.canStartDrag()
    const showTooltip = status === RowPlaceStatus.NOT_PLACED
    const tooltipText = this.props.cantPlaceReason ? i18n(`CANT_PLACE_${this.props.cantPlaceReason}` as any) : i18n('DRAG_TO_PLACE')
    
    // For image layers with white placeholder in dark mode, use light mode accent color for visibility
    // For other types or in light mode, use theme-adaptive accent color
    const isDarkMode = this.props.theme.palette.mode === 'dark'
    const useLightModeColor = isDarkMode && this.props.isImage
    const dragIconColor = enabled 
      ? (useLightModeColor 
          ? this.props.theme.palette.spec.editAccentColor 
          : this.props.theme.palette.primary.main)
      : '#888'
    
    return <Tooltip
      title={tooltipText}
      placement={this.props.tooltipPlacement ?? 'top'}
      disableFocusListener={!showTooltip}
      disableHoverListener={!showTooltip}
      disableTouchListener={!showTooltip}
    >
      <RowPlaceCardBorder
        data-testid="row-place-button"
        ref={this._ref as any}
        status={status}
        enabled={enabled}
        size={this.props.size}
        onMouseDown={canStartDrag ? this.handleMouseDown.bind(this) : undefined}
        onClick={canStartDrag ? (e) => {
 e.preventDefault(); e.stopPropagation()
} : undefined}
        isImage={this.props.isImage}
        sx={{
          pointerEvents: canStartDrag ? 'auto' : 'none',
        }}
      >
        {this.getIcon()}
        {status === RowPlaceStatus.NOT_PLACED && <Box sx={{
          position: 'absolute',
          right: 0,
          bottom: -4,
          color: dragIconColor,
        }}>
          <Icon icon="pan"/>
        </Box>}
      </RowPlaceCardBorder>
    </Tooltip>
  }

  getPlacingComponent() {
    const position = this.state.dragPosition ?? this.state.initialPosition
    return <>
      <RowPlaceCardBorder
        status={this.getStatus()}
        size={this.props.size}
        enabled={this.props.canPlace || this.props.isPlaced}
        ref={this._ref as any}
        isImage={this.props.isImage}
      >
        <Box sx={{opacity: 0}}>{this.getIcon()}</Box>
      </RowPlaceCardBorder>
      {ReactDOM.createPortal(<PlaceWrapper
        sx={{
          width: this._ref.current!.getBoundingClientRect().width,
          height: this._ref.current!.getBoundingClientRect().height,
          transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
        }}
      >
        {this.getIcon()}
      </PlaceWrapper>, this.getPortal() as Element)}
    </>
  }

  render(): React.ReactNode {
    if (!this.state.isDragging) return this.getStaticComponent()
    return this.getPlacingComponent()
  }
}

export const RowPlaceCardDraggable = withTheme<Props>(RowPlaceCardDraggableComponent)
