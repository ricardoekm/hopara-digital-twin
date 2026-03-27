import React from 'react'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'
import { InputSearch, styled, useTheme } from '@hopara/design-system/src'
import { Box, Skeleton, Typography } from '@mui/material'
import { Icon } from '@hopara/design-system/src/icons/Icon'
import { PlaceDetail } from '../../../place/PlaceSearchRepository'
import { ObjectListItem, PlaceListItem } from '@hopara/design-system/src/list'
import { getDescription, getTitle } from '../../../object/editor/InfiniteObjectList'
import { LayerType } from '../../../layer/LayerType'
import { ObjectIcon } from '../../../object/ObjectIcon'
import { Authorization } from '@hopara/authorization'
import { debounce } from 'lodash/fp'
import { PureComponent } from '@hopara/design-system'

export type StateProps = {
  searchTerm?: string
  places?: any[]
  searchRows: any[]
  isLoadingRows: boolean
  isLoadingAddresses: boolean
  hasRows: boolean
  hasPlaces: boolean
  isGeo: boolean
  authorization: Authorization
  isOpen: boolean
  visualizationId: string
}

export type ActionProps = {
  onSearch: (term?: string) => void
  onPlaceClicked: (place: PlaceDetail) => void
  onSearchRowClicked: (rowsetId: string, row: any) => void
  onPopoverOpen: () => void
  onPopoverClose: () => void
  onPopoverCloseClick: () => void
}

export type Props = StateProps & ActionProps
type State = {
  hasAIData: boolean
}
const SectionTitle = styled(Box, { name: 'SectionTitle' })(({ theme }) => ({
  fontSize: '0.9em',
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  display: 'flex',
  gap: 4,
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.spec.tableBorder}`,
  borderBottom: `1px solid ${theme.palette.spec.tableBorder}`,
  padding: '10px 14px'
}))

const PlaceItem = ({
  place,
  onClick
}: {
  place?: PlaceDetail
  onClick?: (place: PlaceDetail) => void
}) => {
  const theme = useTheme()
  return (
    <Box
      onClick={() => onClick && place && onClick(place)}
      sx={{
        'color': theme.palette.text.primary,
        'display': 'grid',
        'gridAutoFlow': 'column',
        'gridTemplateColumns': 'auto 1fr',
        'alignItems': 'center',
        'justifyContent': 'start',
        'gap': 6,
        'padding': '14px 12px',
        'cursor': 'pointer',
        'borderBlockEnd': `1px solid ${theme.palette.spec.borderColor}`,
        '&:last-child': {
          borderBlockEnd: 'none'
        },
        '&:hover': {
          backgroundColor: theme.palette.spec.itemBackgroundHover
        }
      }}
    >
      <Icon icon="marker" style={{ opacity: place ? 0.85 : 0.5 }}/>
      <Typography
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%'
        }}
      >
        {place?.address}
        {!place && <Skeleton variant="text" width="90%"/>}
      </Typography>
    </Box>
  )
}

const PlacesList = ({ places, onPlaceClicked, isLoading }) => {
  if (!places?.length && !isLoading) return null
  if (isLoading) {
    return (
      <Box className="search-section">
        {Array.from({ length: 3 }).map((_, i) => (
          <PlaceItem key={i}/>
        ))}
      </Box>
    )
  }

  return (
    <Box className="search-section">
      <SectionTitle className="search-section-title">
        {i18n('MAP_ADDRESS')}
      </SectionTitle>
      {places?.map((place) => (
        <PlaceItem key={place.id} place={place} onClick={onPlaceClicked}/>
      ))}
    </Box>
  )
}

interface SearchResultsProps {
  searchRows: any[];
  authorization: Authorization;
  isLoading: boolean;
  onSearchRowClicked: (rowsetId: string, row: any) => void;
}

export const ObjectSearchResults = (props: SearchResultsProps) => {
  const { searchRows, authorization, isLoading, onSearchRowClicked } = props
  if (!searchRows?.length) return null
  if (isLoading) {
    return (
      <Box className="search-section">
        {Array.from({ length: 1 }).map((_, i) => {
          return (
            <ObjectListItem
              key={i}
              loading
              sx={i === 2 ? { borderBottom: 'none !important' } : {}}
            />
          )
        })}
      </Box>
    )
  }

  return <>
    {searchRows?.map((rowset) => {
        if (!rowset.rows.length) return null
        return (
          <Box
            key={rowset.rowsetId}
            className="search-section"
            sx={{
              '& li:last-of-type': {
                borderBottom: 'none !important'
              }
            }}
          >
            <SectionTitle className="search-section-title">
              {rowset.layer.name}
            </SectionTitle>
            {rowset.rows.map((row) => {
              return (
                <PlaceListItem
                  testId={`search-row-${row._id}`}
                  hideChevron
                  id={row._id}
                  key={row._id}
                  onClick={() => onSearchRowClicked(rowset.rowsetId, row)}
                  title={getTitle(rowset.layer, row, rowset.columns)}
                  description={getDescription(rowset.layer, row, rowset.columns)}
                  isPlaced={true}
                  isImage={rowset.layer.isType(LayerType.image)}
                  getIcon={() => (
                    <ObjectIcon
                      key={row._id}
                      layer={rowset.layer}
                      row={row}
                      authorization={authorization}
                      size={24}
                      placeHolderSize={80}
                    />
                  )}
                />
              )
            })}
          </Box>
        )
      }
    )}
  </>
}

const SearchBox = (props: Props) => {
  const theme = useTheme()
  const empty = !props.searchTerm
  const noResults =
    !props.isLoadingRows &&
    !props.isLoadingAddresses &&
    !props.hasRows &&
    !props.hasPlaces &&
    !!props.searchTerm

  const placeholder = props.isGeo ? i18n('SEARCH_FOR_OBJECTS_IN_YOU_DATA_OR_ADDRESS') : i18n('SEARCH_FOR_OBJECTS_IN_YOU_DATA')

  return (
    <Box
      sx={{
        width: 324,
        display: 'grid',
        gridAutoFlow: 'row'
      }}
    >
      {empty && (
        <Box sx={{ padding: '28px 14px 40px' }}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 13,
              color: theme.palette.text.primary,
              whiteSpace: 'pre-line',
              textWrap: 'balance'
            }}
          >
            {placeholder}
          </Typography>
        </Box>
      )}
      {noResults && (
        <Box sx={{ padding: '28px 14px 40px' }}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 13,
              color: theme.palette.text.primary,
              whiteSpace: 'pre-line',
              textWrap: 'balance'
            }}
          >
            {i18n('NO_RESULTS_FOUND')}
          </Typography>
        </Box>
      )}
      {!empty && (
        <Box
          sx={{
            'display': 'grid',
            'gridAutoFlow': 'row',
            '& .search-section:first-of-type': {
              '& .search-section-title': {
                borderTop: 0
              }
            }
          }}
        >
          <ObjectSearchResults
            searchRows={props.searchRows}
            authorization={props.authorization}
            isLoading={props.isLoadingRows}
            onSearchRowClicked={props.onSearchRowClicked}
          />
          <PlacesList
            places={props.places}
            onPlaceClicked={props.onPlaceClicked}
            isLoading={props.isLoadingAddresses}
          />
        </Box>
      )}
    </Box>
  )
}

export class SearchButton extends PureComponent
  <Props, State> {
  debouncedSearch

  constructor(props) {
    super(props)
    this.debouncedSearch = debounce(1000, props.onSearch)
    this.state = {
      hasAIData: false
    }
  }

  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n('SEARCH_ADDRESS')}
          icon="search"
          tooltipPlacement="left"
          popoverPlacement="top-start"
          popoverOpen={this.props.isOpen}
          onPopoverOpen={this.props.onPopoverOpen}
          onPopoverClose={this.props.onPopoverClose}
          onPopoverCloseClick={this.props.onPopoverCloseClick}
          popoverTitle={i18n('SEARCH')}
          popover={<SearchBox {...this.props} />}
          popoverHeaderContent={
            <InputSearch
              initialValue={this.props.searchTerm}
              onChange={(e) =>
                this.debouncedSearch(
                  e.target.value ? e.target.value : undefined
                )
              }
              placeholder={i18n('SEARCH')}
              autoFocus
            />
          }
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
