import { PureComponent } from '@hopara/design-system'
import { Layer } from '../../layer/Layer'
import { Columns, Row } from '@hopara/dataset'
import { ObjectListItem, PlaceListItem } from '@hopara/design-system/src/list'
import { ObjectIcon, ObjectIconContext } from '../ObjectIcon'
import { Authorization } from '@hopara/authorization'
import { MAIN_VIEW_ELM_ID } from '../../view/View'
import { PaginatedRowset, PaginatedRowsetStatus } from '../../paginated-rowset/PaginatedRowset'
import { LayerType } from '../../layer/LayerType'
import React from 'react'
import { isEmpty } from 'lodash/fp'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList, shouldComponentUpdate } from 'react-window'
import { getTextValue } from '../../details/DetailsLineFactory'
import { ObjectRowListSkeleton } from './ObjectRowListSkeleton'
import { testCondition } from '@hopara/encoding'

export type RowListProps = {
  rowset: PaginatedRowset
  layer: Layer
  columns: Columns
  authorization: Authorization
  onPaginate: (rowsetId: string, offset: number) => void
  onRowPlaceDragEnd: (data: any, row: Row) => void
  onRowClick?: (layerId: string, row: Row) => void
  visualizationIsChart: boolean
  canPlace: boolean
  cantPlaceReason?: string
  onPlaceClickMobile: (layerId: string, row: Row) => void
  rowSavingId?: string
  lastImageVersionDate: Date | undefined
  isMobile: boolean
  canInsert: boolean
}

type Props = RowListProps & {
  width: number
  height: number
  canPlace: boolean
}


const getItemKey = (row, i) => {
  return row._id ? String(row._id).replaceAll(' ', '-') : i
}

export function getTitle(layer: Layer, row: Row, columns: Columns): string {
  const visibleDetails = layer.details.fields.getVisible()
  if (isEmpty(visibleDetails)) {
    return String(row._id ?? '')
  }

  const firstDetailTxt = visibleDetails.find((d) => !!d.value.encoding.text)!
  return getTextValue(row, columns, firstDetailTxt.value.encoding.text)
}

export function getDescription(layer: Layer, row: Row, columns: Columns): string | undefined {
  const visibleDetails = layer.details.fields.getVisible()
  if (visibleDetails.length < 2) {
    return undefined
  }
  
  const secondTextDetails = visibleDetails.filter((details) => !!details.value.encoding.text)[1]
  if ( !secondTextDetails) {
    return undefined
  }

  return getTextValue(row, columns, secondTextDetails.value.encoding.text)
}

class RowItem extends React.Component<{ 
  index: number, 
  style: any, 
  data: Props & { 
    isItemLoaded: any, 
    newlyCreatedRowIds: Set<string>
  }
}> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this)

  canPlaceRow(row: Row) {
    if (!this.props.data.canPlace) return false
    if (this.props.data.layer.visible.condition) {
      return testCondition(this.props.data.layer.visible.condition, row)
    }
    return true
  }

  cantPlaceReason(row: Row) {
    if (this.props.data.cantPlaceReason) return this.props.data.cantPlaceReason

    if (this.props.data.layer.visible.condition) {
      if (!testCondition(this.props.data.layer.visible.condition, row)) {
        return 'NOT_VISIBLE'
      }
    }
    return undefined
  }

  getObjectIcon(row: Row, placing: boolean) {
    return (
      <ObjectIcon
        key={row._id}
        layer={this.props.data.layer}
        row={row}
        authorization={this.props.data.authorization}
        size={24}
        placeHolderSize={80}
        context={placing ? ObjectIconContext.PLACING : ObjectIconContext.PLACE}
        lastImageVersionDate={this.props.data.lastImageVersionDate}
        resolution="tb"
      />
    )
  }

  render() {
    const row = this.props.data.rowset.rows[this.props.index]

    if (!this.props.data.isItemLoaded(this.props.index) || !row) {
      return <ObjectListItem key={this.props.index} loading sx={this.props.style} />
    }

    const isNewlyCreated = this.props.data.newlyCreatedRowIds.has(row._id!)

    return (
      <PlaceListItem
        testId={`object-type-row-${row._id}`}
        isMobile={this.props.data.isMobile}
        sx={this.props.style}
        highlighted={isNewlyCreated}
        id={getItemKey(row, this.props.index)}
        onPlace={(data) => this.props.data.onRowPlaceDragEnd(data, row)}
        key={getItemKey(row, this.props.index)}
        containerId={MAIN_VIEW_ELM_ID}
        canPlace={this.canPlaceRow(row)}
        cantPlaceReason={this.cantPlaceReason(row)}
        onClick={() => this.props.data.onRowClick?.(this.props.data.layer.getId(), row)}
        title={getTitle(this.props.data.layer, row, this.props.data.columns)}
        description={getDescription(this.props.data.layer, row, this.props.data.columns)}
        isPlaced={row.isPlaced()}
        isSaving={!!this.props.data.rowSavingId && this.props.data.rowSavingId === row._id}
        isImage={this.props.data.layer.isType(LayerType.image)}
        onPlaceClickMobile={() => this.props.data.onPlaceClickMobile(this.props.data.layer.getId(), row)}
        getIcon={(placing) => this.getObjectIcon(row, placing)}
      />
    )
  }
}

export class InfiniteObjectList extends PureComponent<Props> {
  itemHeight = 78
  listRef: FixedSizeList | null = null
  newlyCreatedRowIds: Set<string> = new Set() // IDs of rows that are newly created (not yet placed)
  animateListPush: boolean = false
  animationTimeoutId: ReturnType<typeof setTimeout> | null = null

  private readonly PUSH_ANIMATION_DURATION = 400

  getPageSize() {
    return Math.ceil((this.props.height / this.itemHeight) * 2)
  }

  private clearAnimationTimeout() {
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId)
      this.animationTimeoutId = null
    }
  }

  private startNewItemAnimation(rowId: string) {
    // Mark as newly created
    this.newlyCreatedRowIds.add(rowId)
    this.animateListPush = true
    this.forceUpdate()
    
    // Timeout for list push animation
    this.animationTimeoutId = setTimeout(() => {
      this.animateListPush = false
      this.animationTimeoutId = null
      this.forceUpdate()
    }, this.PUSH_ANIMATION_DURATION)
  }

  componentDidUpdate(prevProps: Props) {
    // When creation completes, scroll to top and animate
    if (
      prevProps.rowset.status === PaginatedRowsetStatus.ADDING &&
      this.props.rowset.status === PaginatedRowsetStatus.UPDATED &&
      this.props.rowset.rows.length > prevProps.rowset.rows.length
    ) {
      this.clearAnimationTimeout()
      this.animateListPush = false
      this.listRef?.scrollToItem(0)
      
      const newRow = this.props.rowset.rows[0]
      const newRowId = newRow?._id
      if (newRowId) {
        this.startNewItemAnimation(newRowId)
      }
    }

    // Check if any newly created row was placed (remove highlight)
    for (const rowId of this.newlyCreatedRowIds) {
      const row = this.props.rowset.rows.find((r) => r._id === rowId)
      if (row && row.isPlaced()) {
        this.newlyCreatedRowIds.delete(rowId)
      }
    }

    // Clear highlights when layer changes
    if (prevProps.layer.getId() !== this.props.layer.getId()) {
      this.newlyCreatedRowIds.clear()
      this.clearAnimationTimeout()
    }
  }

  componentWillUnmount() {
    this.clearAnimationTimeout()
  }

  isItemLoaded(index) {
    return this.props.rowset.lastPage || index < this.props.rowset.rows.length
  }

  handleLoadMoreItems() {
    return !this.props.rowset.isLoading() ?
      this.props.onPaginate(this.props.layer.getRowsetId(), this.props.rowset.rows.length) :
      new Promise((resolve) => resolve({}))
  }

  render(): React.ReactNode {
    const itemCount = !this.props.rowset.lastPage ? this.props.rowset.rows.length + 1 : this.props.rowset.rows.length
    const threshold = Math.floor(this.getPageSize() * 0.5)

    if ((this.props.rowset.rows.length === 0 && this.props.rowset.isLoading()) || this.props.rowset.isDeleting()) {
      return <ObjectRowListSkeleton count={3} />
    }

    return <InfiniteLoader
      key={this.props.layer.getId()}
      isItemLoaded={this.isItemLoaded.bind(this)}
      loadMoreItems={this.handleLoadMoreItems.bind(this)}
      itemCount={itemCount}
      minimumBatchSize={this.getPageSize()}
      threshold={threshold}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          style={{
            scrollbarWidth: 'auto',
            ...(this.animateListPush && {
              animation: 'pushListDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            })
          }}
          className="List"
          ref={(listRef) => {
            // Keep both refs in sync
            this.listRef = listRef
            if (typeof ref === 'function') {
              ref(listRef)
            }
          }}
          height={this.props.height}
          itemCount={itemCount}
          itemSize={this.itemHeight}
          width={this.props.width}
              onItemsRendered={onItemsRendered}
              itemData={{
                ...this.props,
                isItemLoaded: this.isItemLoaded.bind(this),
                newlyCreatedRowIds: this.newlyCreatedRowIds
              }}>
              {RowItem}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  }
}
