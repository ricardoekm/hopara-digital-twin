import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {Box, Skeleton, SxProps} from '@mui/material'
import {omit} from 'lodash/fp'
import {PlaceHolderTypes, ImageFetch, ModelFetch, ResourceType} from '@hopara/resource'
import axios from 'axios'

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  sx?: SxProps
  placeHolderSize?: number
  parentRef?: React.RefObject<HTMLDivElement>
  resourceType?: ResourceType
}

type State = {
  image: string | null
}

export class Image extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      image: null,
    }
  }

  fetchImage(src: string) {
    const imageFetch = new ImageFetch()
    const modelFetch = new ModelFetch()
    const fetchObj = this.props.resourceType === ResourceType.model ? modelFetch : imageFetch

    axios.get(src, {headers: {accept: 'image/*'}, responseType: 'blob'})
      .then((res) => {
        const contentLength = Number(res.headers['content-length'] || 0)
        if (res.status === 202 && contentLength !== 0) return res.data
        if (res.status === 202) return null
        if (res.status === 200) return res.data
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText ? '- ' + res.statusText : ''}`)
      })
      .then((blob) => {
        const image = blob ? URL.createObjectURL(blob) : fetchObj.getPlaceholder(PlaceHolderTypes.PROCESSING)
        this.setState({image})
      })
      .catch(() => {
        this.setState({image: fetchObj.getPlaceholder(PlaceHolderTypes.NOT_FOUND)})
      })
  }

  getSkeletonWidth() {
    if (this.props.parentRef?.current?.getBoundingClientRect().width) return this.props.parentRef.current.getBoundingClientRect().width
    if (this.props.placeHolderSize) return this.props.placeHolderSize
    return 24
  }

  getSkeletonHeight() {
    return this.getSkeletonWidth() / 1.5
  }

  componentDidMount(): void {
    if (!this.props.src) return
    return this.fetchImage(this.props.src)
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (this.props.src && prevProps.src !== this.props.src) {
      return this.fetchImage(this.props.src)
    }
  }

  render() {
    if (!this.state.image) {
      return <Skeleton variant="rectangular" height={this.getSkeletonHeight()}
                                             width={this.getSkeletonWidth()}
                                             sx={{justifySelf: 'stretch'}} />
    }
    return <Box component='img' {...omit(['fallback', 'parentRef', 'placeHolderSize', 'resourceType'], this.props) as any} src={this.state.image}/>
  }
}
