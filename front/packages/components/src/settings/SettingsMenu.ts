import {i18n} from '@hopara/i18n'
import {MenuItem} from '../menu/MenuStore'
import {Internals} from '@hopara/internals'
import Visualization from '../visualization/Visualization'

export enum SettingsMenuItemId {
  FILTERS = 'FILTERS',
  COLOR_LEGENDS = 'COLOR_LEGENDS',
  ACTIONS = 'ACTIONS',
  LIGHTS = 'LIGHTS',
  GENERAL = 'GENERAL',
  FLOORS = 'FLOORS',
  GRID = 'GRID'
}

export const createSettingsMenu = (visualization?: Visualization): MenuItem[] => {
  const items: MenuItem[] = [
    {
      id: SettingsMenuItemId.FILTERS,
      name: i18n(SettingsMenuItemId.FILTERS),
      icon: 'filters',
    },
    {
      id: SettingsMenuItemId.COLOR_LEGENDS,
      name: i18n(SettingsMenuItemId.COLOR_LEGENDS),
      icon: 'color-legends',
    },
  ]
  if (Internals.getParam('advanced') === true) {
    items.push({
      id: SettingsMenuItemId.ACTIONS,
      name: i18n(SettingsMenuItemId.ACTIONS),
      icon: 'actions',
    })
  }
  if (visualization?.is3D()) {
    items.push({
      id: SettingsMenuItemId.LIGHTS,
      name: i18n(SettingsMenuItemId.LIGHTS),
      icon: 'lightbulb-group',
    })
  }
  if (visualization?.isGeo()) {
    items.push({
      id: SettingsMenuItemId.FLOORS,
      name: i18n(SettingsMenuItemId.FLOORS),
      icon: 'floors',
    })
  }
  if (visualization?.isWhiteboard()) {
    items.push({
      id: SettingsMenuItemId.GRID,
      name: i18n(SettingsMenuItemId.GRID),
      icon: 'grid'
    })
  }
  return items.concat([
    {
      id: SettingsMenuItemId.GENERAL,
      name: i18n(SettingsMenuItemId.GENERAL),
      icon: 'general',
    },
  ])
}
