import React from 'react'
import { Box } from '@mui/material'
import { PanelButton } from '../buttons/PanelButton'
import { DeleteDialog } from '../dialogs/DeleteDialog'
import { Tooltip } from '../tooltip/Tooltip'

export interface Props {
  title?: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  testId?: string
  deleteConfirmMessage?: () => string
}

export const PanelTitleBarButton = (props: Props) => {
  const [open, setOpen] = React.useState(false)

  function onClick(event) {
    if (props.deleteConfirmMessage) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(true)
    } else {
      props.onClick?.()
    }
  }

  return <>
    <Box>
      {props.icon &&
        <Tooltip title={props.title}>
        <span> {/* Span required for disabled tooltip*/}
          <PanelButton
            onClick={onClick}
            disabled={props.disabled}
            data-testid={props.testId}
          >
            {props.icon}
          </PanelButton>
        </span>
        </Tooltip>
      }
      {!props.icon &&
        <PanelButton
          onClick={onClick}
          disabled={props.disabled}
        >
          {props.title}
        </PanelButton>
      }
    </Box>
    {props.deleteConfirmMessage && <DeleteDialog
      open={open}
      onCancel={() => {
        setOpen(false)
      }}
      onDelete={() => {
        props.onClick?.()
        setOpen(false)
      }}
      isDeleting={false}
      message={props.deleteConfirmMessage()}
    />}
  </>
}
