import React from 'react'
import {ObjectIcon} from '../ObjectIcon'
import {Layers} from '../../layer/Layers'
import {DetailsState} from '../../details/state/DetailsReducer'
import {ObjectEditorItemContainer} from './ObjectEditorItemContainer'
import {ObjectEditorListContainer} from './ObjectEditorListContainer'
import {PureComponent} from '@hopara/design-system'
import {MenuItem} from '../../menu/MenuStore'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {MenuOption} from '@hopara/design-system/src/panel/PanelMenuItems'
import {SlideTransition, TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {VisualizationType} from '../../visualization/Visualization'
import {ImageHistoryContainer} from '../../image/ImageHistoryContainer'
import {ObjectEditorShortcuts} from './ObjectEditorShortcuts'
import {PanelMenu} from '@hopara/design-system/src/panel/PanelMenu'
import {PanelWrapper} from '@hopara/design-system/src/VisualizationLayout'
import {Authorization} from '@hopara/authorization'
import {ModelHistoryContainer} from '../../resource/ModelHistoryContainer'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {i18n} from '@hopara/i18n'

export interface StateProps {
  details?: DetailsState
  visualizationName?: string
  visualizationId?: string
  visualizationType?: VisualizationType
  fallbackVisualizationId?: string
  layers: Layers
  menuItems: MenuItem[],
  selectedMenuItemId: string | undefined
  imageHistoryLayerId?: string
  modelHistoryLayerId?: string
  authorization: Authorization
  menuLoading: boolean
  isCollapsed: boolean
}

export interface ActionProps {
  onMenuItemClick: (item: MenuOption) => void
  onLoad: () => void
  onCloseClick: () => void
  onToggleCollapse: () => void
  onExpandPanel?: () => void
}

export function hasContent(props: {
  imageHistoryLayerId?: string,
  details?: DetailsState,
  selectedMenuItemId?: string
}) {
  return !!(props.imageHistoryLayerId ||
    props.details?.row ||
    props.selectedMenuItemId)
}

export class ObjectEditorOutlet extends PureComponent<StateProps & ActionProps> {
  componentDidMount(): void {
    this.props.onLoad()
  }

  getMenuOptions(): MenuOption[] {
    const items: MenuOption[] = []
    this.props.menuItems?.forEach((menuItem) => {
      const layer = this.props.layers.getById(menuItem.id)!
      if (!layer) return
      items.unshift({
        id: menuItem.id,
        name: menuItem.name,
        badgeIcon: layer.getLocked() ? <Icon icon="lock" size="sm"/> : undefined,
        icon: <ObjectIcon authorization={this.props.authorization} layer={layer}/>,
        selected: this.props.selectedMenuItemId === menuItem.id,
      })
    })
    return items as MenuOption[]
  }

  getSelectedContent() {
    if (this.props.imageHistoryLayerId) return <ImageHistoryContainer/>
    if (this.props.modelHistoryLayerId) return <ModelHistoryContainer/>
    if (this.props.details?.row) return <ObjectEditorItemContainer/>
    return <ObjectEditorListContainer/>
  }

  render() {
    const menuOptions = this.getMenuOptions()
    const selectedContent = this.getSelectedContent()

    return (
      <>
        <ObjectEditorShortcuts/>
        <PanelWrapper opaqueBackground>
            <PanelTitleBar
              title={i18n('OBJECTS')}
              helper={this.props.authorization.canEditVisualization()
                ? i18n('OBJECT_EDITOR_LIST_EDIT_HELPER')
                : i18n('OBJECT_EDITOR_LIST_HELPER')}
              onToggleCollapsed={this.props.onToggleCollapse}
              collapsed={this.props.isCollapsed}
              onCloseClick={this.props.onCloseClick}
            />
            {!this.props.isCollapsed && (
              <>
                <PanelMenu
                  items={menuOptions}
                  loading={this.props.menuLoading}
                  onItemClick={this.props.onMenuItemClick}
                />
                {selectedContent && (
                  <SlideTransition
                    transitionKey={this.props.details?.row ? 'details' : 'menu'}
                    transition={this.props.details?.row && this.props.selectedMenuItemId
                      ? TransitionType.RIGHT
                      : TransitionType.LEFT}
                  >
                    {selectedContent}
                  </SlideTransition>
                )}
              </>
            )}
        </PanelWrapper>
      </>
    )
  }
}
