import * as React from 'react'
import {styled} from '@hopara/design-system/src'
import {Box} from '@mui/material'
import {i18n} from '@hopara/i18n'

const size = 70

enum FaceName {
  front = 'front',
  back = 'back',
  right = 'right',
  left = 'left',
  top = 'top',
  bottom = 'bottom'
}

const faceToRotation: Record<FaceName, { x: number; y: number }> = {
  front: {x: 0, y: 0},
  back: {x: 0, y: 180},
  right: {x: 0, y: -90},
  left: {x: 0, y: 90},
  top: {x: -90, y: 0},
  bottom: {x: 90, y: 0}
}

const Scene = styled(Box, {name: 'Scene'})(() => ({
  'width': 70,
  'height': 70,
  'perspective': '300px',
  'position': 'absolute',
  'bottom': 50,
  'right': 50,
  'zIndex': 10000000,
  'borderRadius': 3,
}))

const Cube = styled('div', {name: 'Cube'})(() => ({
  'width': '100%',
  'height': '100%',
  'position': 'relative',
  'transformStyle': 'preserve-3d',
  'transition': 'transform 180ms cubic-bezier(.2,.9,.3,1)',
  'cursor': 'grab'
}))

const Face = styled('div', {name: 'Face'})(({theme}) => ({
  'position': 'absolute',
  'width': '100%',
  'height': '100%',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'fontSize': 9,
  'textTransform': 'uppercase',
  'letterSpacing': 0.5,
  'backfaceVisibility': 'hidden',
  'boxSizing': 'border-box',
  'padding': 10,
  'userSelect': 'none',
  'color': theme.palette.spec.foregroundCanvasButton,
  'backgroundColor': theme.palette.spec.backgroundCanvasButton,
  'fontWeight': '500',
  'pointerEvents': 'auto',
  'border': '1px solid rgba(0,0,0,0.1)',
  'transition': 'background 150ms, color 150ms, font-weight 150ms',
  '&:hover, &.active': {
    backgroundColor: theme.palette.spec.tabColorBackground,
    color: theme.palette.spec.tabColorForeground
  },
  '&.active': {
    fontWeight: '600'
  }
}))

const FaceFront = styled(Face, {name: 'FaceFront'})({
  transform: `translateZ(${size / 2}px)`
})

const FaceBack = styled(Face, {name: 'FaceBack'})({
  transform: `rotateY(180deg) translateZ(${size / 2}px)`
})

const FaceRight = styled(Face, {name: 'FaceRight'})({
  transform: `rotateY(90deg) translateZ(${size / 2}px)`
})

const FaceLeft = styled(Face, {name: 'FaceLeft'})({
  transform: `rotateY(-90deg) translateZ(${size / 2}px)`
})

const FaceTop = styled(Face, {name: 'FaceTop'})({
  transform: `rotateX(90deg) translateZ(${size / 2}px)`
})

const FaceBottom = styled(Face, {name: 'FaceBottom'})({
  transform: `rotateX(-90deg) translateZ(${size / 2}px)`
})

interface Props {
  onRotationChange: (rotX: number, rotY: number) => void
  rotation?: { x: number; y: number }
}

interface State {
  activeFace: FaceName | null
}

export class ViewCube extends React.Component<Props, State> {
  private sceneRef = React.createRef<HTMLDivElement>()
  private cubeRef = React.createRef<HTMLDivElement>()
  private cursorStyleElement: HTMLStyleElement | null = null

  private dragging = false
  private lastX = 0
  private lastY = 0
  private moved = false
  private readonly MOVE_THRESHOLD = 6
  private pointerDownTarget: Element | null = null
  private activePointerId: number | null = null
  private rotX = -15
  private rotY = -25
  // when true, update() will not call onRotationChange — used when applying an external rotation
  private suppressEmit = false
  // threshold (degrees) under which we consider rotations equal to avoid ping-pong updates
  private readonly SYNC_THRESHOLD = 0.5

  constructor(props: Props) {
    super(props)
    this.state = {
      activeFace: null
    }
  }

  componentDidMount(): void {
    // If an external rotation is provided at mount, apply it without emitting (to avoid loop)
    if (this.props.rotation) {
      const ext = this.props.rotation
      // external rotX is in the same coordinate system as onRotationChange (note: ViewCube emits -this.rotX)
      this.applyExternalRotation(ext.x, ext.y)
    } else {
      this.update()
    }
  }

  componentDidUpdate(prevProps: Props): void {
    // If an external rotation prop changed significantly, apply it without emitting
    const prev = prevProps.rotation
    const cur = this.props.rotation
    if (!cur) return
    if (!prev) {
      this.applyExternalRotation(cur.x, cur.y)
      return
    }
    const dx = Math.abs(cur.x - prev.y)
    const dy = Math.abs(cur.y - prev.y)
    if (dx > this.SYNC_THRESHOLD || dy > this.SYNC_THRESHOLD) {
      this.applyExternalRotation(cur.x, cur.y)
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('pointermove', this.onDocPointerMove)
    document.removeEventListener('pointerup', this.onDocPointerUp)
    // Remove cursor style in case component unmounts during drag
    if (this.cursorStyleElement && this.cursorStyleElement.parentNode) {
      this.cursorStyleElement.parentNode.removeChild(this.cursorStyleElement)
      this.cursorStyleElement = null
    }
  }

  private update = (): void => {
    if (this.cubeRef.current) {
      this.cubeRef.current.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`
      // emit only when not suppressed
      if (!this.suppressEmit) {
        this.props.onRotationChange(-this.rotX, this.rotY)
      }
    }
  }

  // apply external rotation (in the same coordinates as onRotationChange).
  // This sets internal rotX/rotY and updates the cube but suppresses emitting back the change.
  private applyExternalRotation(extRotX: number, extRotY: number): void {
    // Convert external rotX to internal coordinate (-extRotX)
    const targetInternalX = -extRotX
    const targetInternalY = extRotY

    // Only perform an update if difference is meaningful to avoid jitter/loops
    const dx = Math.abs(this.normalizeAngle(this.rotX) - this.normalizeAngle(targetInternalX))
    const dy = Math.abs(this.normalizeAngle(this.rotY) - this.normalizeAngle(targetInternalY))
    if (dx <= this.SYNC_THRESHOLD && dy <= this.SYNC_THRESHOLD) return

    this.suppressEmit = true
    this.rotX = Math.max(-90, Math.min(90, targetInternalX))
    this.rotY = targetInternalY
    this.update()
    // allow a tick before re-enabling emits to avoid immediate feedback where consumers echo back
    // but a simple microtask is enough
    Promise.resolve().then(() => {
      this.suppressEmit = false
    })
  }

  private shortestAngleDelta(from: number, to: number): number {
    return ((to - from + 540) % 360) - 180
  }

  private normalizeAngle(a: number): number {
    return ((a + 180) % 360 + 360) % 360 - 180
  }

  private setRotationTo = (targetX: number, targetY: number): void => {
    const tY = this.normalizeAngle(targetY)
    const tX = this.normalizeAngle(targetX)
    const dy = this.shortestAngleDelta(this.rotY, tY)
    this.rotY = this.rotY + dy
    const dx = this.shortestAngleDelta(this.rotX, tX)
    this.rotX = this.rotX + dx
    this.rotX = Math.max(-90, Math.min(90, this.rotX))
    this.update()
  }

  private onDocPointerMove = (e: PointerEvent): void => {
    if (!this.dragging || e.pointerId !== this.activePointerId) return
    const dx = e.clientX - this.lastX
    const dy = e.clientY - this.lastY
    // Mark as moved even with small movement
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) this.moved = true
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.rotY += dx * 0.5
    this.rotX -= dy * 0.5
    this.rotX = Math.max(-90, Math.min(90, this.rotX))
    this.update()
  }

  private pickFaceByProjection(screenX: number, screenY: number): Element | null {
    const scene = this.sceneRef.current
    const cube = this.cubeRef.current
    if (!scene || !cube) return null
    const rect = scene.getBoundingClientRect()
    const perspective = parseFloat(getComputedStyle(scene).perspective) || 300
    const size = cube.clientWidth
    const half = size / 2

    const centers: Record<string, [number, number, number]> = {
      front: [0, 0, half],
      back: [0, 0, -half],
      right: [half, 0, 0],
      left: [-half, 0, 0],
      top: [0, half, 0],
      bottom: [0, -half, 0]
    }

    const degToRad = (d: number) => (d * Math.PI) / 180
    const cosX = Math.cos(degToRad(this.rotX))
    const sinX = Math.sin(degToRad(this.rotX))
    const cosY = Math.cos(degToRad(this.rotY))
    const sinY = Math.sin(degToRad(this.rotY))

    function rotatePoint([x, y, z]: [number, number, number]) {
      const y1 = y * cosX - z * sinX
      const z1 = y * sinX + z * cosX
      const x1 = x
      const x2 = x1 * cosY + z1 * sinY
      const z2 = -x1 * sinY + z1 * cosY
      return [x2, y1, z2] as [number, number, number]
    }

    function project([x, y, z]: [number, number, number]) {
      const s = perspective / (perspective - z)
      const px = x * s
      const py = y * s
      const screenPX = rect.left + rect.width / 2 + px
      const screenPY = rect.top + rect.height / 2 - py
      return [screenPX, screenPY, z] as [number, number, number]
    }

    let best: { face: string | null; dist: number; z: number } = {face: null, dist: Infinity, z: -Infinity}
    for (const [name, pt] of Object.entries(centers)) {
      const rotated = rotatePoint(pt)
      if (rotated[2] <= -1e-3) continue
      const [px, py, z] = project(rotated)
      const dx = px - screenX
      const dy = py - screenY
      const d2 = dx * dx + dy * dy
      if (d2 < best.dist || (Math.abs(d2 - best.dist) < 1e-2 && z > best.z)) {
        best = {face: name, dist: d2, z}
      }
    }
    return best.face ? (scene.querySelector('.face.' + best.face) as Element | null) : null
  }

  private findFaceAt(x: number, y: number): Element | null {
    const el = document.elementFromPoint(x, y) as Element | null
    const f = el && (el.closest ? el.closest('.face') : null)
    if (f) return f
    const offsets = [0, -2, 2, -4, 4, -6, 6]
    for (const oy of offsets) {
      for (const ox of offsets) {
        const e2 = document.elementFromPoint(x + ox, y + oy) as Element | null
        const f2 = e2 && (e2.closest ? e2.closest('.face') : null)
        if (f2) return f2
      }
    }
    return null
  }

  private onDocPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.activePointerId) return
    document.removeEventListener('pointermove', this.onDocPointerMove)
    document.removeEventListener('pointerup', this.onDocPointerUp)
    this.activePointerId = null
    this.dragging = false
    
    // Remove global cursor style
    if (this.cursorStyleElement && this.cursorStyleElement.parentNode) {
      this.cursorStyleElement.parentNode.removeChild(this.cursorStyleElement)
      this.cursorStyleElement = null
    }

    // Clear active face after a short delay to show the click feedback
    setTimeout(() => {
      this.setState({activeFace: null})
    }, 150)

    if (!this.moved) {
      let face: Element | null = (this.pointerDownTarget as Element | null)?.closest('.face') ?? null
      if (!face) {
        face = this.findFaceAt(e.clientX, e.clientY)
        if (!face) face = this.pickFaceByProjection(e.clientX, e.clientY)
      }
      if (face) {
        for (const cls of Object.keys(faceToRotation)) {
          if (face.classList.contains(cls)) {
            const target = faceToRotation[cls]
            this.setRotationTo(target.x, target.y)
            break
          }
        }
      }
    }
  }

  private onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    this.dragging = true
    this.moved = false
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.pointerDownTarget = e.target as Element
    this.activePointerId = e.pointerId
    
    // Determine which face was clicked and set it as active
    const clickedFace = (e.target as Element).closest('.face')
    if (clickedFace) {
      for (const [faceName] of Object.entries(faceToRotation)) {
        if (clickedFace.classList.contains(faceName)) {
          this.setState({activeFace: faceName as FaceName})
          break
        }
      }
    }
    
    document.addEventListener('pointermove', this.onDocPointerMove)
    document.addEventListener('pointerup', this.onDocPointerUp)
    
    // Inject global cursor style (remove any existing one first)
    if (this.cursorStyleElement && this.cursorStyleElement.parentNode) {
      this.cursorStyleElement.parentNode.removeChild(this.cursorStyleElement)
    }
    this.cursorStyleElement = document.createElement('style')
    this.cursorStyleElement.textContent = '* { cursor: grabbing !important; }'
    document.head.appendChild(this.cursorStyleElement)
  }

  private onFaceClick = (face: FaceName) => {
    return () => {
      // Don't execute click if user was dragging
      if (this.moved || this.dragging) return
      const target = faceToRotation[face]
      this.setRotationTo(target.x, target.y)
      // update() will emit change; avoid duplicate call here to prevent extra events
    }
  }

  render() {
    const {activeFace} = this.state
    return (
      <Scene ref={this.sceneRef}>
        <Cube id="cube" ref={this.cubeRef} onPointerDown={this.onPointerDown}>
          <FaceFront
            className={`face front${activeFace === FaceName.front ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.front)}
          >
            {i18n('CUBE_FRONT')}
          </FaceFront>
          <FaceBack
            className={`face back${activeFace === FaceName.back ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.back)}
          >
            {i18n('CUBE_BACK')}
          </FaceBack>
          <FaceRight
            className={`face right${activeFace === FaceName.right ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.right)}
          >
            {i18n('CUBE_RIGHT')}
          </FaceRight>
          <FaceLeft
            className={`face left${activeFace === FaceName.left ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.left)}
          >
            {i18n('CUBE_LEFT')}
          </FaceLeft>
          <FaceTop
            className={`face top${activeFace === FaceName.top ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.top)}
          >
            {i18n('CUBE_TOP')}
          </FaceTop>
          <FaceBottom
            className={`face bottom${activeFace === FaceName.bottom ? ' active' : ''}`}
            onClick={this.onFaceClick(FaceName.bottom)}
          >
            {i18n('CUBE_BOTTOM')}
          </FaceBottom>
        </Cube>
      </Scene>
    )
  }
}
