import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import actions from '../../state/Actions'
import {Store} from '../../state/Store'

const waitAndHide = (visible, dispatch, timeout) => {
  return setTimeout(() => {
    if (visible) {
      dispatch(actions.navigation.hide())
    }
  }, timeout)
}

const getWaitTime = (firstTime: boolean) => firstTime ? 5000 : 30000

export const CanvasNavigationBarTransition = () => {
  const dispatch = useDispatch()
  const visible = useSelector((store: Store) => store.navigation.visible)
  // eslint-disable-next-line no-undef
  let timeoutId: NodeJS.Timeout | null = null
  let firstTime = true

  useEffect(() => {
    if (firstTime) {
      firstTime = false
      timeoutId = waitAndHide(
        visible,
        dispatch,
        getWaitTime(true))
    }

    const handleMouseMove = () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (!visible) return dispatch(actions.navigation.show())

      timeoutId = waitAndHide(
        visible,
        dispatch,
        getWaitTime(firstTime))
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [visible, timeoutId])

  return <></>
}


