import React, {lazy, Suspense} from 'react'
import {PureComponent} from '@hopara/design-system'
import Case from 'case'
import {PanelCard, PanelCards} from '@hopara/design-system/src/panel/PanelCard'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {i18n} from '@hopara/i18n'
import {Layer} from '../Layer'
import {EditorGroup, groupHelperText} from './LayerEditorFactory'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {layerMenuFactory} from './LayerMenu'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {SaveDiscardEditorContainer} from '../../visualization/SaveDiscardEditorContainer'
import {CloseEditorButtonContainer} from '../../visualization/CloseEditorContainer'

const LayerCodeEditorContainer = lazy(() => import(/* webpackPrefetch: true */ './code/LayerCodeEditorContainer') as any)

interface Props {
  components: Record<EditorGroup, React.ReactElement[]>
  layer: Layer
  openGroups: string[]
  setOpenGroups: (groups: string[]) => void
  isAdvancedMode: boolean
  parentLayer?: Layer
  onBackClick: () => void
  onAdvancedModeClick: (enabled?: boolean) => void
  onDuplicateClick: () => void
  onDeleteClick: () => void
  onEjectClick: () => void
}

export class LayerEditorItem extends PureComponent<Props> {
  render() {
    const groups = Object.keys(this.props.components) as EditorGroup[]

    const callbacks = {
      onAdvancedModeClick: () => this.props.onAdvancedModeClick(true),
      onLayerDuplicateClick: () => {
        this.props.onDuplicateClick()
      },
      onLayerDeleteClick: () => {
        this.props.onDeleteClick()
      },
      onLayerEjectClick: () => {
        this.props.onEjectClick()
      },
    }
    const menuItems = layerMenuFactory({layer: this.props.layer, callbacks})

    const buttons = [
      <SaveDiscardEditorContainer key="save-discard" />,
    ]
    if (!this.props.isAdvancedMode) {
      buttons.push(<MoreButton key="more" menuItems={menuItems}/>)
    }
    buttons.push(<CloseEditorButtonContainer key="close" />)

    return (
      <Panel
        fullHeight={this.props.isAdvancedMode}
        header={<PanelTitleBar
          title={this.props.layer.name}
          subtitle={this.props.parentLayer?.name}
          onBackClick={this.props.onBackClick}
          buttons={buttons}
        />}
      >
        <PanelCards>
          {this.props.isAdvancedMode && (
            <Suspense fallback={null}>
              <LayerCodeEditorContainer layer={this.props.layer}/>
            </Suspense>
          )}

          {!this.props.isAdvancedMode && (
            <>
              <PanelCard expandable={false}>
                {this.props.components[EditorGroup.meta]?.map((component) => {
                  if (!component) return null
                  return component
                })}
              </PanelCard>
              {groups.filter((g) => g !== EditorGroup.meta)?.map((groupKey) => {
                const title = i18n(Case.constant(groupKey) as any)
                const helperText = groupHelperText[groupKey]
                return <PanelCard
                  title={title}
                  helperText={helperText}
                  expandable
                  key={groupKey}
                  expanded={this.props.openGroups.includes(groupKey)}
                  onChangeExpanded={(expanded) => {
                    if (expanded) {
                      this.props.setOpenGroups([...this.props.openGroups, groupKey])
                    } else {
                      this.props.setOpenGroups(this.props.openGroups.filter((g) => g !== groupKey))
                    }
                  }}
                >
                  {this.props.components[groupKey].map((component) => {
                    if (!component) return null
                    return component
                  })
                  }
                </PanelCard>
              })}
            </>
          )}
        </PanelCards>
      </Panel>
    )
  }
}
