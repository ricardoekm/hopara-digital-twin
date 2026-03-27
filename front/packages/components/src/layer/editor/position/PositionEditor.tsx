import React from 'react'
import {Select, SelectOption} from '@hopara/design-system/src/form'
import {Data, PositionEncoding} from '@hopara/encoding'
import FieldEditor from '../field/FieldEditor'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {i18n} from '@hopara/i18n'
import {VisualizationType} from '../../../visualization/Visualization'
import {LayerType} from '../../LayerType'
import {PureComponent} from '@hopara/design-system'
import {DataRef, isDataRef} from '@hopara/encoding/src/data/DataRef'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {Layers} from '../../Layers'
import {PositionType} from '@hopara/encoding/src/position/PositionEncoding'
import {Columns, NULL_COLUMNS, INTERNAL_DATA_SOURCE} from '@hopara/dataset'
import { Switch } from '@mui/material'

export interface StateProps {
  visualizationScope: string
  encoding?: PositionEncoding
  coordinatesOptions: SelectOption[]
  xyzOptions: SelectOption[]
  floorOptions: SelectOption[]
  visualizationType: VisualizationType
  layerData: Data
  hasPrimaryKey?: boolean
  layerId: string
  layerType: LayerType
  refLayerOptions: Layers
  refLayerIsCoordinatesBased: boolean
  positionQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (encoding: PositionEncoding) => void
  onTypeChange: (type: PositionType) => void
}

type Props = StateProps & ActionProps

export class PositionEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  updateEncoding(newEncoding: PositionEncoding) {
    this.props.onChange(newEncoding)
    return newEncoding
  }

  updateType(newType: PositionType) {
    this.props.onTypeChange(newType)
  }

  handleCoordinateFieldChange(field: string) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      coordinates: {
        ...this.props.encoding?.coordinates,
        field,
      },
    }))
  }

  handleXFieldChange(field: string) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      x: {
        ...this.props.encoding?.x,
        field,
      },
    }))
  }

  handleYFieldChange(field: string) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      y: {
        ...this.props.encoding?.y,
        field,
      },
    }))
  }

  handleZFieldChange(field: string) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      z: {
        ...this.props.encoding?.z,
        field,
      },
    }))
  }

  handleY2FieldChange(field: string) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      y2: {
        ...this.props.encoding?.y2,
        field,
      },
    }))
  }

  handleFloorFieldChange(field: string) {
    if (!field) {
      this.updateEncoding(new PositionEncoding({
        ...this.props.encoding,
        floor: undefined,
      }))
    } else {
      this.updateEncoding(new PositionEncoding({
        ...this.props.encoding,
        floor: {
          ...this.props.encoding?.floor,
          field,
        },
      }))
    }
  }

  handleSourceChange(e: { target: { value: any } }) {
    if (e.target.value === PositionType.MANAGED) {
      this.updateType(PositionType.MANAGED)
    } else if (e.target.value === PositionType.REF) {
      this.updateType(PositionType.REF)
    } else {
      this.updateType(PositionType.CLIENT)
    }
  }

  isCoordinatesLayer(layerType: LayerType, visualizationType: VisualizationType) {
    if (layerType === LayerType.line && visualizationType === VisualizationType.CHART) {
      return false
    }

    return layerType === LayerType.line || layerType === LayerType.polygon || layerType === LayerType.image
  }

  hasFloor(visualizationType: VisualizationType) {
    return visualizationType === VisualizationType.GEO || visualizationType === VisualizationType.WHITEBOARD
  }

  getValue(): PositionType | undefined {
    if ( this.props.encoding?.getType() ) return this.props.encoding?.getType() 

    // Null columns indicate that the query is still loading, so we assume managed
    if ( this.props.hasPrimaryKey || this.props.positionQueryColumns === NULL_COLUMNS ) {
      return PositionType.MANAGED
    } else {
      return PositionType.CLIENT
    }
  }

  canChangePositionFields() {
    return this.getValue() === PositionType.CLIENT || (!this.props.encoding?.getType() && this.props.visualizationType === VisualizationType.CHART)
  }

  handleRefLayerChange(e: { target: { value: any } }) {
    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      data: new DataRef(e.target.value ? {layerId: e.target.value} : undefined),
    }))
  }

  getRefLayerOptions() {
    return this.props.refLayerOptions?.map((layer) => ({
      value: layer.getId(),
      label: layer.name,
    })) ?? []
  }

  canChangePositionType() {
    return this.props.visualizationType !== VisualizationType.CHART
  }

  getOptions(currentOption?: PositionType) {
    let options = [
      {value: PositionType.MANAGED, label: i18n('PLACE_IN_OBJECT_EDITOR')},
      {value: PositionType.CLIENT, label: i18n('I_HAVE_IT_IN_MY_DATA')},
    ]

    options.push({value: PositionType.REF, label: i18n('REFERENCE_ANOTHER_LAYER')})

    if (this.props.layerData.source === INTERNAL_DATA_SOURCE) {
      options = options.filter((option) => option.value !== PositionType.CLIENT)
    }

    if (currentOption === PositionType.CUSTOM) {
      options.push({value: PositionType.CUSTOM, label: i18n('CUSTOM_POSITION')})
    }

    if (currentOption === PositionType.FIXED) {
      options.push({value: PositionType.FIXED, label: i18n('FIXED')})
    }

    return options
  }

  showSharePosition() {
    return this.getValue() === PositionType.MANAGED
  }

  handleSharePositionChange() {
    const scope = this.isSharingPosition() ? this.props.layerId : this.props.visualizationScope

    this.updateEncoding(new PositionEncoding({
      ...this.props.encoding,
      scope,
    }))
  }

  isSharingPosition() {
    return this.props.encoding?.isSharedScope(this.props.visualizationScope)
  }

  render() {
    return (
      <PanelGroup
        inline={this.canChangePositionType()}
        title={this.canChangePositionType() ? i18n('SOURCE') : undefined}
        helperText={this.canChangePositionType() && this.props.hasPrimaryKey == false ? i18n('PLEASE_SET_A_PRIMARY_KEY_IN_THE_QUERY_TO_USE_THIS_OPTION') : undefined}
        secondaryAction={this.canChangePositionType() &&
          <Select
            testId='select-source-position'
            disabled={this.props.hasPrimaryKey === false}
            value={this.getValue()}
            options={this.getOptions(this.getValue())}
            onChange={this.handleSourceChange.bind(this)}
            enableCustomization={true}
          />
        }>

        {this.showSharePosition() && (
          <PanelField
            layout="inline"
            helperText={i18n('SHARE_POSITION_HELPER')}
            title={i18n('SHARE_POSITION')}
          >
            <Switch
              size="small"
              onChange={this.handleSharePositionChange.bind(this)}
              checked={this.isSharingPosition()}
            />
          </PanelField>)}

        {this.canChangePositionFields() && this.isCoordinatesLayer(this.props.layerType, this.props.visualizationType) &&
          <FieldEditor
            key="coordinatesSelect"
            layout="inline"
            field={this.props.encoding?.coordinates?.field}
            columns={this.props.positionQueryColumns}
            options={this.props.coordinatesOptions}
            onChange={this.handleCoordinateFieldChange.bind(this)}
            title={i18n('COORDINATES')}
            includeNullOption={true}
            nullOptionLabel={i18n('NONE_FEMALE')}
            testId="select-coordinates"
          />
        }

        {this.canChangePositionFields() && !this.isCoordinatesLayer(this.props.layerType, this.props.visualizationType) &&
          <>
            <FieldEditor
              key="xSelect"
              layout="inline"
              field={this.props.encoding?.x?.field}
              columns={this.props.positionQueryColumns}
              options={this.props.xyzOptions}
              onChange={(field) => this.handleXFieldChange(field)}
              title={this.props.visualizationType === VisualizationType.GEO ? i18n('LONGITUDE') : i18n('X')}
              includeNullOption={true}
              nullOptionLabel={this.props.visualizationType === VisualizationType.GEO ? i18n('NONE_FEMALE') : i18n('NONE')}
              testId="select-longitude"
            />

            <FieldEditor
              key="ySelect"
              layout="inline"
              field={this.props.encoding?.y?.field}
              columns={this.props.positionQueryColumns}
              options={this.props.xyzOptions}
              onChange={(field) => this.handleYFieldChange(field)}
              title={this.props.visualizationType === VisualizationType.GEO ? i18n('LATITUDE') : i18n('Y')}
              includeNullOption={true}
              nullOptionLabel={this.props.visualizationType === VisualizationType.GEO ? i18n('NONE_FEMALE') : i18n('NONE')}
              testId="select-latitude"
            />

            {this.props.visualizationType === VisualizationType.THREE_D &&
              <FieldEditor
                key="zSelect"
                layout="inline"
                field={this.props.encoding?.z?.field}
                columns={this.props.positionQueryColumns}
                options={this.props.xyzOptions}
                onChange={(field) => this.handleZFieldChange(field)}
                title={i18n('Z')}
                includeNullOption={true}
              />
            }
          </>
        }

        {this.canChangePositionFields() && this.hasFloor(this.props.visualizationType) &&
          <FieldEditor
            key="floorSelect"
            layout="inline"
            field={this.props.encoding?.floor?.field}
            columns={this.props.positionQueryColumns}
            options={this.props.floorOptions}
            onChange={this.handleFloorFieldChange.bind(this)}
            title={i18n('FLOOR')}
            includeNullOption={true}
            testId="select-floor"
          />
        }

        {isDataRef(this.props.encoding?.data) && this.hasFloor(this.props.visualizationType) &&
          <PanelField
            layout="inline"
            title={i18n('REFERENCE_LAYER')}
          >
            <Select
              key="layerSelect"
              value={this.props.encoding?.data.layerId}
              options={this.getRefLayerOptions()}
              onChange={this.handleRefLayerChange.bind(this)}
              testId="select-floor"
              enableCustomization={true}
            />
          </PanelField>
        }

        {this.props.layerType === LayerType.rectangle &&
          <FieldEditor
            key="y2Select"
            layout="inline"
            field={this.props.encoding?.y2?.field}
            columns={this.props.positionQueryColumns}
            options={this.props.xyzOptions}
            onChange={(field) => this.handleY2FieldChange(field)}
            title={i18n('Y2')}
            includeNullOption={true}
          />
        }
      </PanelGroup>
    )
  }
}

