import {LayerType} from '../layer/domain/spec/LayerType.js'
import fs from 'fs'
import {layerTemplates} from './memory-layer-template-repository.js'

const tableu = [
  '#4c78a8',
  '#f58518',
  '#e45756',
]

const iconPath1 = 'M4 19H8.6L2.62 8.64C2.23 8 2 7.29 2 6.5C2 4.29 3.79 2.5 6 2.5C7.86 2.5 9.43 3.78 9.87 5.5H14V3C14 1.9 14.9 1 16 1V3.59L17.59 2H22V4H18.41L16 6.41V6.59L18.41 9H22V11H17.59L16 9.41V12C14.9 12 14 11.11 14 10V7.5H9.87C9.77 7.89 9.61 8.26 9.41 8.6L15.41 19H20C21.11 19 22 19.9 22 21V22H2V21C2 19.9 2.9 19 4 19M7.91 10C7.35 10.32 6.7 10.5 6 10.5L10.91 19H13.1L7.91 10M6 4.5C4.89 4.5 4 5.4 4 6.5C4 7.61 4.89 8.5 6 8.5C7.11 8.5 8 7.61 8 6.5C8 5.4 7.11 4.5 6 4.5Z'
const iconPath2 = 'M 9 21 L 9 22 L 7 22 L 7 21 C 5.9 21 5 20.11 5 19 L 5 4 C 5 2.9 5.9 2 7 2 L 17 2 C 18.11 2 19 2.9 19 4 L 19 19 C 19 20.11 18.11 21 17 21 L 17 22 L 15 22 L 15 21 L 9 21 M 7 4 L 7 9 L 17 9 L 17 4 L 7 4 M 7 19 L 17 19 L 17 11 L 7 11 L 7 19 M 8 12 L 10 12 L 10 15 L 8 15 L 8 12 M 8 6 L 10 6 L 10 8 L 8 8 L 8 6'
const iconPath3 = 'M19 5V19H5V5H19M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M12 6C12.55 6 13 6.45 13 7V8H16.17C16.35 8.31 16.5 8.65 16.66 9H13V10H17C17.1 10.33 17.17 10.67 17.19 11H13V12H17.2C17.16 12.35 17.15 12.69 17.1 13H13V14H17C17 14 16.94 17 15.5 17C14.15 17 14.5 15.47 13 15V17C13 17.55 12.55 18 12 18S11 17.55 11 17V15C9.5 15.47 9.85 17 8.5 17C7.06 17 7 14 7 14H11V13H6.9C6.85 12.69 6.84 12.35 6.8 12H11V11H6.81C6.83 10.67 6.91 10.33 7 10H11V9H7.34C7.5 8.65 7.65 8.31 7.83 8H11V7C11 6.45 11.45 6 12 6Z'

function generateTemplateImage(template) {
  let layerStr = JSON.stringify(template.layers)
  template.form.forEach((f) => {
    if (f.defaultValue) {
      layerStr = layerStr.replaceAll(`{{${f.path}}}`, f.defaultValue)
    }
  })
  const l = JSON.parse(layerStr)

  let svg = `<svg viewBox="0 0 176 70" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Inter';
        src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700') format('woff');
      }
      text {
        font-family: 'Inter', sans-serif;
      }
    </style>
  </defs>
`

  const poligonFade = `<animate
  attributeName="fill-opacity"
  keyTimes="0; 0.5; 1"
  values="0.33;1;0.33"
  begin="0s"
  dur="1.5s"
  fill="freeze"
  repeatCount="indefinite"
/>`

  const shift = 53;

  (l[0]?.children ?? l).forEach((child) => {
    const icons = child.encoding.icon?.field ? [iconPath1, iconPath2, iconPath3] : [iconPath1, iconPath1, iconPath1]
    let colors
    if (child.encoding.color?.scale?.scheme) {
      colors = tableu
    } else {
      colors = child.encoding.color?.scale?.colors ?? [child.encoding.color?.value, child.encoding.color?.value, child.encoding.color?.value]
    }
    const size = child.encoding.size?.value ?? 12
    const offsetX = child.encoding.offset?.x?.value ?? 0
    const offsetY = child.encoding.offset?.y?.value ?? 0
    const strokeColor = child.encoding.strokeColor?.value ?? '#000000'

    svg += `\n<!-- ${child.name} -->`

    for (let i = 0; i < colors.length; i++) {
      const left = 35 + i * shift + offsetX
      const top = 35 - offsetY

      const color = colors[i]
      const colorAnimation = child.encoding.color.animation

      if (child.type === LayerType.circle) {
        svg += `\n<circle
      fill="${color}"
      style="transform-origin: ${left}px ${top}px"
      cx="${left}"
       cy="${top}"
      r="${size / 2}"
    >`
        const sizeAnimation = child.encoding.size.animation
        if (colorAnimation && (!colorAnimation.condition || i !== 0)) {
          if (colorAnimation?.type === 'ripple') {
            svg += ` <animate
              attributeName="fill-opacity"
              keyTimes="0; 0.7; 1"
              values="0.7;0;0"
              begin="0s"
              dur="1.5s"
              fill="freeze"
              repeatCount="indefinite"
            />`
          }
        }
        if (sizeAnimation && (!sizeAnimation.condition || i !== 0)) {
          if (sizeAnimation?.type === 'ripple') {
            svg += `<animateTransform
              type="scale"
              additive="sum"
              attributeName="transform"
              keyTimes="0; 0.7; 1"
              values="1; 2; 2"
              begin="0s"
              dur="1.5s"
              fill="freeze"
              repeatCount="indefinite"
            />`
          }
          if (sizeAnimation?.type === 'pulse') {
            svg += `<animateTransform
              type="scale"
              additive="sum"
              attributeName="transform"
              keyTimes="0; 0.6; 0.9; 1"
              values="1; 1.2; 1; 1"
              begin="0s"
              dur="1.5s"
              fill="freeze"
              repeatCount="indefinite"
            />`
          }
        }
        svg += `</circle>`
      }

      if (child.type === LayerType.icon) {
        const scale = size / 24
        svg += `<path
      fill="${color}"
      transform="translate(${i * shift + 35 + offsetX - (size / 2)}, ${35 + offsetY - (size / 2)}) scale(${scale})"
      d="${icons[i]}"
      />`
      }
      if (child.type === LayerType.text) {
        svg += `<text
      fill="${color}"
      font-size="${size}"
      x="${left}"
      y="${top}"
      text-anchor="middle"
      dominant-baseline="middle"
    >${i}</text>`
      }
      if (child.type === LayerType.polygon) {
        const size = 40
        const polLeft = left - size / 2
        const polTop = top - size / 2
        svg += `<polygon
      fill="${color}"
      points="${polLeft},${polTop} ${polLeft + size},${polTop} ${polLeft + size},${polTop + size} ${polLeft},${polTop + size}"
    >
      ${i !== 0 ? poligonFade : ''}
    </polygon>
    <polygon
      fill="transparent"
      points="${polLeft},${polTop} ${polLeft + size},${polTop} ${polLeft + size},${polTop + size} ${polLeft},${polTop + size}"
      stroke="${strokeColor}"
      stroke-width="1"
    />
`
      }
    }
  })

  svg += '</svg>'

  fs.writeFileSync(`out/layer-templates/${template.id}.svg`, svg)
}

fs.mkdirSync('out/layer-templates', {recursive: true})
layerTemplates.forEach((t) => {
  generateTemplateImage(t)
})
