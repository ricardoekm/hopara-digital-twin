import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import {ObjectTypeList} from '@hopara/design-system/src/list'
import {PureComponent} from '@hopara/design-system'
import {InfiniteObjectList, RowListProps} from './InfiniteObjectList'
import {i18n} from '@hopara/i18n'
import {Box, Typography} from '@mui/material'

export class ObjectEditorList extends PureComponent<RowListProps> {
  render() {
    let message = i18n('NO_RESULTS_FOUND')
    if (!this.props.rowset.searchTerm) {
      message = i18n('THERE_ARE_NO_OBJECTS_ADDED')
      if (this.props.canInsert) {
        message += ` ${i18n('USE_THE_BUTTON_ABOVE_TO_ADD_ONE')}`
      }
    }

    if (this.props.rowset.isLoaded() && !this.props.rowset.rows.length) {
      return <Box sx={{
        textAlign: 'center',
        padding: 12,
        textWrap: 'balance',
      }}>
        <Typography>{message}</Typography>
      </Box>
    }

    return (
      <ObjectTypeList sx={{
        'flex': 1,
        'overflow': 'hidden',
        '@keyframes pushListDown': {
          '0%': {
            transform: 'translateY(-78px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      }}>
        <AutoSizer>
          {({height, width}) => {
            return (
              <InfiniteObjectList
                {...this.props}
                isMobile={this.props.isMobile}
                key={this.props.layer.getId()}
                width={width}
                height={height}
                canPlace={this.props.canPlace}
              />
            )
          }}
        </AutoSizer>
      </ObjectTypeList>
    )
  }
}

