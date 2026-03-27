import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'
import { Box, Switch, Typography } from '@mui/material'
import { Grid } from '../../grid/Grid'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import { Slider } from '@hopara/design-system/src'
import { SizeEncoding } from '@hopara/encoding'
import { GridAdvancedEditorComponent } from './GridAdvancedEditorComponent'
import { classToPlain } from 'class-transformer'

export interface StateProps {
  layerGrids: {name: string, id: string, grid?: Grid}[]
  schema: any
  grids: Grid[]
  zoom: number
}

export interface ActionProps {
  onEnable(layerId: string): void
  onSizeChanged(layerId: string, encoding: SizeEncoding): void
  onStrokeSizeChanged(layerId: string, encoding: SizeEncoding): void
  onCodeChange(code: any): void
}

type Props = StateProps & ActionProps

const GridItem = (props: {
  name: string,
  layerId: string,
  description?: string,
  grid?: Grid,
  zoom: number,
  onEnable: (layerId:string) => void,
  onSizeChanged: (layerId:string, encoding: SizeEncoding) => void,
  onStrokeSizeChanged: (layerId:string, encoding: SizeEncoding) => void
}) => {
  return (
    <Box component="li" sx={{display: 'grid'}}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: '' +
          '"title toggle"' +
          '"description toggle"',
      }}>
        <Typography sx={{gridArea: 'title'}}>{props.name}</Typography>
        {props.description && <Typography sx={{gridArea: 'description', opacity: 0.5}}>{props.description}</Typography>}
        <Switch
          sx={{gridArea: 'toggle'}}
          checked={!!props.grid}
          onChange={() => props.onEnable(props.layerId)}
        />
      </Box>
      {props.grid && <Box sx={{paddingBottom: '1em'}}>
        <PanelField
          layout="inline"
          title={i18n('CELL_SIZE')}
        >
          <Slider
            value={Math.round(props.grid.encoding.size!.getPixelValue(props.zoom))}
            onChange={(e: any) => props.onSizeChanged(props.layerId, new SizeEncoding({
              ...props.grid!.encoding.size,
              value: Number(e.target?.value ?? 0),
              referenceZoom: props.zoom,
            }))}
            min={1}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(0)} />
        </PanelField>
        <PanelField
          layout="inline"
          title={i18n('BORDER_SIZE')}
        >
          <Slider
            value={Math.round(props.grid.encoding.strokeSize!.getPixelValue(props.zoom))}
            onChange={(e: any) => props.onStrokeSizeChanged(props.layerId, new SizeEncoding({
              ...props.grid!.encoding.strokeSize,
              value: Number(e.target?.value ?? 0),
              referenceZoom: props.zoom,
            }))}
            min={1}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(0)} />
        </PanelField>
      </Box>}
    </Box>
  )
}

export class GridEditorComponent extends PureComponent<Props, {isAdvancedMode: boolean}> {
  constructor(props) {
    super(props)
    this.state = {isAdvancedMode: false}
  }

  render() {
    if (this.state.isAdvancedMode) {
      return <GridAdvancedEditorComponent
        obj={classToPlain(this.props.grids)}
        schema={this.props.schema}
        onBackClick={() => this.setState({isAdvancedMode: false})}
        onChange={this.props.onCodeChange}
      />
    }

    return <SubPanelWrapper>
      <SubPanel
        header={<PanelTitleBar
          title={i18n('GRID')}
          buttons={[
            <MoreButton
              menuItems={[{label: i18n('ADVANCED_MODE'), onClick: () => this.setState({isAdvancedMode: true})}]}
              key="more"/>
          ]}
        />}
      >
      <Box
        component="ul"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          padding: '1em',
          margin: 0,
        }}>
          {(this.props.layerGrids.length) && this.props.layerGrids.map((layer) => {
            return <GridItem
              key={layer.id}
              layerId={layer.id}
              name={layer.name}
              grid={layer.grid}
              zoom={this.props.zoom}
              onEnable={this.props.onEnable}
              onSizeChanged={this.props.onSizeChanged}
              onStrokeSizeChanged={this.props.onStrokeSizeChanged}
            />
          })}
        </Box>
      </SubPanel>
    </SubPanelWrapper>
  }
}
