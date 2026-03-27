import React from 'react'
import {connect} from '@hopara/state'
import {SpotlightStore} from './state/SpotlightStore'
import {Spotlight} from './Spotlight'
import { PureComponent } from '../component/PureComponent'
import { Theme } from '../theme'

interface StateProps {
  elementId?: string;
}

class Comp extends PureComponent<StateProps & { theme: Theme }> {
  static displayName = 'SpotlightContainer'

  render() {
    return <Spotlight {...this.props} />
  }
}

const mapState = (state: {spotlight: SpotlightStore}): StateProps => {
  return {
    elementId: state.spotlight.elementId,
  }
}

export const SpotlightContainer = connect<StateProps, {}, StateProps>(
  mapState,
)(Comp)
