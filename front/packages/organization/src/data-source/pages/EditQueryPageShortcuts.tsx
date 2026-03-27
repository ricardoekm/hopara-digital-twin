import React, {useEffect} from 'react'

interface Props {
  onRunCmd: () => void
  onSaveCmd: () => void
}

export function useQueryPageShortcuts(props: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        props.onRunCmd()
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        props.onSaveCmd()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [props.onRunCmd])

  return (<></>)
}
