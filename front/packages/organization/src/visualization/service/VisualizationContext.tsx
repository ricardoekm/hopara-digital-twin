import React from 'react'
import {VisualizationService} from './VisualizationService'
import {TemplateService} from '../../template/TemplateService'

const defaultState = {
  appService: new VisualizationService(),
  templateService: new TemplateService(),
}

export const VisualizationContext = React.createContext(defaultState)


