import React from 'react'
import {LoadingSpinnerLoader, LoadingSpinnerSpinner, LoadingSpinnerView} from './Spinner.theme'
import { PureComponent } from '../component/PureComponent'

type Props = {
  fullscreen?: boolean
  relative?: boolean
  testId?: string
}

export class LoadingSpinner extends PureComponent<Props> {
  render() {
    return (
      <LoadingSpinnerView
      className={`${this.props.fullscreen ? 'fullscreen' : ''} ${this.props.relative ? 'relative' : ''}`}
        data-testid={this.props.testId ?? 'loading'}
      >
        <LoadingSpinnerLoader>
          <LoadingSpinnerSpinner/>
        </LoadingSpinnerLoader>
      </LoadingSpinnerView>
    )
  }
}
