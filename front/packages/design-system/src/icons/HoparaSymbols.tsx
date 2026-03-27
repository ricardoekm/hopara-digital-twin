import React from 'react'

// Templates
import {ReactComponent as Template3d} from './custom-icons/templates/3d.svg'
import {ReactComponent as TemplateChart} from './custom-icons/templates/chart.svg'
import {ReactComponent as TemplateGeo} from './custom-icons/templates/geo.svg'
import {ReactComponent as TemplateWhiteboard} from './custom-icons/templates/whiteboard.svg'
import {ReactComponent as TemplateIsometricWhiteboard} from './custom-icons/templates/isometric-whiteboard.svg'


const symbols = {
  'template-3d': () => <Template3d/>,
  'template-chart': () => <TemplateChart/>,
  'template-geo': () => <TemplateGeo/>,
  'template-whiteboard': () => <TemplateWhiteboard/>,
  'template-isometric-whiteboard': () => <TemplateIsometricWhiteboard/>,
}

export const hoparaSymbolKeys = Object.keys(symbols).sort() as HoparaSymbolKey[]

export type HoparaSymbolKey = keyof typeof symbols

interface Props {
  size?: number;
  icon: HoparaSymbolKey;
}

export const HoparaSymbols = (props: Props): React.ReactElement => {
  return symbols[props.icon]()
}
