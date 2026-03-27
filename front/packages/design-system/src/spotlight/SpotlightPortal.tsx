import { PropsWithChildren, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export function SpotlightPortal({children, visible}: PropsWithChildren<{ visible: boolean }>) {
  const outlet = useRef<HTMLElement | null>(null)
  const [didMount, setDidMount] = useState(false)
  useEffect(() => {
    let outletDiv = document.getElementById('spotlight-outlet')
    if (!outletDiv) {
      outletDiv = document.createElement('div')
      outletDiv.id = 'spotlight-outlet'
      document.body.appendChild(outletDiv)
    }
    if (visible) {
      outletDiv.className = 'spotlight-visible'
    } else {
      outletDiv.className = 'spotlight-hidden'
    }
    outletDiv.style.zIndex = '1000000'
    outlet.current = outletDiv
    setDidMount(true)
  }, [outlet, visible])

  if (!didMount) return null
  return createPortal(didMount ? children : null, outlet.current!)
}
