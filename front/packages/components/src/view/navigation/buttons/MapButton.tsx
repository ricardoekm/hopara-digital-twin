import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import Case from 'case'
import {HoparaIconKey, Icon} from '@hopara/design-system/src/icons/Icon'
import {i18n} from '@hopara/i18n'
import {MapStyle} from '@hopara/encoding'
import {ListItemIcon, ListItemText, MenuItem, MenuList} from '@mui/material'

export interface StateProps {
  currentStyle: MapStyle
}

export interface ActionProps {
  onClick: (style: MapStyle) => void
}


export class MapButton extends PureComponent<StateProps & ActionProps> {
  getMapStyleNames(): MapStyle[] {
    return Object.keys(MapStyle).map((style) => {
      return MapStyle[style]
    })
  }

  getMapStyleLabel(style: MapStyle): string {
    const label = `MAP_${Case.snake(style).toUpperCase()}` as any
    return i18n(label)
  }

  render() {
    if (!this.props.currentStyle) return null

    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n('CHANGE_MAP_STYLE_')}
          tooltipPlacement='left'
          icon={`map-style-${this.props.currentStyle}` as HoparaIconKey}
          popoverTitle={i18n('MAP')}
          popoverPlacement='top-start'
          popover={
            <MenuList sx={{
              width: 250,
              padding: '0 12px 12px',
            }}>
              {this.getMapStyleNames().map((styleName: MapStyle) => {
                return (<MenuItem
                  key={styleName}
                  onClick={() => this.props.onClick(styleName)}
                  sx={{
                    padding: 5,
                  }}
                >
                  <ListItemIcon>
                    <Icon icon={`map-style-${styleName}` as HoparaIconKey} />
                  </ListItemIcon>
                  <ListItemText>{this.getMapStyleLabel(styleName)}</ListItemText>
                  {styleName === this.props.currentStyle && <ListItemIcon>
                    <Icon icon="check"/>
                  </ListItemIcon>}
                </MenuItem>)
              })}
            </MenuList>
          }/>
      </CanvasNavigationButtonGroup>
    )
  }
}
