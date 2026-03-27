import React from 'react'
import {PanelList} from '../panel/PanelList'
import {ErrorPanel} from '../error/ErrorPanel'
import {Skeleton} from '@mui/material'
import {HistoryItem} from './HistoryItem'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '../component/PureComponent'
import {ItemStyle, ItemText} from '../list/ListItem'

interface Props {
  loading: boolean;
  error?: string;
  items: {
    version: number;
    editedAt: Date;
    editedBy?: string;
    imageSrc?: string;
  }[];
  currentVersion?: number;
  disableAnonymous?: boolean;
  onRestoreVersion?: (version: number) => void;
  onCheckoutVersion?: (version?: number) => void;
}

export class VersionHistory extends PureComponent <Props> {
  render() {
    return (
      <PanelList>
        {this.props.loading &&
          [...new Array(6)].map((_, index) => (
            <ItemStyle key={index}>
              <ItemText>
                <Skeleton animation="wave" width="70%"/>
                <Skeleton animation="wave" width="50%"/>
              </ItemText>
            </ItemStyle>
          ))}

        {!this.props.loading && this.props.error && <ErrorPanel error={this.props.error}/>}

        {!this.props.loading &&
          !this.props.error &&
          this.props.items.map((item, index) => {
            const isCurrentVersion = index === 0
            const selected =
              item.version === this.props.currentVersion ||
              (isCurrentVersion && this.props.currentVersion === undefined)
            return (
              <HistoryItem
                key={index}
                isCurrentVersion={isCurrentVersion}
                editedAt={item.editedAt ?? (item as any).updatedAt}
                editedBy={
                  item.editedBy ??
                  (this.props.disableAnonymous ? undefined : i18n('ANONYMOUS'))
                }
                selected={selected}
                imageSrc={item.imageSrc}
                onCheckout={this.props.onCheckoutVersion ? () => {
                  const version = isCurrentVersion ? undefined : item.version
                  this.props.onCheckoutVersion!(version)
                } : undefined}
                onRestore={this.props.onRestoreVersion ? () => {
                  this.props.onRestoreVersion?.(item.version)
                } : undefined}
              />
            )
          })}
      </PanelList>
    )
  }
}
