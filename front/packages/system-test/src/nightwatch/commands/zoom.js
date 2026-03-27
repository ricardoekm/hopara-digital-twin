exports.command = function(elementSelector, {deltaY = -500, offsetX = 0, offsetY = 0, steps = 10} = {}, callback) {
  const api = this

  const stepValue = deltaY / steps
  for (let i = 0; i <= steps; i++) {
    api.perform(async () => {
      await api.executeScript(wheelElement, [elementSelector, stepValue, offsetX, offsetY], callback)
    })
  }

  return this // allows the command to be chained.
}

function wheelElement(elementSelector, deltaY, offsetX, offsetY) {
  const sourceNode = document.querySelector(elementSelector)
  if (!sourceNode) {
    return 'Element not found'
  }
  const box = sourceNode.getBoundingClientRect()
  const clientX = box.left + (offsetX || box.width / 2)
  const clientY = box.top + (offsetY || box.height / 2)
  const target = sourceNode.ownerDocument.elementFromPoint(clientX, clientY)

  for (let e = target; e; e = e.parentElement) {
    if (e === sourceNode) {
      window.targetNode = target
      target.dispatchEvent(new MouseEvent('mouseover', {view: window, bubbles: true, cancelable: true, clientX, clientY}))
      target.dispatchEvent(new MouseEvent('mousemove', {view: window, bubbles: true, cancelable: true, clientX, clientY}))
      target.dispatchEvent(new WheelEvent('wheel', {view: window, bubbles: true, cancelable: true, clientX, clientY, deltaY}))
      return
    }
  }    
  return 'Element is not interactive'
}
