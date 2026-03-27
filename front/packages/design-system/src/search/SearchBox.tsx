import React from 'react'
import { debounce } from 'lodash/fp'
import { InputSearch } from '../form'
import { styled } from '../theme'
import { css } from '@emotion/react'
import { PureComponent } from '../component/PureComponent'

export const SearchBoxView = styled('div', { name: 'SearchBoxView' })({
  flex: 1,
})

export const SearchBoxResults = styled('div', { name: 'SearchBoxResults' })<{
  _active;
  _hasResults;
}>(({ theme, _active, _hasResults }) => {
  const style = css({
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    boxSizing: 'border-box',
    opacity: _active ? '1' : '0',
    transition: 'opacity ease-in-out 0.24s, box-shadow ease-in-out 0.24s',
    zIndex: '2',
    height: _active ? 'auto' : '0',
    marginTop: 2,
    border: _active ? '1px solid rgba(0,0,0,0.1)' : 'inherit',
    borderRadius: '3px',
  })
  if (_hasResults) {
    return [
      style,
      css({
        ':hover': {
          border: '1px solid rgba(0,0,0,0.1)',
          height: 'auto',
          opacity: '1',
        },
      }),
    ]
  }
  return style
})

export const SearchBoxResultsInner = styled('div', {
  name: 'SearchBoxResultsInner',
})({
  padding: 0,
})

export const SearchBoxResultsList = styled('ul', {
  name: 'SearchBoxResultsList',
})({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gridAutoFlow: 'row',
})

export const SearchBoxResultsItem = styled('li', {
  name: 'SearchBoxResultsItem',
})(({theme}) => ({
  'paddingInline': 8,
  'paddingBlock': 4,
  ':hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.light,
  },
}))

export const SearchBoxResultsValue = styled('span', {
  name: 'SearchBoxResultsValue',
})({
  'display': 'block',
  'padding': 2,
})

export const SearchBoxNoResults = styled('p', { name: 'SearchBoxNoResults' })({
  margin: '0',
  padding: 10,
})

type props = {
  term?: string;
  name?: string;
  placeholder?: string;
  results?: any[];
  className?: string;
  renderItem?: Function;
  onChange?: Function;
  onItemClick?: Function;
};

type state = {
  active: boolean;
};

export class SearchBox extends PureComponent<props, state> {
  constructor(props: props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  setActive(): void {
    this.setState({ active: true })
  }

  setHidden(): void {
    this.setState({ active: false })
  }

  onInputFocus(): void {
    this.setActive()
  }

  onInputBlur(): void {
    this.setHidden()
  }

  onInputChange(e: any) {
    const value = e.target.value
    if (this.props.onChange) return this.props.onChange(value)
  }

  hasResults(): boolean {
    return !!(this.props.results && this.props.results.length > 0)
  }

  getPlaceholder(): string {
    if (this.props.placeholder) return this.props.placeholder
    return `search more ${this.props.name ? 'in ' + this.props.name : ''}`
  }

  render(): React.ReactNode {
    const { term, results, renderItem } = this.props
    return (
      <SearchBoxView>
        <InputSearch
          placeholder={this.getPlaceholder()}
          initialValue={this.props.term}
          onFocus={() => this.onInputFocus()}
          onBlur={() => this.onInputBlur()}
          onChange={debounce(200, this.onInputChange.bind(this))}
        />
        {results && (
          <SearchBoxResults
            _active={this.state.active && !!term}
            _hasResults={this.hasResults()}
          >
            <SearchBoxResultsInner>
              {this.hasResults() && (
                <SearchBoxResultsList>
                  {results.map((result, i) => {
                    return (
                      <SearchBoxResultsItem key={i}>
                        {renderItem?.(result)}
                        {!renderItem && (
                          <SearchBoxResultsValue
                            data-clickable={!!this.props.onItemClick}
                            onClick={() =>
                              this.props.onItemClick &&
                              this.props.onItemClick(result)
                            }
                          >
                            {String(result)}
                          </SearchBoxResultsValue>
                        )}
                      </SearchBoxResultsItem>
                    )
                  })}
                </SearchBoxResultsList>
              )}
              {!this.hasResults() && this.state.active && (
                <SearchBoxNoResults>no results was found</SearchBoxNoResults>
              )}
            </SearchBoxResultsInner>
          </SearchBoxResults>
        )}
      </SearchBoxView>
    )
  }
}
