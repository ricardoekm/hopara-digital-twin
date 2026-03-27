import React from 'react'
import {IconService} from './IconService'

const defaultState = {
  iconService: new IconService(),
}

export const ResourceContext = React.createContext(defaultState)


