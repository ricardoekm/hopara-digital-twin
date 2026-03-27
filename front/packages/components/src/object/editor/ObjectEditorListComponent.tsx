import React from 'react'
import {Columns, Queries, Row} from '@hopara/dataset'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {ObjectEditorList} from './ObjectEditorList'
import {Filters} from '../../filter/domain/Filters'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {Box} from '@mui/material'
import {SearchBox} from '@hopara/design-system/src/search/SearchBox'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {PaginatedRowset, PaginatedRowsetStatus} from '../../paginated-rowset/PaginatedRowset'
import {Layer} from '../../layer/Layer'
import {Floor} from '../../floor/Floor'
import {Layers} from '../../layer/Layers'
import {ListActionPillButton} from '@hopara/design-system/src/buttons/ListActionPillButton'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import { Empty } from '@hopara/design-system/src/empty/Empty'

export type StateProps = {
  layer: Layer
  layers: Layers
  columns?: Columns
  objectRowset?: PaginatedRowset
  filters: Filters
  queries: Queries
  userCanEditRow: boolean
  isQueryEditable: boolean
  authorization: Authorization
  visualizationIsChart: boolean
  currentFloor?: Floor | undefined
  writeLevelInsert: boolean
  rowSavingId?: string
  lastImageVersionDate?: Date
  status: PaginatedRowsetStatus
  isMobile: boolean
  hasOptions: boolean
}

export type ActionProps = {
  onPaginate: (rowsetId: string, offset: number) => void
  onObjectSearch: (rowsetId: string, term: string) => void
  onDragToPlace: (row: Row, placement: any) => Promise<void>;
  onLockClick: (layerId: string) => void
  onObjectClick: (layerId: string, row: Row) => void;
  onAddRowClick: (layerId: string, rowsetId: string) => void
  onCloseClick: () => void
  onPlaceClickMobile: (layerId: string, row: Row) => void
  onLockOtherLayersClick: (layerId: string) => void
  onUnlockOtherLayersClick: (layerId: string) => void
}

export type Props = StateProps & ActionProps

export class ObjectEditorListComponent extends PureComponent<Props> {
  handleStop(data: any, row: Row) {
    return this.props.onDragToPlace && this.props.onDragToPlace(row, data)
  }

  handleSearch(layer: Layer, term: string): void {
    if (this.props.onObjectSearch) this.props.onObjectSearch(layer.getRowsetId(), term)
  }

  render(): React.ReactNode {
    if (!this.props.hasOptions) {
      return <Empty noBorder description={i18n('EMPTY_OBJECTS')}/>
    }
    if (!this.props.layer) return null
    const positionQuery = this.props.queries.findQuery(this.props.layer.getPositionQueryKey())
    return (
      <Panel
        fullHeight
        header={
          <>
            {this.props.writeLevelInsert &&
              <Box sx={{
                'paddingInline': 12,
                '& .list-action-pill-button': {
                  'marginTop': 2,
                },
              }}>
                <ListActionPillButton
                  className="list-action-pill-button"
                  icon={<Icon icon="add"/>}
                  onClick={() => this.props.onAddRowClick(this.props.layer.getId(), this.props.layer.getRowsetId())}
                  disabled={this.props.status === PaginatedRowsetStatus.ADDING}
                >
                  {this.props.status === PaginatedRowsetStatus.ADDING ?
                    i18n('ADDING_ELLIPSIS') :
                    i18n('ADD_OBJECT', {object: this.props.layer.name.toLowerCase()})
                  }
                </ListActionPillButton>
              </Box>
            }

            <Box sx={{
              display: 'inline-flex',
              marginInline: '12px 6px',
              marginBlock: '0px 12px',
              gap: 4,
            }}>
              <SearchBox
                key={this.props.layer.getId()}
                term={this.props.objectRowset?.searchTerm}
                placeholder={i18n('SEARCH_OBJECTS', {object: this.props.layer.name.toLowerCase()})}
                onChange={(term) => this.handleSearch(this.props.layer, term)}
              />
              <MoreButton menuItems={[
                {
                  label: this.props.layer?.getLocked() ? i18n('UNLOCK_EDITING') : i18n('LOCK_EDITING'),
                  onClick: () => this.props.onLockClick(this.props.layer.getId()),
                },
                {
                  label: i18n('LOCK_OTHER_LAYERS'),
                  onClick: () => this.props.onLockOtherLayersClick(this.props.layer.getId()),
                },
                {
                  label: i18n('UNLOCK_OTHER_LAYERS'),
                  onClick: () => this.props.onUnlockOtherLayersClick(this.props.layer.getId()),
                },
              ]} />
            </Box>
          </>}
      >
        <ObjectEditorList
          key={this.props.layer.getId()}
          isMobile={this.props.isMobile}
          rowset={this.props.objectRowset!}
          layer={this.props.layer}
          authorization={this.props.authorization}
          onPaginate={(rowsetId, offset) => this.props.onPaginate(rowsetId, offset)}
          onRowPlaceDragEnd={(data, row) => this.handleStop(data, row)}
          onRowClick={this.props.onObjectClick}
          visualizationIsChart={this.props.visualizationIsChart}
          canPlace={this.props.layer.canPlace(positionQuery?.canUpdate())}
          cantPlaceReason={this.props.layer.cantPlaceReason(positionQuery?.canUpdate())}
          onPlaceClickMobile={this.props.onPlaceClickMobile}
          rowSavingId={this.props.rowSavingId}
          lastImageVersionDate={this.props.lastImageVersionDate}
          canInsert={this.props.writeLevelInsert}
          columns={this.props.columns!}
        />
      </Panel>
    )
  }
}
