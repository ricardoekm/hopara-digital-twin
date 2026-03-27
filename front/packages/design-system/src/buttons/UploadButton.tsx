import React, { useRef } from 'react'
import { i18n } from '@hopara/i18n'
import { Icon } from '../icons/Icon'
import { CanvasNavigationButton } from '../navigation/CanvasNavigationButton'
import { Theme, withTheme } from '../theme'

export type UploadStatus = 'uploading' | 'processing'

interface Props {
  label?: string | React.ReactNode
  uploadingLabel?: string
  processingLabel?: string
  progress?: number
  status?: UploadStatus
  accept: string
  onUpload: (file: File) => void
  innerComponent: React.ReactElement
  theme: Theme
  disabled?: boolean
}

const getLabel = ({
  label,
  uploadingLabel,
  processingLabel,
  status,
}: Partial<Props>): React.ReactElement => {
  switch (status) {
    case 'uploading':
      return <>{uploadingLabel || i18n('UPLOADING_ELLIPSIS')}</>
    case 'processing':
      return <>{processingLabel || i18n('PROCESSING_ELLIPSIS')}</>
    default:
      return <>{label || i18n('UPLOAD')}</>
  }
}

const UploadButtonComponent: React.FC<Props> = (props) => {
  const { accept, status, onUpload, theme } = props
  const inputFile = useRef<HTMLInputElement | null>(null)
  const total = 56.45
  const seg1 = (props.progress ?? 0) / 100 * total
  const seg2 = total - seg1

  return (
    <>
      <input
        type='file'
        id='file'
        accept={accept}
        ref={inputFile}
        style={{ display: 'none' }}
        onClick={(event) => (event.target as any).value = ''}
        onChange={(event) => {
          event.stopPropagation()
          event.preventDefault()
          const file: File | null = event?.target?.files && event.target.files[0]
          return file && onUpload(file)
        }}
      />
      <CanvasNavigationButton
        disabled={props.disabled || status === 'uploading'}
        tooltipPlacement='top'
        label={getLabel(props)}
        onClick={() => (inputFile?.current as HTMLInputElement | null)?.click()}
        icon={<>
          {!props.status && <Icon icon="file-upload"/>}
          {props.status === 'processing' && <Icon icon="progress-activity"/>}
          {props.status === 'uploading' && props.progress === 100 &&
            <Icon icon='check' />
          }
          {props.status === 'uploading' && props.progress !== 100 &&
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: theme.palette.text.primary }}>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.25"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${seg1} ${seg2}`}
                strokeDashoffset="14.11"
              />
              <path d="M8.53033009,12.2803301 C8.26406352,12.5465966 7.84739984,12.5708027 7.55378835,12.3529482 L7.46966991,12.2803301 C7.1767767,11.9874369 7.1767767,11.5125631 7.46966991,11.2196699 L11.4696699,7.21966991 C11.7625631,6.9267767 12.2374369,6.9267767 12.5303301,7.21966991 L16.5303301,11.2196699 C16.8232233,11.5125631 16.8232233,11.9874369 16.5303301,12.2803301 C16.2374369,12.5732233 15.7625631,12.5732233 15.4696699,12.2803301 L12.69,9.5 L12.75,11.05 L12.75,16.25 C12.75,16.6642136 12.4142136,17 12,17 C11.5857864,17 11.25,16.6642136 11.25,16.25 L11.25,11.05 L11.31,9.5 L8.53033009,12.2803301 Z" fill="currentColor"></path>
            </svg>
          }
        </>}
      />
    </>
  )
}

export const UploadButton = withTheme<Props>(UploadButtonComponent)
