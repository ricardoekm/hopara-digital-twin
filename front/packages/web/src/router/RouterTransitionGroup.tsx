import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {styled} from '@hopara/design-system/src/theme'

const Box = styled('div', {name: 'HoparaRouteWrapper'})({
  display: 'grid',
  gridTemplateAreas: '"hopara"',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr',
})

const getClassName = (className: string, reverse?: boolean): string => {
  const classNames = [className]
  if (reverse) classNames.push(`${className}-reverse`)
  return classNames.join(' ')
}

const isLastLocationChildOfCurrent = (location: { pathname: string }, lastLocation: { pathname: string }): boolean => {
  if (!lastLocation.pathname || !location?.pathname) return false
  return lastLocation.pathname.startsWith(location.pathname + '/') && lastLocation.pathname.length > location.pathname.length
}

let lastLocation = {pathname: '/'}

class RouterTransitionGroup extends PureComponent<React.PropsWithChildren & { location: any }> {
  render() {
    const classPrefix = 'route-transition'
    const reverse = isLastLocationChildOfCurrent(location, lastLocation)
    lastLocation = location
    return (
      <TransitionGroup
        component={Box}
        childFactory={(child) => React.cloneElement(child, {
          classNames: {
            appear: getClassName(`${classPrefix}-appear`, reverse),
            appearActive: getClassName(`${classPrefix}-appear-active`, reverse),
            appearDone: getClassName(`${classPrefix}-appear-done`, reverse),
            enter: getClassName(`${classPrefix}-enter`, reverse),
            enterActive: getClassName(`${classPrefix}-enter-active`, reverse),
            enterDone: getClassName(`${classPrefix}-enter-done`, reverse),
            exit: getClassName(`${classPrefix}-exit`, reverse),
            exitActive: getClassName(`${classPrefix}-exit-active`, reverse),
            exitDone: getClassName(`${classPrefix}-exit-done`, reverse),
          },
        })}>
        <CSSTransition
          key={location.pathname}
          timeout={400}
        >
          {this.props.children}
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

export default RouterTransitionGroup
