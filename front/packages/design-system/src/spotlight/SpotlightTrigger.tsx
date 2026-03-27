import React from 'react'
import {connect} from '@hopara/state'
import {Dispatch} from '@reduxjs/toolkit'
import {Link} from '../Link'
import {PureComponent} from '../component/PureComponent'
import {spotlightActions} from './state/SpotlightActions'

interface ActionProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface StateProps {
  elementId: string;
  children: React.ReactNode;
}

type Props = StateProps & ActionProps

export class Comp extends PureComponent<Props> {
  render() {
    return <Link
      spotlightLink
      onMouseEnter={this.props.onMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
    >{this.props.children}</Link>
  }
}

const mapActions = (dispatch: Dispatch, props: StateProps): ActionProps => {
  return {
    onMouseEnter: () => {
      dispatch(spotlightActions.open({elementId: props.elementId}))
    },
    onMouseLeave: () => {
      dispatch(spotlightActions.close())
    },
  }
}

export const SpotlightTrigger = connect<StateProps, ActionProps, StateProps>(undefined, mapActions)(Comp)
