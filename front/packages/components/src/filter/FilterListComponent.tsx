import React from 'react'
import {ColumnType, Queries} from '@hopara/dataset'
import {Filters} from './domain/Filters'
import {ComparisonType, Filter} from './domain/Filter'
import {getAutoFillValues} from './domain/AutoFill'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {FilterCard} from './view/Filter'
import {SelectedFilters} from './domain/SelectedFilters'
import {SearchFilters} from './domain/SearchFilters'
import {uniq} from 'lodash/fp'
import {i18n} from '@hopara/i18n'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {Authorization} from '@hopara/authorization'
import {CloseEditorButtonContainer} from '../visualization/CloseEditorContainer'
import { DateRangeValue } from './DateRangeFilter'


export interface StateProps {
  filters: Filters
  selectedFilters: SelectedFilters
  searchFilters: SearchFilters
  queries: Queries
  authorization: Authorization
  fallbackVisualizationId?: string
}

export interface ActionProps {
  onSearch: (filter: Filter, term: string | undefined) => void
  onChange: (filter: Filter, value: string | undefined) => void
  onDateFilterChange: (filter: Filter, values?: DateRangeValue) => void
  onLoad: () => void
}

type Props = StateProps & ActionProps

class FilterListComponent extends PureComponent<Props> {
  componentDidMount(): void {
    this.props.onLoad()
  }

  getTitlePrefix(filter: Filter): string {
    if ( filter.comparisonType === ComparisonType.NOT_EQUALS ) {
      return i18n('NOT_EQUALS_FILTER_PREFIX')
    }

    return ''
  }

  render() {
    if (!this.props.filters) return null

    return (
      <>
        <PanelTitleBar
          title={i18n('FILTERS')}
          buttons={[<CloseEditorButtonContainer key="close"/>]}
        />
        {(this.props.filters as any).map((filter: Filter, i) => {
          const filterColumn = this.props.queries?.findQuery(filter.data.getQueryKey())?.columns.get(filter.field)
          const searchFilter = this.props.searchFilters.getByDataAndField(filter.data, filter.field)
          const selectedFilter = this.props.selectedFilters.getByField(filter.field)

          const values = filterColumn?.type === ColumnType.DATETIME ? [] : filter.values
          const autoFillValues = getAutoFillValues(filter, this.props.selectedFilters)
          const options = selectedFilter ? [...values, ...selectedFilter.values.flat(), ...autoFillValues] : [...values, ...autoFillValues]
          const hasAutoFill = !!filter.autoFill?.values?.length

          return (
            <FilterCard
              key={`${filter.field}-${i}`}
              title={this.getTitlePrefix(filter) + (filterColumn?.getLabel() ?? filter.field)}
              options={uniq(options)}
              values={autoFillValues.length ? autoFillValues : (selectedFilter?.values ?? [])}
              columnType={filterColumn && filterColumn.getType()}
              singleChoice={filter.singleChoice}
              comparisonType={filter.comparisonType}
              query={searchFilter?.term}
              queryResults={searchFilter?.values}
              onSearch={(query) => this.props.onSearch(filter, query)}
              onChange={(value) => this.props.onChange(filter, value)}
              onDateFilterChange={(values) => this.props.onDateFilterChange(filter, values)}
              filterColumn={filterColumn?.getLabel() ?? filter.field}
              hasAutoFill={hasAutoFill}
            />
          )
        })}
      </>
    )
  }
}

export default FilterListComponent

