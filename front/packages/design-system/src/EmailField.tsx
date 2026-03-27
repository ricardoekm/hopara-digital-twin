import React from 'react'
import {i18n} from '@hopara/i18n'
import {TextField} from './form/TextField'

export const EmailField: React.FunctionComponent<{
  emailValid?: boolean;
  setEmail: (_: string) => void
  inputRef?: React.MutableRefObject<HTMLInputElement | undefined>
  autoComplete?: string
  error?: boolean
  errorMessage?: string
}> = ({emailValid, setEmail, inputRef, autoComplete, error, errorMessage}) => {
  return (
    <TextField
      size="small"
      fullWidth = {true}
      hiddenLabel = {true}
      placeholder = {i18n('EMAIL')}
      error={emailValid === false || error}
      helperText={errorMessage}
      autoComplete={autoComplete}
      inputRef={inputRef}
      onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEmail(evt.target.value)
      }}
      testId="email-field"
      sx={{
        'transition': 'opacity 400ms ease-out',
        'maxWidth': '36ch',

        '.route-transition-enter &': { opacity: 0 },
        '.route-transition-enter-active &': { opacity: 1 },
        '.route-transition-enter-done &': { opacity: 1 },

        '.route-transition-exit &': { opacity: 1 },
        '.route-transition-exit-active &': { opacity: 0 },
        '.route-transition-exit-done &': { opacity: 0 },
      }}
    />
  )
}
