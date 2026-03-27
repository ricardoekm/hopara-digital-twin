import React, {PureComponent} from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import transitionStyles from './view/ViewTransition.module.css'
import {LoadingSpinner} from '@hopara/design-system/src/loading-spinner/Spinner'
import {ErrorBanner} from '@hopara/design-system/src/error/ErrorBanner'
import {Theme} from '@hopara/design-system/src/theme/Theme'
import {styled} from '@hopara/design-system/src/theme'
import {css} from '@emotion/react'
import {Box} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import {CanvasEmptyState, EmptyStateType} from './empty-states/CanvasEmptyState'

export const MAIN_VIEW_ELM_ID = '_hopara_main_view_'

export const ViewStyle = styled(Box, {name: 'ViewStyle'})<{_backgroundColor?: string}>(({theme, _backgroundColor}) => {
  return {
    transformStyle: 'preserve-3d',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: _backgroundColor || 'white',
    height: '100%',
    userSelect: 'none',
    gridColumn: '1 / -1',
    gridRow: '1 / -1',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / -1',
      gridRow: '1 / 4',
    },
  }
})

interface ContainerProps {
  _isLoading: boolean,
  _hasAxis: boolean,
  _isChartWithFiltersOrEditPermissions: boolean,
}

export const ViewInner = styled('div', {name: 'ViewContainer'})<ContainerProps>((props) => {
  const styles = [css({
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    paddingBlockStart: props._hasAxis ? '6px' : 0,
    paddingInlineEnd: props._hasAxis ? '6px' : 0,
    paddingBlockEnd: 0,
    paddingInlineStart: props._isChartWithFiltersOrEditPermissions ? '41px' : 0,
    position: 'absolute',
    right: 0,
    top: 0,
  })]

  if (props._isLoading) {
    styles.push(css({
      filter: 'blur(4px)',
    }))
  }
  return styles
})

export const ViewLoadingSpinner = styled('div', {name: 'View_loadingSpinner'})({
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 10,
})

export const ViewLoadingProgressBar = styled('div', {name: 'View_loadingProgressBar'})({
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 10,
})

export type BaseViewProps = {
  someRowsetLoading: boolean
  fetchProgress?: number
  visualizationId?: string
  isEditing: boolean
  isDirty?: boolean
  isLoading?: boolean
  blockingError?: string
  hasAxis?: boolean
  isChartWithFiltersOrEditPermissions: boolean
  emptyStateType?: EmptyStateType
  isGeo?: boolean
  backgroundColor?: string
  view: React.ReactNode
  theme?: Theme
  attribution?: React.ReactNode
}

function getProgressbar(props: BaseViewProps) {
  const hasProgress = props.fetchProgress && Number.isFinite(props.fetchProgress)
  if (hasProgress || props.someRowsetLoading) {
    return <ViewLoadingProgressBar>
      <LinearProgress
        variant={hasProgress ? 'determinate' : 'indeterminate'}
        color='primary'
        value={props.fetchProgress}
        sx={{height: 3}
        }/>
    </ViewLoadingProgressBar>
  }

  if (props.isLoading && !props.blockingError) {
    return <ViewLoadingSpinner>
      <LoadingSpinner/>
    </ViewLoadingSpinner>
  }
}

export class View extends PureComponent<BaseViewProps> {
  containerId(): string {
    return MAIN_VIEW_ELM_ID
  }

  render(): React.ReactNode {
    return (
      <ViewStyle
        id={this.containerId()}
        _backgroundColor={this.props.backgroundColor}
      >
        {getProgressbar(this.props)}

        {!!this.props.blockingError &&
          <ErrorBanner message={this.props.blockingError}/>
        }

        {this.props.emptyStateType &&
          <CanvasEmptyState 
            type={this.props.emptyStateType}
            isTopAligned={this.props.isGeo}
          />
        }

        {this.props.visualizationId && !this.props.blockingError &&
          <>
            <ViewInner
              _isLoading={!!this.props.isLoading}
              _hasAxis={!!this.props.hasAxis}
              _isChartWithFiltersOrEditPermissions={this.props.isChartWithFiltersOrEditPermissions}>
              <SwitchTransition>
                <CSSTransition
                  key={`${this.props.visualizationId}`}
                  addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                  classNames={{...transitionStyles}}>
                  <div className={transitionStyles.transitionBlock}>
                    {this.props.view}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </ViewInner>
            {this.props.attribution}
          </>
        }
      </ViewStyle>
    )
  }
}
