import React from 'react'
import {FixedSizeGrid as Grid} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import {Icon} from './domain/Icon'
import {ListIconItem} from './ListIconItem'

interface Props {
  icons: Icon[]
  hasMore: boolean
  loading: boolean
  editable: boolean
  editUrl: (icon: Icon) => string | undefined
  onDeleted: (icon: Icon) => void
  fetchMoreData: (pageSize: number) => Promise<any>
  libraryName: string
}

export const ListIconsComponent = (props: Props) => {
  return (
    <AutoSizer>
      {({height, width}) => {
        const gridContentHeight = height - 80 // subtract header height
        const baseItemWidth = 125
        const baseItemHeight = 150
        const itemCount = props.hasMore ? props.icons.length + 1 : props.icons.length
        const itemsPerRow = Math.floor(width / baseItemWidth)
        const rowsCount = Math.ceil(itemCount / itemsPerRow)
        const rowsOnScreen = Math.floor(height / baseItemHeight)
        const pageSize = Math.ceil((rowsOnScreen * itemsPerRow) * 2.5)
        const threshold = Math.floor((rowsOnScreen * itemsPerRow) + itemsPerRow)
        const isItemLoaded = (index) => !props.hasMore || index < props.icons.length

        return (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            loadMoreItems={() => {
              return !props.loading ? props.fetchMoreData(pageSize) : new Promise((resolve) => resolve({}))
            }}
            itemCount={itemCount}
            minimumBatchSize={pageSize}
            threshold={threshold}
          >
            {({onItemsRendered, ref}) => (
              <Grid
                className='List'
                height={gridContentHeight}
                width={width}
                columnCount={itemsPerRow}
                columnWidth={Math.ceil((width - 20) / itemsPerRow)}
                rowCount={rowsCount}
                rowHeight={baseItemHeight}
                onItemsRendered={(gridProps) => {
                  onItemsRendered({
                    overscanStartIndex:
                      gridProps.overscanRowStartIndex * itemsPerRow,
                    overscanStopIndex: gridProps.overscanRowStopIndex * itemsPerRow,
                    visibleStartIndex: gridProps.visibleRowStartIndex * itemsPerRow,
                    visibleStopIndex: gridProps.visibleRowStopIndex * itemsPerRow,
                  })
                }}
                ref={ref}
                style={{overflowX: 'hidden'}}>
                {({columnIndex, rowIndex, style}) => {
                  return <ListIconItem
                    icons={props.icons}
                    style={style}
                    rowIndex={rowIndex}
                    itemsPerRow={itemsPerRow}
                    columnIndex={columnIndex}
                    editable={props.editable}
                    onDeleted={props.onDeleted}
                    editUrl={props.editUrl}
                    hasMore={props.hasMore}
                    libraryName={props.libraryName}
                  />
                }}
              </Grid>
            )}
          </InfiniteLoader>
        )
      }}
    </AutoSizer>
  )
}
