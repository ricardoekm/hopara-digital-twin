import React from 'react'
import {Box, Typography} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {Image} from '../image/Image'
import {Icon} from '../icons/Icon'

type FileUploadProps = {
  size?: number
  imageUrl: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
  accessToken?: string
  tenant?: string
}

export const IconUpload: React.FC<FileUploadProps> = (props) => {
  const hoverLabel = i18n('CLICK_OR_DRAG_TO_UPLOAD_AN_ICON')
  const dropLabel = i18n('DROP_AN_ICON_HERE')
  const size = props.size ?? 300
  const gridSize = size / 23
  const [imageUrl, setImageUrl] = React.useState(props.imageUrl)
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setLabelText(hoverLabel)
      setIsDragOver(false)
      if (e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type === 'image/png' || file.type === 'image/svg+xml') {
          setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]))
          props.onDrop(e)
        }
      }
    },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageUrl(URL.createObjectURL(event.target.files[0]))
      props.onChange(event)
    }
  }

  return (
    <>
      <input
        onChange={handleChange}
        accept={'image/png, image/svg+xml'}
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
          width: size,
          cursor: 'pointer',
        }}
      >
        <Box
          width={size}
          height={size}
          sx={{
            'display': 'grid',
            'gap': 10,
            'placeItems': 'center',
            'color': 'black',
            'textAlign': 'center',
            'borderRadius': '25px',
            'pointerEvents': 'none',
            'border': '1px solid rgba(0,0,0,0.1)',
            'backgroundSize': `${gridSize}px ${gridSize}px`,
            'boxShadow': '0px 2px 5px -2px rgba(0, 0, 0, 0.22)',
            'backgroundColor': 'white',
            'backgroundImage': `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            'backgroundPosition': '-2px -2px',
            '& p, & svg': {
              opacity: 0.7,
            },
            '&:hover': {
              '& p, &:hover svg, & img': {
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
          {imageUrl && (
            <Box height={size} width={size} sx={{gridArea: '1/1/2/2'}}>
              <Image
                src={imageUrl}
                sx={{
                  height: 'inherit',
                  maxWidth: size,
                  filter: 'brightness(0)',
                  opacity: 0.4,
                }}
              />
            </Box>
          )}

          {(!imageUrl || isDragOver || isMouseOver) && (
            <Box sx={{gridArea: '1/1/2/2'}}>
              <Box sx={{alignSelf: 'end'}}>
                <Icon icon="upload" size="lg"/>
              </Box>
              <Typography sx={{alignSelf: 'start', maxWidth: '26ch'}}>{labelText}</Typography>
            </Box>
          )}
        </Box>
      </label>
    </>
  )
}
