import React from 'react'
import {Select} from '@hopara/design-system/src/form'
import {MapEncoding, MapStyle} from '@hopara/encoding'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '@hopara/design-system'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import Case from 'case'
import { Layer } from '../../Layer'
import { Empty } from '@hopara/design-system/src/empty/Empty'
import { Config } from '@hopara/config'
import { isArgGisMap, isGoogleMap } from '../../../map/MapStyleFactory'

export interface StateProps {
  encoding: MapEncoding
  layer: Layer
}

export interface ActionProps {
  onChange: (encoding: MapEncoding) => void;
}

type Props = StateProps & ActionProps

function getMapOptions() {
  return Object.keys(MapStyle)
    .filter((key) => {
      const style = MapStyle[key as keyof typeof MapStyle]
      if (isArgGisMap(style)) return !!Config.getValue('ARCGIS_API_TOKEN')
      if (isGoogleMap(style)) return !!Config.getValue('GOOGLE_MAPS_API_KEY')
      if (style !== MapStyle.none) return !!Config.getValue('MAPTILER_API_TOKEN')
      return true
    })
    .map((key) => ({
      label: Case.capital(MapStyle[key as keyof typeof MapStyle]),
      value: MapStyle[key as keyof typeof MapStyle],
    }))
}

export class MapEditor extends PureComponent<Props> {
  handleMapChange(mapStyle:MapStyle) {
    return this.props.onChange(new MapEncoding({
      ...this.props.encoding,
      value: mapStyle,
    }))
  }

  render() {
    return (
      <>
        <PanelField title={i18n('MAP_STYLE')} layout="inline">
          <Select
            options={getMapOptions()}
            value={this.props.encoding.value}
            placeholder={i18n('NONE')}
            onChange={(e) => {
              this.handleMapChange(e.target.value ?? MapStyle.none)
            }}
          />
        </PanelField>
        {this.props.encoding.value === MapStyle.googleSatellite &&
          <Empty icon='info' description={i18n('GOOGLE_MAPS_TYPE_WARNING')} />
        }
      </>
    )
  }
}
