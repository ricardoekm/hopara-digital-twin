import React from 'react'
import { i18n } from '@hopara/i18n'
import { RowSavedStatus, SAVING_STATUSES } from './RowHistoryStore'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonLabel } from '@hopara/design-system/src/navigation/CanvasNavigationButtonLabel'
import { acceleratorForPlatform } from '@hopara/design-system/src/shortcuts'

interface Props {
  hasUndoRow?: boolean
  status?: RowSavedStatus
  fullVersion?: boolean
  onUndoClick: () => void
}

const getLabel = (props: Props) => {
  if (props.status === RowSavedStatus.saving) {
    return i18n('UPDATING_ELLIPSIS')
  }
  if (!props.hasUndoRow) {
    return i18n('NOTHING_TO_UNDO')
  }
  if (!props.fullVersion) {
    return <>
      {i18n('UNDO')}
      <span style={{ opacity: 0.5, paddingInlineStart: 3 }}>
        {acceleratorForPlatform('CmdOrCtrl+Z')}
      </span>
    </>
  }
  return acceleratorForPlatform('CmdOrCtrl+Z')
}

export const RowSavedStatusComponent = (props: Props) => {
  const isRowSaving = props.status && SAVING_STATUSES.includes(props.status)
  return <>
    <CanvasNavigationButton
      disabled={!props.hasUndoRow || isRowSaving}
      icon={isRowSaving ? 'progress-activity' : 'undo'}
      label={getLabel(props)}
      tooltipPlacement='top'
      onClick={props.onUndoClick}>
      {props.fullVersion ? (
        <CanvasNavigationButtonLabel>
          {isRowSaving ?
            i18n('UPDATING_ELLIPSIS') : i18n('UNDO')}
        </CanvasNavigationButtonLabel>
      ) : null}
    </CanvasNavigationButton>
  </>
}
