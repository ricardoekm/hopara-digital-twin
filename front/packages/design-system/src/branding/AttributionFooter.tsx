import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {ReactComponent as LogoMediumOutline} from './logo-medium-outline.svg'
import {styled} from '../theme'

export const AttributionFooterView = styled('div', {name: 'AttributionFooterView'})({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'absolute',
    inset: 'auto 5px 5px 5px',
    color: '#111',
    textAlign: 'right',
    cursor: 'default',
})

const AttributionFooterLogoLink = styled('a', {name: 'AttributionFooterLogoLink'})(() => {
  return {
  'display': 'grid',
  'gridAutoFlow': 'column',
  'placeItems': 'center',
  'gap': 4,
  'textDecoration': 'none',
  'color': 'inherit',
  'lineHeight': 0,
  'textAlign': 'right',
  'padding': '6px 8px',
  'margin': 0,
  'fontSize': 12,
  'letterSpacing': '-0.28px',
  'fontWeight': 600,
  'pointerEvents': 'auto',
  'transition': 'all 100ms ease-out',
  'filter': 'drop-shadow(rgba(0,0,0,0.1) 0px 1px 1px)',
  'willChange': 'transform',
  '&:hover': {
    'cursor': 'pointer',
  },
  '&.google': {
    'color': '#fff',
    'padding': '3px 8px',
    'margin': '0 0 0 63px',
    'fontSize': 14,
  },
}
})

export const AttributionFooterLogo = styled(LogoMediumOutline, {name: 'AttributionFooterLogo'})(() => {
  return {
    'color': '#111',
    '&.google': {
    'color': '#fff',
  },
  }
})

export const AttributionFooterLinks = styled('div', {name: 'AttributionFooterLinks'})(() => {
  return {
  'display': 'inline-block',
  'fontSize': 9,
  'textAlign': 'right',
  'padding': '6px 10px',
  'pointerEvents': 'auto',
  'filter': 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
  '& :hover': {
    'textDecoration': 'underline',
  },
}
})

export const AttributionFooterLink = styled('a', {name: 'AttributionFooterLink'})(() => {
  return {
    'textDecoration': 'none',
    'display': 'inline',
    'color': '#111',
    '& :hover': {
      'cursor': 'pointer',
    },
  }
})


interface Props {
  showMapAttribution: boolean
  mapSource: string
}

export class AttributionFooter extends PureComponent<Props> {
  isArcGISMap() {
    return this.props.mapSource === 'arcgis'
  }

  isMapTilerMap() {
    return this.props.mapSource === 'maptiler'
  }

  render() {
    return (
      <AttributionFooterView>
        <AttributionFooterLogoLink
          href="https://hopara.io"
          target="_blank"
          rel="noreferrer"
          className={this.props.mapSource}>
          <AttributionFooterLogo className={this.props.mapSource} />
          hopara
        </AttributionFooterLogoLink>

        {this.props.showMapAttribution && this.isMapTilerMap() && (
          <AttributionFooterLinks>
            <AttributionFooterLink
              href="https://www.maptiler.com/copyright"
              target="_blank"
              rel="noreferrer">
              ©MapTiler
            </AttributionFooterLink>
            &nbsp;
            <AttributionFooterLink
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer">
              ©OpenStreetMap contributors
            </AttributionFooterLink>
          </AttributionFooterLinks>
        )}

        {this.props.showMapAttribution && this.isArcGISMap() && (
          <AttributionFooterLinks>
            Esri, Maxar, GeoEye,
            Earthstar Geographics,
            AeroGRID, IGN, CNES/Airbus DS,
            USDA, USGS, HERE, Garmin,
            FAO, NOAA, USGS,&nbsp;
            <span style={{whiteSpace: 'nowrap'}}>©OpenStreetMap</span> contributors,
            and the GIS User Community |&nbsp;
            <AttributionFooterLink
                href="https://www.esri.com/"
                target="_blank"
                rel="noreferrer">
                  Powered by Esri
            </AttributionFooterLink>
          </AttributionFooterLinks>
        )}
      </AttributionFooterView>
    )
  }
}

