import React, {PureComponent} from 'react'
import legend from 'd3-svg-legend'
import {LegendView, LegendViewContent} from './LegendView'
import {ColumnType, Queries, ValueFormatter} from '@hopara/dataset'
import {D3Formatter} from '@hopara/dataset/src/formatter/D3Formatter'
import {Layers} from '../layer/Layers'
import {ColorFormat, getColumn} from '@hopara/encoding'

import {getFormatter} from '@hopara/dataset/src/formatter/ValueFormatter'
import {StateProps} from './LegendComponent'
import {LegendTitle} from './LegendTitleComponent'
import {Legends} from './Legends'
import {getLegendLayer} from './LegendLayers'

import {scaleOrdinal as d3ScaleOrdinal} from 'd3'
import {Legend} from './Legend'
import { Rowsets } from '../rowset/Rowsets'

legend.legendColor.prototype.labelFormat = (fn) => fn

// The d3-svg-legend plugin works only if d3 is imported with require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const d3 = require('d3')

interface GetScaleParams {
  layers: Layers
  rowsets: Rowsets
  queries: Queries
  legends: Legends
}

interface LegendProps {
  scale?: Scale,
  valueFormatter?: ValueFormatter,
  columnLabel?: string,
  reversed?: boolean
  description?: string
}

function createStaticLegend(legend: Legend): LegendProps {
  return {
    scale: d3ScaleOrdinal(legend.items!.map((item) => item.label), legend.items!.map((item) => item.color)),
    reversed: true,
    valueFormatter: getFormatter(ColumnType.STRING),
    columnLabel: legend.title,
    description: legend.description,
  }
}

export function getScale({layers, rowsets, queries, legends}: GetScaleParams): LegendProps {
  const legendLayer = getLegendLayer(layers, legends, rowsets)
  if (!legendLayer) {
    return {}
  }
  const legend = legends.find((l) => l.layer === legendLayer.getId()) as Legend
  if (legend.items && legend.items.length > 0) {
    return createStaticLegend(legend)
  } else {
    const rowset = rowsets.getById(legendLayer.getRowsetId())
    if (!rowset) return {}

    const query = queries.findQuery(legendLayer.getQueryKey())
    const color = legendLayer.getLegendColorEncoding()!
    const column = query?.getColumns().get(color.field)
    if (!column) return {}

    return {
      scale: color.getScaleFunction(rowset.rows, getColumn(color, query?.getColumns()), ColorFormat.hex),
      reversed: !!color.getScale().reverse,
      valueFormatter: getFormatter(column.getType()),
      columnLabel: legend.title ?? column.getLabel(),
      description: legend.description,
    }
  }
}

const DEFAULT_INVALID_LABEL_VALUE = '___INVALID_LABEL_VALUE___'

type State = {
  expanded: boolean
  visible: boolean
  title: string
  description?: string
}

interface Scale {
  quantiles?: () => string[]
  range: () => string[]
  domain: () => (string | number)[]
}

interface FormatLabelProps {
  i: number,
  domain: string[],
  generatedLabels: string[]
}

export class GenericLegendComponent extends PureComponent<StateProps, State> {
  _ref = React.createRef<HTMLDivElement>()

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      visible: false,
      title: '',
    }
  }

  setTitle(title: string): void {
    if (title !== this.state.title) {
      this.setState({title})
    }
  }

  setDescription(description?: string): void {
    if (description !== this.state.description) {
      this.setState({description})
    }
  }

  removeQuantileDuplicatedValues(scale: Scale, {i, domain, generatedLabels}: FormatLabelProps) {
    // fix generated quantiles with duplicated steps
    const quantilesWithMin = [domain[0], ...scale.quantiles!()]
    const isSameAsNext = i < (quantilesWithMin.length + 1) ? quantilesWithMin[i] === quantilesWithMin[i + 1] : false
    if (isSameAsNext) return DEFAULT_INVALID_LABEL_VALUE
    return generatedLabels[i]
  }

  formatLabel(scale: Scale, {i, domain, generatedLabels}: FormatLabelProps) {
    const isQuantile = !!scale.quantiles
    if (isQuantile) return this.removeQuantileDuplicatedValues(scale, {i, domain, generatedLabels})
    return generatedLabels[i]
  }

  removeInvalidValues(...filterParams) {
    const [cell] = filterParams
    return cell.label !== DEFAULT_INVALID_LABEL_VALUE
  }

  renderLegend() {
    const {
      scale,
      valueFormatter,
      columnLabel,
      reversed,
      description,
    } = getScale({
      layers: this.props.layers,
      rowsets: this.props.rowsets,
      queries: this.props.queries,
      legends: this.props.legends,
    })

    const svgElm = d3.select(this._ref.current).select('svg')
    if (svgElm.empty()) {
      d3.select(this._ref.current).append('svg')
    }

    const svg = d3.select(this._ref.current).select('svg')
    d3.select(this._ref.current).selectAll('g').remove()
    if (!scale) {
      return this.setState({visible: false})
    } else if (!this._ref.current) {
      return
    }

    this.setState({visible: true})

    let stringFormat = ''
    if (valueFormatter instanceof D3Formatter) {
      stringFormat = valueFormatter.getFormatString() ?? ''
    }

    const legendBoxClasses = ['LegendViewBox']
    if (this.state.expanded) {
      legendBoxClasses.push('LegendExpanded')
    }

    svg
      .append('g')
      .attr('class', legendBoxClasses.join(' '))

    const legendSettings = legend
      .legendColor()
      .title(columnLabel ?? '')
      .shape('circle')
      .shapeRadius(5)
      .shapePadding(5)
      .labelOffset(8)
      .orient('vertical')
      .ascending(!reversed)
      .labelFormat(d3.format(stringFormat))
      .labels((props) => this.formatLabel(scale!, props))
      .cellFilter(this.removeInvalidValues)
      .scale(scale)

    svg
      .select('.LegendViewBox')
      .call(legendSettings)

    const title = svg.select('.legendTitle').node()?.innerHTML ?? ''
    this.setTitle(title)
    this.setDescription(description)

    const dimensions = d3.select(this._ref.current).select('svg .legendCells').node().getBBox()
    if (dimensions) {
      svg.attr('width', dimensions.width)
      svg.attr('height', this.state.expanded ? dimensions.height : 0)
      this._ref.current.style.width = `${dimensions.width}px`
      this._ref.current.style.height = `${this.state.expanded ? dimensions.height : 0}px`
    }
  }

  componentDidMount() {
    this.renderLegend()
  }

  componentDidUpdate() {
    this.renderLegend()
  }

  render() {
    const { visible, expanded } = this.state
    const isChart = this.props.visualization?.isChart() ?? false
    const isWhiteboard = this.props.visualization?.isWhiteboard() ?? false

    return (
      <LegendView
        className={`${isChart ? 'isChart' : ''} ${visible ? 'visible' : ''} ${expanded ? 'expanded' : ''} ${isWhiteboard ? 'isWhiteboard' : ''}` }
      >
        <LegendTitle
          title={this.state.title}
          description={this.state.description}
          onClick={() => this.setState({expanded: !this.state.expanded})}
          expanded={this.state.expanded}/>
        <LegendViewContent
          ref={this._ref}/>
      </LegendView>
    )
  }
}


