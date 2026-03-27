import actions, {ActionTypes} from '../../state/Actions'
import {getType} from 'typesafe-actions'
import {FilterStore} from './FilterStore'
import {Data} from '@hopara/encoding'
import { Reducer } from '@hopara/state'

export const filterReducer: Reducer<FilterStore, ActionTypes> = (state, action, globalState: any): FilterStore => {
  if (!state && globalState?.filterStore) return globalState.filterStore
  else if (!state) return new FilterStore()

    switch (action.type) {
    case getType(actions.visualization.routeChanged):
      return new FilterStore()
    case getType(actions.settings.pageLoaded):
    case getType(actions.objectEditor.pageLoaded):
    case getType(actions.layerEditor.pageLoaded):
    case getType(actions.details.open):
    case getType(actions.visualization.panelCloseClicked):
      if (state.activated) return state.setActivated(false)
      return state
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
      if (!action.payload.filters) return new FilterStore()
      return new FilterStore().setSelectedFilters(action.payload.filters)
    case getType(actions.hoc.filterChanged):
      return state.setSelectedFilters(action.payload.filters)
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
      if (action.payload.selectedFilters.length) return state.setFilters(action.payload.filters).mergeSelectedFilters(action.payload.selectedFilters)
      return state.setFilters(action.payload.filters)
    case getType(actions.filter.loadValues.success):
      return state.setFilterValues(action.payload.id, action.payload.values)
    case getType(actions.filter.valueChanged):
      return state.changeSelectedFilterValue(action.payload.field, action.payload.value)
    case getType(actions.filter.dateChanged):
      return state.changeSelectedFilterValue(action.payload.field, action.payload.values)
    case getType(actions.filter.searchChanged):
      return state.setSearchTerm(action.payload.data, action.payload.field, action.payload.term)
    case getType(actions.filter.search.success):
      return state.setSearchValues(action.payload.data, action.payload.field, action.payload.values)
    case getType(actions.filter.move):
      return state.moveFilter(action.payload.id, action.payload.steps)
    case getType(actions.filter.delete):
      return state.deleteFilter(action.payload.id)
    case getType(actions.filter.create.success):
      return state.upsertFilter(action.payload.filter)
    case getType(actions.filter.selected):
      return state.setEditing(action.payload.id)
    case getType(actions.filter.changed):
      return state.clearSelectedFilters().setFilterAttribute(action.payload.id, action.payload.filter)
    case getType(actions.filter.queryChanged): {
      const data = new Data({source: action.payload.query.dataSource, query: action.payload.query.name})
      return state.setFilterAttribute(action.payload.id, {data})
    }
    case getType(actions.filter.dataSourceChanged): {
      const data = new Data({source: action.payload.dataSource})
      return state.setFilterAttribute(action.payload.id, {data})
    }
    case getType(actions.filter.fieldChanged):
      return state.clearSelectedFilters().setFilterAttribute(action.payload.id, {field: action.payload.field})
    case getType(actions.filter.singleChoiceChanged):
      return state.setFilterAttribute(action.payload.id, {singleChoice: action.payload.singleChoice})
    case getType(actions.visualizationHistory.checkoutVersion):
      return state.setEditing(undefined)
    case getType(actions.filter.autoFillModeChanged):
      return state.setFilterAttribute(action.payload.id, !action.payload.mode ? {autoFill: undefined} : {autoFill: {mode: action.payload.mode}})
    case getType(actions.filter.advancedModeClick):
      return state.setAdvancedMode(action.payload.enabled)
    case getType(actions.filter.comparisonTypeChanged):
      return state.setFilterAttribute(action.payload.id, {comparisonType: action.payload.comparisonType}).clearSelectedFilter(action.payload.id)
    case getType(actions.navigation.dirtyGoToFiltersClicked):
      return state.setActivated(true)
    case getType(actions.navigation.filtersClicked):
      return state.setActivated(!state.activated)
    default:
      return state
  }
}

