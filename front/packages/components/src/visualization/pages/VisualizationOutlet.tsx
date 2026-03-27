import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {Store} from '../../state/Store'
import {Authorization} from '@hopara/authorization'
import {Dispatch} from '@reduxjs/toolkit'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {getInitialRouteParams} from '../VisualizationRouteProvider'
import {DetailsState} from '../../details/state/DetailsReducer'
import {DetailsContainer} from '../../details/visualization/DetailsContainer'
import Visualization from '../../visualization/Visualization'
import {Filters} from '../../filter/domain/Filters'
import ViewState from '../../view-state/ViewState'
import {Floor} from '../../floor/Floor'
import {SelectedFilters} from '../../filter/domain/SelectedFilters'
import {PanelWrapper} from '@hopara/design-system/src/VisualizationLayout'
import {CanvasNavigationBarTransition} from '../../view/navigation/CanvasNavigationBarTransition'
import FilterListContainer from '../../filter/FilterListContainer'

interface StateProps {
  authorization: Authorization
  filters?: Filters
  visualization?: Visualization
  details?: DetailsState
  selectedMenuItemId?: string
  viewState?: ViewState
  currentFloor?: Floor
  fallbackVisualizationId?: string
  selectedFilters: SelectedFilters
  isFiltersActivated: boolean
}

interface DispatchProps {
  onLoad: () => void
}

type Props = StateProps & DispatchProps

class VisualizationOutlet extends PureComponent<Props> {
  componentDidMount() {
    this.props.onLoad()
  }

  render() {
    const showDetailsComponent = this.props.details?.row && this.props.details.layerId && !this.props.isFiltersActivated

    return (
      <>
        {!this.props.isFiltersActivated && <CanvasNavigationBarTransition/>}
        {showDetailsComponent &&
          <PanelWrapper>
            <DetailsContainer />
          </PanelWrapper>
        }
        {this.props.isFiltersActivated &&
          <PanelWrapper opaqueBackground>
            <FilterListContainer />
          </PanelWrapper>
        }
      </>
    )
  }
}

const mapStateToProps = (state: Store): StateProps => {
  return {
    authorization: state.auth.authorization,
    filters: state.filterStore.filters,
    visualization: state.visualizationStore.visualization,
    details: state.details,
    viewState: state.viewState,
    currentFloor: state.floorStore.getCurrent(),
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
    selectedFilters: state.filterStore.selectedFilters,
    isFiltersActivated: state.filterStore.activated,
  }
}

const mapDispatchToProps = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): DispatchProps => {
  return {
    onLoad: async () => {
      const params = getInitialRouteParams(
        navigation.getLocation(),
        navigation.getRouteParams().visualizationId,
        stateProps.fallbackVisualizationId,
        navigation.getRouteParams().tenant,
      )

      dispatch(actions.visualization.pageLoaded({
        params,
        tenant: stateProps.authorization.tenant,
      }))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisualizationOutlet)
