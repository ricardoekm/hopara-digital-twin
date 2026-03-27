import React from 'react'
import {parse as VegaParse, View as VegaView} from 'vega'
import {compile as VegaLiteCompile} from 'vega-lite'
import {select as d3Select} from 'd3'
import {LegendView, LegendViewContent} from '../LegendView'
import {StateProps} from '../LegendComponent'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {LegendTitle} from '../LegendTitleComponent'
import {LegendSpecFactory, LegendsSpec} from './LegendSpecFactory'
import {Legends} from '../Legends'
import {getLegendLayer} from '../LegendLayers'
import Case from 'case'
import { Legend } from '../Legend'
import {memoize} from '@hopara/memoize'

type State = {
  expanded: boolean
  visible: boolean
  title: string
  description?: string
}

export class VegaLegendComponent extends PureComponent<StateProps, State> {
  _ref = React.createRef<HTMLDivElement>()
  lastCacheKey = ''
  cacheStore = new Map()

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      visible: false,
      title: '',
    }
  }

  setTitle(title: string): void {
    if (this.state.title !== title) {
      this.setState({title})
    }
  }

  setDescription(description?: string): void {
    if (this.state.description !== description) {
      this.setState({description})
    }
  }

  createCacheKey(inputSpec: LegendsSpec, legendTitle?: string): string {
    const dataKeys = inputSpec.layer.reduce((key, layer) => {
      return `${key}_${layer.data?.values?.etag.getValue()}`
    }, '')
    return `${dataKeys}_${legendTitle}`
  }

  getTitle(legend?: Legend, vegaSpec?: any): string {
    if (legend?.title) return legend.title
    if (vegaSpec.spec.legends && vegaSpec.spec.legends[0]?.title) return Case.sentence(vegaSpec.spec.legends[0].title?.toString())
    return ''
  }

  getDescription(legend?: Legend, vegaSpec?: any): string {
    if (legend?.description) return legend.description
    if (vegaSpec.spec.legends && vegaSpec.spec.legends[0]?.description) return Case.sentence(vegaSpec.spec.legends[0].description?.toString())
    return ''
  }

  shouldRecreate(inputSpec: LegendsSpec, legendTitle?: string): boolean {
    const cacheKey = this.createCacheKey(inputSpec, legendTitle)
    if (cacheKey === this.lastCacheKey) return false
    this.lastCacheKey = cacheKey
    return true
  }

  async doCreateVegaView(inputSpec, legend) {
    if (!this.shouldRecreate(inputSpec, legend?.title)) return {}

    const vegaSpec = VegaLiteCompile(inputSpec as any)
    if (!vegaSpec || !vegaSpec.spec) return {}

    const title = this.getTitle(legend, vegaSpec)
    const runtime = VegaParse(vegaSpec.spec)
    const view = await new VegaView(runtime, { renderer: 'svg' })

    return {title, vegaSpec, legend, view}
  }


  async createVegaView() {
    if (!this.props.rowsets.length) return {}

    const legends = this.props.legends ?? new Legends()
    const legendLayer = getLegendLayer(this.props.layers, legends, this.props.rowsets)
    const legend = legends.find((l) => l.layer === legendLayer?.getId())
    const inputSpec = LegendSpecFactory.create(this.props.layers, legends, this.props.rowsets)

    const cacheKey = this.createCacheKey(inputSpec, legend?.title)
    const cachedCreateVegaView = memoize(this.doCreateVegaView.bind(this), {cacheKey, cacheStore: this.cacheStore})
    return cachedCreateVegaView(inputSpec, legend)
  }

  async createLegend() {
    if (!this.props.legends) return

    const {title, vegaSpec, legend, view} = await this.createVegaView()

    if (!view || !this._ref.current) return

    const svg = await view.toSVG()
    // eslint-disable-next-line @microsoft/sdl/no-inner-html
    this._ref.current.innerHTML = svg

    if (d3Select(this._ref.current).select('g.role-legend').empty() && this._ref.current) {
      return this.setState({visible: false})
    } else if (!this._ref.current) {
      return
    }

    this.setState({visible: true})
    const svgElm = d3Select(this._ref.current).select<SVGElement>('svg')

    if (!svgElm.empty() && this.state.expanded) {
      (svgElm.node() as SVGSVGElement).classList.add('LegendExpanded')
    }

    const legendElm = svgElm.select<SVGGElement>('.role-legend-entry')
    legendElm.attr('transform', 'translate(0, 0)')
    legendElm.select('g').attr('transform', 'translate(0, 0)')

    const firstGroupElm = svgElm.select<SVGGElement>('g')
    firstGroupElm.attr('transform', 'translate(0, 0)')
    firstGroupElm.node()?.appendChild(legendElm.node() as SVGGElement)

    this.setTitle(title ?? '')
    this.setDescription(this.getDescription(legend, vegaSpec))
    svgElm.select('.root').remove()
    svgElm.select('.background').remove()
    svgElm.select('.foreground').remove()

    const dimensions = legendElm.node()?.getBBox()
    if (dimensions) {
      svgElm.attr('height', `${dimensions.height}px`)
      svgElm.attr('width', `${dimensions.width}px`)
      svgElm.attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
      this._ref.current.style.height = `${this.state.expanded ? dimensions.height : 0}px` as string
      this._ref.current.style.width = `${dimensions.width}px` as string
    }
  }

  componentDidUpdate() {
    this.createLegend()
  }

  render() {
    if (!this.props.layers.length) return null
    const { expanded, visible } = this.state
    const isChart = this.props.visualization?.isChart() ?? false
    
    return (
      <LegendView
        className={`${isChart ? 'isChart' : ''} ${visible ? 'visible' : ''} ${expanded ? 'expanded' : ''}` }
        >
        <LegendTitle
          title={this.state.title}
          description={this.state.description}
          onClick={() => this.setState({expanded: !this.state.expanded})}
          expanded={!!this.state.expanded}/>
        <LegendViewContent
          ref={this._ref}/>
      </LegendView>
    )
  }
}
