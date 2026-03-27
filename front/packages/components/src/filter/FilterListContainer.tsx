import {Store} from '../state/Store'
import {Filter} from './domain/Filter'
import FilterListComponent, {ActionProps, StateProps} from './FilterListComponent'
import actions from '../state/Actions'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import { DateRangeValue } from './DateRangeFilter'

function mapState(state: Store): StateProps {
  return {
    queries: state.queryStore.queries,
    filters: state.filterStore.filters,
    selectedFilters: state.filterStore.selectedFilters,
    searchFilters: state.filterStore.searchFilters,
    authorization: state.auth.authorization,
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (filter: Filter, value: string | undefined) => {
      dispatch(actions.filter.valueChanged({field: filter.field, value}))
    },
    onSearch: (filter: Filter, term: string | undefined) => {
      dispatch(actions.filter.searchChanged({data: filter.data, field: filter.field, term}))
    },
    onDateFilterChange: (filter: Filter, values?: DateRangeValue) => {
      dispatch(actions.filter.dateChanged({field: filter.field, values}))
    },
    onLoad: () => {
      return
    },
  }
}

export default connect(mapState, mapActions)(FilterListComponent)
