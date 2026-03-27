import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {SelectOption} from '@hopara/design-system/src/form'
import {INTERNAL_DATA_SOURCE, Queries, Query} from '@hopara/dataset'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {sortBy} from 'lodash/fp'
import {Box, IconButton} from '@mui/material'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {Link} from 'react-router-dom'
import {FilterableSelect} from '@hopara/design-system/src/form/FilterableSelect'
import {Tooltip} from '@hopara/design-system/src/tooltip/Tooltip'

export interface StateProps {
  layerId?: string
  query?: Query
  queries: Queries
  dataSource?: string
  dataSources: string[]
  queryLink?: string
  newQueryLink?: string
  dataSourceLink?: string
  dataSourceListLink: string
  showInternalDataSource?: boolean
  isJSSource?: boolean
}

export interface ActionProps {
  onChange: (query: Query) => void;
  onChangeDataSource: (dataSource: string) => void;
}

type Props = StateProps & ActionProps

export class DataEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  handleDataSourceChange(event) {
    this.props.onChangeDataSource(event.target.value)
  }

  handleQueryChange(queriesFromDataSource: Query[], event) {
    const index = Number(event.target.value)
    this.props.onChange(queriesFromDataSource[index] as Query)
  }

  getQueryOptions() {
    let queryOptions: SelectOption[] = []
    let queriesFromDataSource: Query[] = []
    if (this.props.dataSource) {
      queriesFromDataSource = this.props.queries.filter((query) => query.getDataSource() === this.props.dataSource)
      queryOptions = queriesFromDataSource.map((query, index) => ({
        value: index,
        label: query.getName(),
      }))
      queryOptions = sortBy(['label'], queryOptions)
    }

    return {queryOptions, queriesFromDataSource}
  }

  getDataSourceOptions() {
    const dataSources = this.props.dataSources
      .filter((dataSource) => this.props.showInternalDataSource ?? dataSource !== INTERNAL_DATA_SOURCE)
      .sort((dataSource1, dataSource2) => {
        if (dataSource1 === INTERNAL_DATA_SOURCE) {
          return -1
        }
        if (dataSource2 === INTERNAL_DATA_SOURCE) {
          return 1
        }
        return dataSource1.localeCompare(dataSource2)
      })
      .map((dataSource) => ({
        label: dataSource === INTERNAL_DATA_SOURCE ? i18n('NONE_ADD_IN_OBJECT_EDITOR') : dataSource,
        value: dataSource,
      }))
    
    if (this.props.dataSource && !dataSources.find((dataSource) => dataSource.value === this.props.dataSource)) {
      dataSources.unshift({
        label: i18n('CUSTOMIZED'),
        value: this.props.dataSource,
      })
    }

    return dataSources
  }

  render() {
    const {queryOptions, queriesFromDataSource} = this.getQueryOptions()
    const queryIndex = queriesFromDataSource.indexOf(this.props.query as any)
    const dataSourceIndex = this.props.dataSource ? this.props.dataSources.indexOf(this.props.dataSource) : -1
    const isQuerySelected = queryIndex > -1
    const isDataSourceSelected = dataSourceIndex > -1

    const dataSourceLink = isDataSourceSelected ? this.props.dataSourceLink : this.props.dataSourceListLink
    const dataSourceMessage = isDataSourceSelected ? i18n('GO_TO_DATA_SOURCE_NAME', {name: this.props.dataSource ?? ''}) : i18n('GO_TO_DATA_SOURCE_LIST')


    const queryLink = isQuerySelected && this.props.queryLink ? this.props.queryLink : this.props.newQueryLink
    const queryMessage = isQuerySelected ? i18n('GO_TO_QUERY_NAME', {name: this.props.query?.getName() ?? ''}) : i18n('NEW_QUERY')

    const dataSources = this.getDataSourceOptions()
    const value = this.props.dataSource

    return (
      <>
        <PanelField title={i18n('DATA_SOURCE')} layout="inline">
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 6,
            alignItems: 'start',
          }}>
            <FilterableSelect
              value={value}
              options={dataSources}
              onChange={(event) => this.handleDataSourceChange(event)}
              error={!this.props.dataSource}
              errorMessage={!this.props.dataSource ? i18n('SELECT_A_DATA_SOURCE') : undefined}
              testId='select-data-source'
            />
            {dataSourceLink && <Tooltip title={dataSourceMessage} placement="right">
              <IconButton component={Link} to={dataSourceLink} target="_blank">
                <Icon icon='open-in-new'/>
              </IconButton>
            </Tooltip>}
          </Box>
        </PanelField>
        {value !== INTERNAL_DATA_SOURCE && <PanelField title={i18n(this.props.isJSSource ? 'FUNCTION' : 'QUERY')} layout="inline">
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: isDataSourceSelected ? '1fr 40px' : '1fr',
            alignItems: 'start',
            gap: 6,
          }}>
            <FilterableSelect
              value={isQuerySelected ? queryIndex : undefined}
              options={queryOptions}
              error={!isQuerySelected}
              errorMessage={!isQuerySelected ? i18n(`SELECT_A_${this.props.isJSSource ? 'FUNCTION' : 'QUERY'}`) : undefined}
              onChange={(event) => this.handleQueryChange(queriesFromDataSource, event)}
              noOptionsText={this.props.dataSources ? i18n(`NO_${this.props.isJSSource ? 'FUNCTIONS' : 'QUERIES'}_FOUND`) : i18n('SELECT_A_DATA_SOURCE')}
              testId='select-query'
            />
            {isDataSourceSelected && queryLink && <Tooltip title={queryMessage} placement="right">
              <IconButton component={Link} to={queryLink} target="_blank">
                <Icon icon={isQuerySelected ? 'open-in-new' : 'add'}/>
              </IconButton>
            </Tooltip>
            }
          </Box>
        </PanelField>}

      </>
    )
  }
}
