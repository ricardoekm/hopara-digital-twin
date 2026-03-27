import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import actions from '../../state/Actions'

export function ObjectEditorShortcuts() {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return
        }
        event.preventDefault()
        dispatch(actions.object.undoRequest())
      }
      if (event.key === 'Delete') {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return
        }
        event.preventDefault()
        dispatch(actions.object.unplaceRequest())
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])

  return (<></>)
}
