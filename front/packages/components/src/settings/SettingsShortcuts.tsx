import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import actions from '../state/Actions'
import {Store} from '../state/Store'
import {VisualizationEditStatus} from '../visualization/VisualizationEditStatus'

export function SettingsShortcuts() {
  const dispatch = useDispatch()
  const canSave = useSelector((state: Store) => state.visualizationStore.editStatus) === VisualizationEditStatus.DIRTY

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (canSave) {
          dispatch(actions.visualization.save.request())
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, canSave])

  return (<></>)
}
