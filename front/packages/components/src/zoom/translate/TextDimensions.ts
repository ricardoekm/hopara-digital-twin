export const getTextDimensions = (text: string, size: number) => {
  const textElement = document.createElement('span')
  textElement.innerText = text
  textElement.style.fontFamily = 'Inter'
  textElement.style.fontSize = `${size}px`
  textElement.style.visibility = 'hidden'
  document.body.appendChild(textElement)
  const bounds = textElement.getBoundingClientRect()
  document.body.removeChild(textElement)
  return bounds
}
