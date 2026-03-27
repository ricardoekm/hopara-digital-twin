import React from 'react'
import {HoparaSymbols} from '@hopara/design-system/src/icons/HoparaSymbols'

export const TemplateIcon = (props: {type: string}) => {
  switch (props.type) {
    case 'chart': return <HoparaSymbols icon="template-chart"/>
    case 'whiteboard': return <HoparaSymbols icon="template-whiteboard"/>
    case 'isometric-whiteboard': return <HoparaSymbols icon="template-isometric-whiteboard"/>
    case '3d': return <HoparaSymbols icon="template-3d"/>
    default: return <HoparaSymbols icon="template-geo"/>
  }
}

