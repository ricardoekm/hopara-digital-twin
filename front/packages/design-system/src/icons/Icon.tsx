import React from 'react'
import CustomIcon, {CustomIconKey, customIconKeys, customIcons} from './CustomIcon'
import {PictogrammerIcon, PictogrammerIconKey, pictogrammerIconKeys, pictogrammerIcons} from './PictogrammerIcons'

export const sizeToPx = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 72,
}


export const hoparaIconKeys = [
  ...customIconKeys,
  ...pictogrammerIconKeys,
].sort((a, b) => {
  if (a.includes('layer') && !b.endsWith('layer')) return 1
  if (b.includes('layer') && !a.endsWith('layer')) return -1
  return a.localeCompare(b)
}) as HoparaIconKey[]

export type HoparaIconKey = PictogrammerIconKey | CustomIconKey

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'| number;
  style?: any;
  icon: HoparaIconKey;
  color?: string;
}

export const Icon = (props: Props): React.ReactElement => {
  const size = typeof props.size === 'number' ? props.size : sizeToPx[props.size ?? 'md']

  const iconProps = {
    size,
    icon: props.icon,
    color: props.color,
    style: props.style,
  }

  if (customIcons[props.icon]) {
    return <CustomIcon {...iconProps} icon={props.icon as CustomIconKey}/>
  }
  if (pictogrammerIcons[props.icon]) {
    return <PictogrammerIcon {...iconProps} icon={props.icon as PictogrammerIconKey}/>
  }
  throw new Error(`Icon ${props.icon} not found`)
}
