import React from 'react'
import {SlideTransition, TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {i18n} from '@hopara/i18n'
import {ComparisonType, Filter} from '../../filter/domain/Filter'
import {AutoFillMode} from '../../filter/domain/AutoFill'
import {FilterEditorList} from './FilterEditorList'
import {Authorization} from '@hopara/authorization'
import {Filters} from '../../filter/domain/Filters'
import {FilterEditorItem} from './FilterEditorItem'
import {Queries, Query} from '@hopara/dataset'
import {PureComponent} from '@hopara/design-system'
import {filterMenuFactory} from './FilterMenu'
import {PanelCards} from '@hopara/design-system/src/panel/PanelCard'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {PanelButton} from '@hopara/design-system/src/buttons/PanelButton'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'

export interface StateProps {
  authorization: Authorization
  items: Filters
  selectedItem?: Filter
  selectedItemQuery?: Query
  queries: Queries
  queryLink?: string
  newQueryLink?: string
  dataSourceLink?: string
  isAdvancedMode: boolean
  dataSourceListLink: string
}

export interface ActionProps {
  onBackClick: () => void
  onChange: (filter: Filter) => void
  onChangeAutoFill: (autoFillMode: AutoFillMode | undefined) => void
  onChangeField: (field: string) => void
  onChangeQuery: (query: Query) => void
  onChangeDataSource: (dataSource: string) => void
  onChangeSingleChoice: (singleChoice: boolean) => void
  onDeleteClick: (id: string) => void
  onItemClick: (id: string) => void
  onMove: (id: string, steps: number) => void
  onNewClick: () => void
  onGoToQuery: (dataSource: string, query?: string) => void
  onGoToDataSource: (dataSource?: string) => void
  onAdvancedModeClick: (enabled: boolean) => void
  onComparisonTypeChanged: (comparisonType: ComparisonType) => void
}

export class FilterEditorComponent extends PureComponent<StateProps & ActionProps> {
  onAdvancedModeClick(id?: string) {
    if (id) {
      this.props.onItemClick(id)
      this.props.onAdvancedModeClick(true)
    }
  }

  onBackClick() {
    if (this.props.isAdvancedMode) {
      this.props.onAdvancedModeClick(false)
      return
    }
    return this.props.onBackClick()
  }

  render() {
    return (
      <SubPanelWrapper>
        <SlideTransition transition={this.props.selectedItem ? TransitionType.RIGHT : TransitionType.LEFT}>
          {!this.props.selectedItem &&
            <SubPanel
              header={<PanelTitleBar
                title={i18n('FILTERS')}
                helper={this.props.items.length ? i18n('EMPTY_FILTERS') : undefined}
                buttons={[<PanelButton onClick={this.props.onNewClick} key="new">
                  <Icon icon="add"/>
                </PanelButton>]}
              />}
            >
              <FilterEditorList
                list={this.props.items}
                authorization={this.props.authorization}
                onItemClick={((option) => this.props.onItemClick(option.id))}
                onDeleteClick={this.props.onDeleteClick}
                onMove={this.props.onMove}
                onAdvancedModeClick={this.onAdvancedModeClick.bind(this)}
              />
            </SubPanel>
          }
          {this.props.selectedItem &&
            <SubPanel
              header={<PanelTitleBar
                title={this.props.selectedItem.getTitle()}
                onBackClick={this.onBackClick.bind(this)}
                buttons={[<MoreButton menuItems={!this.props.isAdvancedMode ? filterMenuFactory({
                  onAdvancedModeClick: () => this.onAdvancedModeClick(this.props.selectedItem!.id),
                  onDeleteClick: () => this.props.onDeleteClick(this.props.selectedItem!.id),
                }) : []} key="more"/>]}
              />}
            >
              <PanelCards>
                <FilterEditorItem
                  isAdvancedMode={this.props.isAdvancedMode}
                  queries={this.props.queries}
                  selectedItem={this.props.selectedItem}
                  selectedItemQuery={this.props.selectedItemQuery}
                  queryLink={this.props.queryLink}
                  newQueryLink={this.props.newQueryLink}
                  dataSourceLink={this.props.dataSourceLink}
                  onChange={this.props.onChange}
                  onChangeAutoFill={this.props.onChangeAutoFill}
                  onChangeField={this.props.onChangeField}
                  onChangeQuery={this.props.onChangeQuery}
                  onChangeDataSource={this.props.onChangeDataSource}
                  onChangeSingleChoice={this.props.onChangeSingleChoice}
                  onGoToQuery={this.props.onGoToQuery}
                  onGoToDataSource={this.props.onGoToDataSource}
                  dataSourceListLink={this.props.dataSourceListLink}
                  onComparisonTypeChanged={this.props.onComparisonTypeChanged}
                />
              </PanelCards>
            </SubPanel>
          }
        </SlideTransition>
      </SubPanelWrapper>
    )
  }
}
