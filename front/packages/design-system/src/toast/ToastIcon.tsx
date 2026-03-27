import React from 'react'
import { Icon, HoparaIconKey } from '../icons/Icon'

interface ToastIconProps {
  icon: HoparaIconKey
  size?: number
}

export const ToastIcon: React.FC<ToastIconProps> = ({ icon, size }) => {
  return <Icon icon={icon} size={size} />
}
