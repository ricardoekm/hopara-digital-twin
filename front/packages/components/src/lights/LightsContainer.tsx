import { useMemo } from 'react'
import Case from 'case'
import {connect} from '@hopara/state'
import { LightsEditorComponent } from './LightsEditorComponent'
import { Store } from '../state/Store'
import { i18n } from '@hopara/i18n'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../state/Actions'
import { LightName } from './Lights'

function mapState(state: Store): any {
  const lights = useMemo(() => {
    const stateLights = state.visualizationStore.visualization.lights?.getLights()
    if (!stateLights) return []
    return Object.keys(stateLights).map((key) => {
      const title = i18n(Case.snake(key).toUpperCase() as any)
      return ({ name: key, title, config: stateLights![key]})
    })
  }, [state.visualizationStore.visualization?.lights])

  return {
    lights,
  }
}

function mapActions(dispatch: Dispatch): any {
  return {
    onLightChange: (name: LightName, config: any) => {
      dispatch(actions.light.onLightChanged({name, light: config}))
    },
  }
}

export const LightsContainer = connect(mapState, mapActions)(LightsEditorComponent)
