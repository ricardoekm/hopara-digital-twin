import React from 'react'
import HoparaIframe from '@hopara/iframe/src/client'
import { EmbeddedProps } from '.'
import { isEqual } from 'lodash/fp'

export class Hopara extends React.Component<EmbeddedProps> {
  wrapperRef = React.createRef<HTMLDivElement>()
  hoparaInstance: HoparaIframe

  componentDidMount(): void {
    const hoparaInstance = HoparaIframe.init({
      ...this.props,
      targetElement: this.wrapperRef.current,
    })

    if (hoparaInstance) this.hoparaInstance = hoparaInstance
    if (this.props.controller) this.props.controller.setRefreshSignal(this.hoparaInstance?.refresh.bind(this.hoparaInstance))
  }

  symplifyProps(props: EmbeddedProps): any {
    return {
      ...props,
      dataLoaders: props.dataLoaders?.map(({query, source, cache}) => ({query, source, cache})),
      callbackNames: props.callbacks?.map(({name}) => name),
    }
  }

  shouldComponentUpdate(nextProps: Readonly<EmbeddedProps>): boolean {
    if (!isEqual(this.symplifyProps(this.props), this.symplifyProps(nextProps))) return true
    return false
  }

  componentDidUpdate(): void {
    if (this.hoparaInstance) this.hoparaInstance.update(this.props)
    if (this.props.controller) this.props.controller.setRefreshSignal(this.hoparaInstance?.refresh.bind(this.hoparaInstance))
  }

  componentWillUnmount(): void {
    this.hoparaInstance.destroy()
  }

  render() {
    return (
      <div ref={this.wrapperRef} data-hopara-embedded style={{width: '100%', height: '100%'}} />
    )
  }
}
