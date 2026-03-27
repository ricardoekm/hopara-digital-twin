import React, {useState} from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import {i18n} from '@hopara/i18n'
import {TextField} from './form'
import {Icon} from './icons/Icon'

export const PasswordField: React.FunctionComponent<{
  placeholder?: string
  passwordValid: boolean
  setPassword: (_: string) => void
  autoComplete?: string
  autoFocus?: boolean
  error?: string
}> = ({placeholder, passwordValid, setPassword, autoComplete, autoFocus = false, error}) => {
  const [visible, setVisibility] = useState(false)
  const placeholderText = placeholder || i18n('PASSWORD')
  const dataTestId = `${placeholderText}-field`

  return (
    <TextField
      data-dd-privacy="mask"
      type={visible ? 'text' : 'password'}
      size="small"
      hiddenLabel={true}
      placeholder={placeholderText}
      fullWidth={true}
      error={!passwordValid}
      helperText={error}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              aria-label="toggle password visibility"
              onMouseDown={() => setVisibility(!visible)}
              edge="end"
            >
              <Icon icon={visible ? 'eye-off' : 'eye'}/>
            </IconButton>
          </InputAdornment>,
      }}
      onChange={
        (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
          setPassword(evt.target.value)
        }
      }
      testId={dataTestId}
      sx={{
        '& > div': {
          display: 'grid !important',
          gridTemplateColumns: '1fr !important',
        },
        '& > div > input': {
          gridArea: '1/1/2/2 !important',
        },
        '& > div > div': {
          gridArea: '1/1/2/2 !important',
          justifySelf: 'end !important',
          alignSelf: 'center !important',
        },
      }}
    />
  )
}

