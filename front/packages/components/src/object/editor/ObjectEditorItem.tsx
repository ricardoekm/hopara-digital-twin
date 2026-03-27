import React from 'react'
import {DetailsLine, DetailsTable} from '@hopara/design-system/src/details/DetailsTable'
import {DetailsIcon} from '@hopara/design-system/src/details/DetailsIcon'
import {DetailsTitle} from '@hopara/design-system/src/details/DetailsTitle'
import { DetailsStyle, DetailsHeaderStyle, ActionsBox } from '@hopara/design-system/src/details/DetailsStyle'
import {DetailsAction} from '@hopara/design-system/src/details/Details'
import { PureComponent } from '@hopara/design-system'
import { DetailsImage } from '@hopara/design-system/src/details/DetailsImage'
import { SxProps, Tab, Box } from '@mui/material'
import { ObjectAppearanceEditorContainer } from './ObjectAppearanceEditorContainer'
import { i18n } from '@hopara/i18n'
import { PillButton } from '@hopara/design-system/src/buttons/PillButton'
import { DetailsTabs } from '@hopara/design-system/src/tabs/DetailsTabs'

interface Props {
  thumb?: JSX.Element
  isThumbImage: boolean
  title: string
  titleField: string
  rowId?: string
  isPlaced: boolean
  onPlace: (placement: any) => void
  onTitleChange: (title: string) => void
  lines: DetailsLine[]
  isImage: boolean
  isModel: boolean
  cantPlaceReason?: string
  containerId: string
  titleEditable: boolean
  imageUrl?: string
  actionButtons?: DetailsAction[]
  canEditAppearance: boolean
  currentTab: number
  onTabChange: (tabIndex: number) => void
  sx?: SxProps
  isCollapsed: boolean
}

export class ObjectEditorItem extends PureComponent<Props> {
  render() {
    const isDetailsTabSelected = this.props.currentTab === 0 || !this.props.canEditAppearance
    const isAppearanceTabSelected = this.props.currentTab === 1 && this.props.canEditAppearance

    return (
      <Box sx={{ paddingTop: this.props.canEditAppearance ? 0 : this.props.isCollapsed ? 0 : 12 }}>
        {!this.props.isCollapsed && (
          <>
            {this.props.canEditAppearance && (
              <DetailsTabs
                value={this.props.currentTab}
                onChange={(_: any, newValue: number) => {
                  this.props.onTabChange(newValue)
                }}
                TabIndicatorProps={{ sx: { display: 'none' } }}
              >
                <Tab
                  label={i18n('DETAILS')}
                  disableRipple
                />
                <Tab
                  label={i18n('APPEARANCE')}
                  disableRipple
                />
              </DetailsTabs>
            )}

            {isDetailsTabSelected && (
              <DetailsStyle
                sx={this.props.sx}
                className={this.props.isCollapsed ? 'isCollapsed' : ''}
              >
                <DetailsHeaderStyle className="isThumbImage">
                  {!this.props.isThumbImage && <DetailsIcon icon={this.props.thumb} />}
                  {this.props.isThumbImage && <DetailsImage image={this.props.thumb} />}
                  <DetailsTitle _isThumbImage={this.props.isThumbImage} />
                </DetailsHeaderStyle>
                {!!this.props.actionButtons?.length && (
                  <ActionsBox className={this.props.isThumbImage ? 'isThumbImage' : ''}>
                    {this.props.actionButtons.map((action, i) => (
                      <PillButton
                        key={i}
                        onClick={action.onClick}
                        disabled={!action.enabled}
                        smallButton
                        pillVariant='primary'
                      >
                        {action.title}
                      </PillButton>
                    ))}
                  </ActionsBox>
                )}
                <DetailsTable
                  lines={this.props.lines}
                  collapsible={true}
                  editableLines={this.props.titleEditable ? [{
                    value: this.props.title,
                    title: this.props.titleField,
                    onChange: this.props.onTitleChange,
                  }] : []}
                />
              </DetailsStyle>
            )}
            
            {isAppearanceTabSelected && (
              <ObjectAppearanceEditorContainer />
            )}
          </>
        )}
      </Box>
    )
  }
}
