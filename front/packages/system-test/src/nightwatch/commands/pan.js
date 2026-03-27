exports.command = function(elementSelector, {offsetY = 0, offsetX = 0, steps = 10}) {
  const api = this

  api.perform(() => {
    const el = this.element('css selector', elementSelector)    
    const xStep = offsetX ? offsetX / steps : 0
    const yStep = offsetY ? offsetY / steps : 0
    
    let actions = this.actions({async: true})
    actions = actions.click(el).press()
    for (let i = 0, lastX = 0, lastY = 0; i <= steps; i++) {
      const stepX = Math.floor(lastX + xStep)
      const stepY = Math.floor(lastY + yStep)
      lastX = stepX
      lastY = stepY
      actions = actions.move({origin: el, x: stepX, y: stepY, duration: 1})
    }
    return actions.release()
  })

  return this // allows the command to be chained.
}
