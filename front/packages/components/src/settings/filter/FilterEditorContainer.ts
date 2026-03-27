import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../state/Store'
import {connect} from '@hopara/state'
import {ActionProps, FilterEditorComponent, StateProps} from './FilterEditorComponent'
import actions from '../../state/Actions'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import { ComparisonType } from '../../filter/domain/Filter'

const mapState = (store: Store, _, navigation: PageNavigation): StateProps => {
  const selectedItem = store.filterStore.filters.find((filter) => filter.getId() === store.filterStore.editingId)
  const selectedItemQuery = store.queryStore.queries.findQuery(selectedItem?.data.getQueryKey())
  const dataSourceLink = selectedItem?.data.source && navigation.getUrl(PageType.ViewDataSource, {name: selectedItem?.data.source})
  const dataSourceListLink = navigation.getUrl(PageType.ListDataSources)
  const queryLink = selectedItem?.data.source &&
    selectedItemQuery &&
    navigation.getUrl(PageType.EditQuery, {dataSourceName: selectedItem.data.source, name: selectedItemQuery.getName()})
  const newQueryLink = selectedItem?.data.source && navigation.getUrl(PageType.CreateQuery, {dataSourceName: selectedItem?.data.source})

  return {
    authorization: store.auth.authorization,
    items: store.filterStore.filters,
    queries: store.queryStore.queries,
    queryLink,
    dataSourceLink,
    selectedItem,
    newQueryLink,
    selectedItemQuery,
    isAdvancedMode: store.filterStore.isAdvancedMode,
    dataSourceListLink,
  }
}

const mapActions = (dispatch: Dispatch, state: StateProps, navigation: PageNavigation): ActionProps => {
  return {
    onMove: (id: string, steps: number) => {
      dispatch(actions.filter.move({id, steps}))
    },
    onDeleteClick: (id: string) => {
      dispatch(actions.filter.delete({id}))
    },
    onItemClick: (id: string) => {
      dispatch(actions.filter.selected({id}))
    },
    onNewClick: (): void => {
      dispatch(actions.filter.create.request())
    },
    onChangeSingleChoice: (singleChoice) => {
      dispatch(actions.filter.singleChoiceChanged({
        id: state.selectedItem!.getId(),
        singleChoice,
      }))
    },
    onChangeField: (field) => dispatch(actions.filter.fieldChanged({
      id: state.selectedItem!.getId(),
      field,
    })),
    onChangeQuery: (query) => {
      dispatch(actions.filter.queryChanged({
        id: state.selectedItem!.getId(),
        query,
      }))
    },
    onChangeDataSource: (dataSource) => {
      dispatch(actions.filter.dataSourceChanged({
        id: state.selectedItem!.getId(),
        dataSource,
      }))
    },
    onChangeAutoFill: (autoFillMode) => {
      dispatch(actions.filter.autoFillModeChanged({
        id: state.selectedItem!.getId(),
        mode: autoFillMode,
      }))
    },
    onGoToQuery: (dataSource: string, query?: string): void => {
      if (!query) {
        navigation.navigate(PageType.CreateQuery, {dataSourceName: dataSource}, {target: '_blank'})
      } else {
        navigation.navigate(PageType.EditQuery, {dataSourceName: dataSource, name: query}, {target: '_blank'})
      }
    },
    onGoToDataSource: (dataSource?: string): void => {
      navigation.navigate(PageType.ViewDataSource, {name: dataSource}, {target: '_blank'})
    },
    onChange: (filter) => {
      dispatch(actions.filter.changed({filter, id: filter.id}))
    },
    onBackClick: () => {
      dispatch(actions.filter.selected({id: undefined}))
    },
    onAdvancedModeClick: (enabled = false) => {
      dispatch(actions.filter.advancedModeClick({enabled}))
    },
    onComparisonTypeChanged: (comparisonType: ComparisonType) => {
      dispatch(actions.filter.comparisonTypeChanged({
        id: state.selectedItem!.getId(),
        comparisonType,
      }))
    },
  }
}

export const FilterEditorContainer = connect(mapState, mapActions)(FilterEditorComponent)

