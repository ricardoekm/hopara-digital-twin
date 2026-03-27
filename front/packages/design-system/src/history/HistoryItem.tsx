import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {Button, ListItemText} from '@mui/material'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import {i18n} from '@hopara/i18n'
import {ItemStyle} from '../list/ListItem'
import {Image} from '../image/Image'
import {Chip} from '@mui/material'

dayjs.extend(LocalizedFormat)

interface Props {
  editedAt: Date;
  editedBy?: string;
  onRestore?: () => void;
  onCheckout?: () => void;
  isCurrentVersion: boolean;
  selected: boolean;
  imageSrc?: string;
}

export class HistoryItem extends PureComponent<Props> {
  render() {
    return (
      <ItemStyle
        onClick={(e) => {
          e.stopPropagation()
          if (this.props.onCheckout) this.props.onCheckout()
        }}
        _clickable={!!this.props.onCheckout}
        _selected={this.props.selected}
        sx={{
          'width': '100%',
          'gap': '1em',
          '&:hover': {
            '& .MuiButton-root': {
              display: 'block',
            },
          },
          '& img': {
            margin: 'auto',
            maxWidth: '5em',
            maxHeight: '5em',
            boxShadow: '0 2px 3px -1px rgba(0,0,0,0.275)',
          },
        }}
      >
        {this.props.imageSrc && (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            }}
          >
            <Image src={this.props.imageSrc} placeHolderSize={68}/>
          </div>
        )}
        <ListItemText
          primary={<>
            {dayjs(this.props.editedAt).format('lll')}
            &nbsp;
            {this.props.isCurrentVersion && <Chip size="small" label={i18n('CURRENT')} />}
          </>}
          secondary={this.props.editedBy}
        />
        {!this.props.isCurrentVersion && this.props.onRestore &&
          <Button
            sx={{display: !this.props.onCheckout ? 'block' : 'none'}}
            onClick={(e) => {
              e.stopPropagation()
              return this.props.onRestore?.()
            }}
          >
            {i18n('RESTORE')}
          </Button>
        }
      </ItemStyle>
    )
  }
}
