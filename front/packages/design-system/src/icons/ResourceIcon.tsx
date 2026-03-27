import React from 'react'
import {TintImage} from '../TintImage'
import { PureComponent } from '../component/PureComponent'
import {IconUrlResolver} from '@hopara/resource'

interface Props {
  icon?: string
  libraryName?: string
  tenant: string
  fallback?: string
  size?: number
}

export class ResourceIcon extends PureComponent <Props> {
  render() {
    let url: string
    if (!this.props.icon) {
      url = IconUrlResolver.resolve(this.props.tenant, this.props.libraryName, this.props.fallback ?? 'machine', this.props.fallback)
    } else {
      url = IconUrlResolver.resolve(this.props.tenant, this.props.libraryName, this.props.icon, this.props.fallback)
    }
    return <TintImage src={url} size={this.props.size}/>
  }
}
