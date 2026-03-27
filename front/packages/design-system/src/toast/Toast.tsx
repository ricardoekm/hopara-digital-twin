import React from 'react'
import {toast} from 'sonner'
import {i18n} from '@hopara/i18n'
import { ToastIcon } from './ToastIcon'

export const toastSuccess = (message: string, onUndo?: () => void) => {
  return toast.success(message, {
    icon: <ToastIcon icon="success" size={20} />,
    action: onUndo ? {
      label: i18n('UNDO'),
      onClick: onUndo
    } : undefined,
  })
}

export const toastError = (toastContent: string) => {
  return toast.error(toastContent, {
    icon: <ToastIcon icon="error" size={20} />,
  })
}

export const toastInfo = (toastContent: string) => {
  return toast.info(toastContent, {
    icon: <ToastIcon icon="info" size={20} />,
  })
}

const window: any = global
window.TOAST = {
  toastSuccess,
  toastError,
}
