import React from 'react'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import transitionStyles from './SlideTransition.module.css'
import {PureComponent} from '../component/PureComponent'

export enum TransitionType {
  LEFT = 'left',
  RIGHT = 'right'
}

interface Props extends React.PropsWithChildren {
  transitionKey?: string
  transition: TransitionType,
  invert?: boolean
}

const cacheChildComponentOnTransition = (child: React.ReactElement<any>) => {
  if (child.props.in) return child
  return React.cloneElement(child, {...child.props, children: <></>})
}

export class SlideTransition extends PureComponent <Props> {
  render() {
    const inverted = this.props.invert !== false
    const isEnterToRight = (this.props.transition === TransitionType.RIGHT && !inverted) || (this.props.transition === TransitionType.LEFT && inverted)
    const isExitToRight = this.props.transition === TransitionType.RIGHT
    return (
      <TransitionGroup
        component={null}
        childFactory={cacheChildComponentOnTransition}
      >
        <CSSTransition
          key={this.props.transitionKey ?? this.props.transition}
          addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          classNames={{
            enter: isEnterToRight ? transitionStyles.enterInitFromRight : transitionStyles.enterInitFromLeft,
            enterActive: transitionStyles.enterEnd,
            exitActive: isExitToRight ? transitionStyles.exitToRight : transitionStyles.exitToLeft,
          }}>
          <div className={transitionStyles.transitionBlock} style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            {this.props.children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}
