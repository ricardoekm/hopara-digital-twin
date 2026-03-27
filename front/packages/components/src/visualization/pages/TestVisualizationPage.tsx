import {PureComponent} from '@hopara/design-system'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {getInitialRouteParams} from '../VisualizationRouteProvider'

class ViewTestVisualizationPage extends PureComponent<any> {
  componentDidMount(): void {
    this.props.onLoad()
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => ({
  authorization: state.auth.authorization,
})

const mapDispatchToProps = (dispatch, stateProps, navigation) => ({
  onLoad: () => {
    dispatch(actions.visualization.pageLoaded({
      params: getInitialRouteParams(
        navigation.getLocation(),
        navigation.getRouteParams().visualizationId,
        stateProps.fallbackVisualizationId,
        navigation.getRouteParams().tenant,
      ),
      tenant: stateProps.authorization.tenant,
    }))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewTestVisualizationPage)
