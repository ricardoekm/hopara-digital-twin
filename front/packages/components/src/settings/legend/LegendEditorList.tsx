import React from 'react'
import {Layers} from '../../layer/Layers'
import Case from 'case'
import {Box, Switch, Typography} from '@mui/material'
import { Legends } from '../../legend/Legends'
import {useTheme} from '@hopara/design-system/src'
import { i18n } from '@hopara/i18n'

interface Props {
  layers: Layers;
  legends: Legends;
  customizedLegendLayers: Layers;
  onChange(legends: Legends): void;
}

const LegendEditorItem = (props: {name: string, description: string, enabled: boolean, onChange?: () => void}) => {
  return <Box
    component="li"
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateRows: 'auto auto',
      gridTemplateAreas: '' +
        '"title toggle"' +
        '"description toggle"',
    }}
  >
    <Typography sx={{gridArea: 'title'}}>{props.name}</Typography>
    <Typography sx={{gridArea: 'description', opacity: 0.5}}>{props.description}</Typography>
    <Switch
      sx={{gridArea: 'toggle'}}
      checked={props.enabled}
      disabled={!props.onChange}
      onChange={props.onChange}
    />
  </Box>
}

export const LegendEditorList = (props: Props) => {
  const theme = useTheme()
  return (
    <Box
      component="ul"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        padding: '1em',
        margin: 0,
        [theme.breakpoints.down('sm')]: {
          borderBottom: `1px solid ${theme.palette.spec.borderColor}`,
        },
      }}>

      {props.layers.map((layer, index) => {
        const legend = props.legends.find((legend) => legend.layer === layer.getId())
        const isCustomized = legend?.items?.length
        return <LegendEditorItem
          key={index}
          name={layer.name}
          description={!isCustomized ? Case.title(layer.getColorEncoding()!.field ?? '') : i18n('CUSTOMIZED')}
          enabled={!!legend}
          onChange={!isCustomized ? () => {
            if (legend) {
              props.onChange(new Legends(...props.legends.filter((legend) => legend.layer !== layer.getId())))
            } else {
              props.onChange(new Legends(...[...props.legends, {layer: layer.getId()}]))
            }
          } : undefined} />
      })}

      {props.customizedLegendLayers.map((layer, index) => {
        return <LegendEditorItem
          key={'custom-' + index}
          name={layer.name}
          description={i18n('CUSTOMIZED')}
          enabled={true} />
      })}
    </Box>
  )
}
