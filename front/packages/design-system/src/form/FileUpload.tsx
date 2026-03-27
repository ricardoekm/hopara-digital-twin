import React from 'react'
import {Box, Typography} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {Icon} from '../icons/Icon'
import {useTheme} from '../theme'

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (file: File) => void
  accessToken?: string
  tenant?: string
  fileName?: string
  accept?: string[]
}

export const FileUpload: React.FC<Props> = (props) => {
  const theme = useTheme()
  const hoverLabel = i18n('CLICK_OR_DRAG_TO_UPLOAD_A_FILE')
  const dropLabel = i18n('DROP_A_FILE_HERE')
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const [supported, setSupported] = React.useState<boolean>(true)

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
      setSupported(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
      setSupported(true)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      const file = e.dataTransfer.items[0]
      if (!props.accept || props.accept.includes(file.type)) {
        setLabelText(dropLabel)
        setSupported(true)
      } else {
        setLabelText(i18n('FILE_TYPE_NOT_SUPPORTED'))
        setSupported(false)
      }
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
      setSupported(true)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setLabelText(hoverLabel)
      setIsDragOver(false)
      if (e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (!props.accept || props.accept.includes(file.type)) {
          setLabelText(file.name)
          props.onDrop(file)
        }
      }
      setSupported(true)
    },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLabelText(event.target.files[0].name)
      props.onChange(event)
    }
  }

  return (
    <>
      <input
        onChange={handleChange}
        accept={props.accept?.join(',')}
        style={{
          display: 'none',
        }}
        id="file-upload"
        type="file"
      />

      <label
        htmlFor="file-upload"
        {...dragEvents}
        style={{
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            'pointerEvents': 'none',
            'display': 'flex',
            'justifyContent': 'center',
            'alignItems': 'center',
            'cursor': 'pointer',
            'width': '100%',
            'boxSizing': 'border-box',
            'height': 150,
          }}
        >
          {(labelText || isDragOver || isMouseOver) && (
            <Box
              sx={{
                'display': 'flex',
                'justifyContent': 'center',
                'flexDirection': 'column',
                'alignItems': 'center',
                'border': `1px dashed ${theme.palette.spec.borderColor}`,
                'padding': '2em',
                'borderRadius': 4,
                'width': '100%',
                'textAlign': 'center',
                'opacity': isDragOver ? 1 : 0.7,
                '&:hover': {
                  '& p, & svg': {
                    opacity: 1,
                  },
                  '& img': {
                    opacity: 0.3,
                  },
                },
                ...(isDragOver && {
                  '& img': {
                    opacity: 0.1,
                  },
                  '& p, & svg': {
                    opacity: 1,
                  },
                }),
              }}
            >
              <Icon icon={supported ? 'upload' : 'alert'} size="lg"/>
              <Typography>{labelText}</Typography>
            </Box>
          )}
        </Box>
      </label>
    </>
  )
}
