import React from 'react'
import {VersionHistory} from '@hopara/design-system/src/history/VersionHistory'
import {UploadStatus} from '@hopara/design-system/src/buttons/UploadButton'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Box} from '@mui/material'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'
import { ResourceUploadState, ResourceUploadStatus } from './ResourceStore'


export interface StateProps {
  items: {
    version: number;
    editedAt: Date;
    editedBy?: string;
    imageSrc?: string;
  }[],
  loading: boolean;
  currentVersion?: number;
  progress?: number;
  status?: UploadStatus;
  name?: string;
}

export interface ActionProps {
  onClose: () => void;
  onRestoreVersion: (version: number) => void;
}

interface SuperProps {
  title: string;
  emptyMessage: string;
}

export type ResourceHistoryProps = StateProps & ActionProps


export const getResourceProgressType = (resourceUpload?: ResourceUploadState) => {
  if (!resourceUpload?.status || resourceUpload.status === ResourceUploadStatus.UPLOADED) return
  if (resourceUpload.status === ResourceUploadStatus.UPLOADING && resourceUpload.progress === 1) return 'processing'
  return 'uploading'
}

export class ResourceHistoryComponent extends PureComponent<StateProps & ActionProps & SuperProps> {
  render() {
    return (
      <SubPanelWrapper>
        <SubPanel
          header={<PanelTitleBar
            title={this.props.title}
            subtitle={this.props.name}
            onBackClick={this.props.onClose}
          />}
        >

          {!this.props.items.length && !this.props.loading &&
            <Box sx={{paddingInline: 12}}>
              <Empty description={this.props.emptyMessage}/>
            </Box>
          }
          <VersionHistory
            loading={this.props.loading}
            error={''}
            items={this.props.items}
            currentVersion={this.props.currentVersion ?? 0}
            onRestoreVersion={this.props.onRestoreVersion}
            disableAnonymous
          />
        </SubPanel>
      </SubPanelWrapper>
    )
  }
}
