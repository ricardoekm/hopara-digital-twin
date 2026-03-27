import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import ViewState from '../../view-state/ViewState'
import {PureComponent} from '@hopara/design-system'
import {Slider, Select, TextField} from '@hopara/design-system/src'
import { PanelCard } from '@hopara/design-system/src/panel/PanelCard'
import { PanelGroup } from '@hopara/design-system/src/panel/PanelGroup'
import { DEFAULT_PADDING, MAX_PADDING } from '../../zoom/translate/BoundsPadding'
import {PositionType, Position} from '../../view-state/ViewState'
import {VisualizationType} from '../../visualization/Visualization'
import { PillButton } from '@hopara/design-system/src/buttons/PillButton'

export interface StateProps {
  canEditInitialPosition: boolean
  viewState: ViewState
  initialPosition?: Position
  visualizationType: VisualizationType
  layerOptions: Array<{value: string, label: string}>
}

export interface ActionProps {
  onSetInitialPosition: () => void
  onTypeChange: (type: PositionType) => void
  onPaddingChange: (padding: number) => void
  onPositionChange: (position: Partial<Position>) => void
  onLayerChange: (layerId: string) => void
}

type Props = StateProps & ActionProps

interface FixedInitialPositionEditorProps {
  initialPosition?: Position
  onSetInitialPosition: () => void
  onPositionChange: (position: Partial<Position>) => void
  visualizationType: VisualizationType
}

const FixedInitialPositionEditor = ({
  initialPosition,
  onSetInitialPosition,
  onPositionChange,
  visualizationType
}: FixedInitialPositionEditorProps) => {
  const isGeo = visualizationType === VisualizationType.GEO
  const is3D = visualizationType === VisualizationType.THREE_D

  return <>
    {/* Position fields - different labels for GEO vs others */}
    <PanelField
      title={isGeo ? i18n('LONGITUDE') : i18n('X')}
      layout="inline"
    >
      <TextField
        value={initialPosition?.x ? Number(initialPosition.x).toFixed(2) : '0.00'}
        onChange={(e) => onPositionChange({x: Number(e.target.value)})}
        size="small"
      />
    </PanelField>

    <PanelField
      title={isGeo ? i18n('LATITUDE') : i18n('Y')}
      layout="inline"
    >
      <TextField
        value={initialPosition?.y ? Number(initialPosition.y).toFixed(2) : '0.00'}
        onChange={(e) => onPositionChange({y: Number(e.target.value)})}
        size="small"
      />
    </PanelField>

    {/* Z field only for 3D */}
    {is3D && (
      <PanelField title={i18n('Z')} layout="inline">
        <TextField
          value={initialPosition?.z ? Number(initialPosition.z).toFixed(2) : '0.00'}
          onChange={(e) => onPositionChange({z: Number(e.target.value)})}
          size="small"
        />
      </PanelField>
    )}

    {/* Zoom field */}
    <PanelField title={i18n('ZOOM')} layout="inline">
      <TextField
        value={initialPosition?.zoom ? Number(initialPosition.zoom).toFixed(2) : '0.00'}
        onChange={(e) => onPositionChange({zoom: Number(e.target.value)})}
        size="small"
      />
    </PanelField>

    {/* Bearing field only for GEO */}
    {isGeo && (
    <PanelField title={i18n('BEARING')} layout="inline">
      <TextField
        value={initialPosition?.bearing ? Number(initialPosition.bearing).toFixed(2) : '0.00'}
        onChange={(e) => onPositionChange({bearing: Number(e.target.value)})}
        size="small"
      />
    </PanelField>
    )}

    {/* Set Current as Initial Button */}
    <PanelField layout="inline">
      <PillButton
        onClick={onSetInitialPosition}
        pillVariant="primary"
        smallButton
      >
        {i18n('SET_CURRENT_AS_INITIAL')}
      </PillButton>
    </PanelField>
  </>
}

interface FitContentInitialPositionEditorProps {
  padding: number
  onPaddingChange: (padding: number) => void
  layerId?: string
  onLayerChange: (layerId: string) => void
  layerOptions: Array<{value: string, label: string}>
}

const FitContentInitialPositionEditor = ({
  padding,
  onPaddingChange,
  layerId,
  onLayerChange,
  layerOptions
}: FitContentInitialPositionEditorProps) => {
  return <>
    <PanelField
      title={i18n('LAYER')}
      layout="inline"
    >
      <Select
        options={layerOptions}
        value={layerId || ''}
        onChange={(e) => onLayerChange(e.target.value)}
      />
    </PanelField>

    <PanelField
      title={i18n('PADDING')}
      layout="inline"
    >
      <Slider
        min={0}
        max={MAX_PADDING}
        value={padding ?? DEFAULT_PADDING}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
        onChange={(event, value) => onPaddingChange(value as number)}
      />
    </PanelField>
  </>
}

export class InitialPositionEditor extends PureComponent<Props> {
  render() {
    if (!this.props.canEditInitialPosition) return null
    const initialPositionType = this.props.initialPosition?.type || PositionType.FIXED
    const padding = this.props.initialPosition?.padding ?? DEFAULT_PADDING

    return (
      <PanelCard title={i18n('INITIAL_POSITION')}>
        <PanelGroup>
          <PanelField title={i18n('MODE')} layout="inline">
            <Select
              options={[
                { value: PositionType.FIXED, label: i18n('FIXED') },
                { value: PositionType.FIT_TO_CONTENT, label: i18n('FIT_CONTENT') },
              ]}
              value={initialPositionType || PositionType.FIXED}
              onChange={(e) => this.props.onTypeChange(PositionType[e.target.value])}
            />
          </PanelField>

          {initialPositionType === PositionType.FIXED && <FixedInitialPositionEditor
            initialPosition={this.props.initialPosition}
            onSetInitialPosition={this.props.onSetInitialPosition}
            onPositionChange={this.props.onPositionChange}
            visualizationType={this.props.visualizationType}
          />}

          {initialPositionType === PositionType.FIT_TO_CONTENT && <FitContentInitialPositionEditor
            padding={padding}
            onPaddingChange={this.props.onPaddingChange}
            layerId={this.props.initialPosition?.layerId}
            onLayerChange={this.props.onLayerChange}
            layerOptions={this.props.layerOptions}
          />}
        </PanelGroup>
      </PanelCard>
    )
  }
}
