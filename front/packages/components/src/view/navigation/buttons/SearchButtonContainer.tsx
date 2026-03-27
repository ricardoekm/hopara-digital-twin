import { Dispatch } from '@reduxjs/toolkit'
import { Store } from '../../../state/Store'
import { connect } from '@hopara/state'
import { ActionProps, SearchButton, StateProps } from './SearchButton'
import { useMemo } from 'react'
import actions from '../../../state/Actions'
import { PlaceDetail } from '../../../place/PlaceSearchRepository'

export const mapState = (store: Store): StateProps => {
  const searchRows = useMemo(
    () =>
      Object.keys(store.searchObjectListStore.rowsets).map((rowsetId) => {
        const layer = store.layerStore.layers.getSearchables().getByRowsetId(rowsetId)
        if ( !layer ) return undefined as any

        const query = store.queryStore.queries.findQuery(layer!.getPositionQueryKey())
        const rows = store.searchObjectListStore.rowsets[rowsetId].getPlacedRows().limit(3)
        return {rowsetId, layer, rows, columns: query!.getColumns()}
      }).filter((x) => x),
    [
      store.searchObjectListStore.rowsets,
      store.queryStore.queries,
      store.layerStore.layers
    ]
  )

  const hasRows = useMemo(
    () => searchRows.some((rowset) => rowset.rows.length > 0),
    [searchRows]
  )

  return {
    searchTerm: store.navigation.search.term,
    places: store.place.places,
    searchRows,
    isLoadingRows: store.searchObjectListStore.someLoading(),
    isLoadingAddresses: store.place.isLoading(),
    hasRows,
    hasPlaces: store.place.places.length > 0,
    authorization: store.auth.authorization,
    isGeo: store.visualizationStore.visualization?.isGeo(),
    isOpen: !!store.navigation.search.open,
    visualizationId: store.visualizationStore.visualization.id,
  }
}

export const mapActions = (
  dispatch: Dispatch,
  stateProps: StateProps
): ActionProps => {
  return {
    onSearch: (searchTerm?: string) => {
      dispatch(actions.navigation.searchRequested({ searchTerm }))
    },
    onPlaceClicked: (place: PlaceDetail) => {
      dispatch(actions.navigation.placeClicked({ place }))
    },
    onSearchRowClicked: (rowsetId: string, row: any) => {
      const searchRowset = stateProps.searchRows.find(
        (rowset) => rowset.rowsetId === rowsetId
      )
      dispatch(
        actions.navigation.searchRowClicked({
          rowsetId,
          row,
          layer: searchRowset.layer
        })
      )
    },
    onPopoverOpen: () => {
      dispatch(actions.navigation.onSearchOpen())
    },
    onPopoverClose: () => {
      dispatch(actions.navigation.onSearchClose())
    },
    onPopoverCloseClick: () => {
      dispatch(actions.navigation.onSearchCloseClicked())
    }
  }
}

export const SearchButtonContainer = connect(mapState, mapActions)(SearchButton)
