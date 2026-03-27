import React from 'react'
import { i18n } from '@hopara/i18n'
import { FormHelperText, Box } from '@mui/material'
import { TextField } from '@hopara/design-system/src/form/TextField'
import { Dialog } from '@hopara/design-system/src/dialogs/Dialog'
import { DialogTitle } from '@hopara/design-system/src/dialogs/DialogTitle'
import { DialogContent } from '@hopara/design-system/src/dialogs/DialogContent'
import { DialogActions } from '@hopara/design-system/src/dialogs/DialogActions'
import { TemplateIcon } from '../../template/TemplateIcon'
import { useTheme } from '@hopara/design-system/src/theme'
import { DialogCloseButton } from '@hopara/design-system/src/dialogs/DialogCloseButton'
import {PillButton} from '@hopara/design-system/src/buttons/PillButton'

interface Props {
  name: string;
  open: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (name: string) => void;
  title: string;
  canUseSameName?: boolean;
  type?: string;
  placeholder?: string;
  helperText?: string;
}

export const EditDialog = (props: Props) => {
  const [name, setName] = React.useState(props.name)
  const [dirty, setDirty] = React.useState(false)
  const hasError = dirty && !name
  const theme = useTheme()

  const cancelClicked = () => {
    setName(props.name)
    setDirty(false)
    props.onCancel()
  }

  const saveClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!name) return
    props.onSave(name)
  }

  const nameChanged = (newValue) => {
    setName(newValue)
    setDirty(true)
  }

  return (
    <Dialog
      open={props.open}
      onClose={cancelClicked}
      fullWidth={true}
      onSubmit={saveClicked}
    >
      <DialogCloseButton onClick={props.onCancel} />
      <DialogContent>
        {props.type && (
          <Box
            sx={{
              color: theme.palette.primary.main,
              width: '100%',
              maxWidth: 128,
              display: 'grid',
              placeItems: 'center',
              margin: 'auto',
            }}
          >
            <Box sx={{transform: 'scale(1.3)', transformOrigin: 'top'}}>
              <TemplateIcon type={props.type} />
            </Box>
          </Box>
        )}
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <TextField
          sx={{marginTop: 24}}
          disabled={props.isSaving}
          autoFocus
          id="name"
          type="text"
          value={name}
          onSetValue={nameChanged}
          error={hasError}
          placeholder={props.placeholder ?? i18n('NAME')}
        />
        {dirty && !name && props.helperText && (
          <FormHelperText error={hasError}>
            {props.helperText}
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <PillButton
          disabled={
            props.isSaving
          }
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            props.onCancel()
          }}
        >
          {i18n('CANCEL')}
        </PillButton>
        <PillButton
          disabled={
            !name ||
            (name === props.name && !props.canUseSameName) ||
            props.isSaving
          }
          onClick={saveClicked}
          pillVariant="primary"
        >
          {props.isSaving ? i18n('SAVING_ELLIPSIS') : i18n('SAVE')}
        </PillButton>
      </DialogActions>
    </Dialog>
  )
}
