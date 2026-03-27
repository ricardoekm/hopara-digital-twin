import React from 'react'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {MAIN_VIEW_ELM_ID} from '../../view/View'
import {DetailsLine} from '../../details/DetailsLine'
import {UploadStatus} from '@hopara/design-system/src/buttons/UploadButton'
import {i18n} from '@hopara/i18n'
import {Layer} from '../../layer/Layer'
import Visualization from '../../visualization/Visualization'
import {Row} from '@hopara/dataset'
import {World} from '../../world/World'
import {Authorization} from '@hopara/authorization'
import {Floor} from '../../floor/Floor'
import {ObjectEditorItem} from './ObjectEditorItem'
import {ObjectIcon, ObjectIconContext} from '../ObjectIcon'
import {PureComponent} from '@hopara/design-system'
import {RowPlaceCard} from '@hopara/design-system/src/buttons/RowPlace/RowPlaceCard'
import {createActionButtons} from '../../action/ActionLineFactory'
import {CallbackFunction} from '../../action/ActionReducer'
import {isImagePreview} from '../../details/visualization/DetailsComponent'
import {Config} from '@hopara/config'
import {MenuItemOrDivider, MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'
export type StateProps = {
  rowId?: string
  lines: DetailsLine[]
  uploadProgress?: number
  uploadStatus?: UploadStatus
  isImage: boolean
  isModel: boolean
  title: string
  titleField: string
  canEditTitle: boolean
  canInsert: boolean
  canBack: boolean
  canPlace: boolean
  cantPlaceReason?: string
  isRowSaving: boolean
  registeredCallbacks: CallbackFunction[]
  layer: Layer
  visualization?: Visualization
  row: Row
  world: World
  currentFloor?: Floor
  authorization: Authorization
  lastImageVersionDate?: Date
  isMobile: boolean
  canEditAppearance: boolean
  currentTab: number
  isCollapsed: boolean
}

export type ActionProps = {
  onCloseButtonClick: () => void,
  onActionClick: (action) => void,
  onLockClick: (layerId: string) => void,
  onLockOtherLayersClick: (layerId: string) => void,
  onUnlockOtherLayersClick: (layerId: string) => void,
  onDelete: () => void,
  onBackButtonClick?: () => void,
  onPlace: (placement: any) => Promise<void>,
  onClickMobile: () => void,
  onTitleChange: (title: string) => void,
  onTabChange: (tabIndex: number) => void,
}

export type Props = StateProps & ActionProps & { canInsert?: boolean }

const getMenuItems = (props: Props): MenuItemOrDivider[] => {
  const locked = props.layer.getLocked()
  const items: MenuItemOrDivider[] = [
    {
      label: locked ? i18n('UNLOCK_EDITING') : i18n('LOCK_EDITING'),
      onClick: () => props.onLockClick?.(props.layer.getId()),
    },
    {
      label: i18n('LOCK_OTHER_LAYERS'),
      onClick: () => props.onLockOtherLayersClick?.(props.layer.getId()),
    },
    {
      label: i18n('UNLOCK_OTHER_LAYERS'),
      onClick: () => props.onUnlockOtherLayersClick?.(props.layer.getId()),
    },
  ]
  if (props.canInsert) {
    items.push('divider')
    items.push({
      onClick: props.onDelete,
      label: i18n('DELETE_OBJECT', {name: props.title}),
      deleteConfirmMessage: () => i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_ROW', {name: props.lines[0]?.value || ''}),
      color: 'error',
    })
  }
  return items
}

export class ObjectEditorItemComponent extends PureComponent<Props> {
  rowPlaceCardRef: React.RefObject<HTMLDivElement> = React.createRef()

  render() {
    return (
      <SubPanelWrapper className={this.props.isCollapsed ? 'isCollapsed' : ''}>
        <SubPanel
          header={
            <PanelTitleBar
              className={this.props.isCollapsed ? 'isCollapsed' : ''}
              onBackClick={this.props.canBack ? this.props.onBackButtonClick : undefined}
              buttons={[
                <MoreButton key="more" menuItems={getMenuItems(this.props)}/>,
              ]}
              title={this.props.title}
            />
          }
        >
          <ObjectEditorItem
            key={this.props.layer.getRowsetId() + this.props.rowId}
            containerId={MAIN_VIEW_ELM_ID}
            isThumbImage={isImagePreview(this.props.layer, this.props.lines)}
            thumb={<RowPlaceCard
              ref={this.rowPlaceCardRef}
              isMobile={this.props.isMobile}
              isImage={isImagePreview(this.props.layer, this.props.lines)}
              canPlace={this.props.canPlace}
              isPlaced={this.props.row.isPlaced()}
              isSaving={this.props.isRowSaving}
              cantPlaceReason={this.props.cantPlaceReason}
              id={this.props.rowId}
              onPlace={this.props.onPlace}
              onClickMobile={this.props.onClickMobile}
              containerId={MAIN_VIEW_ELM_ID}
              size={Config.getValueAsBoolean('IS_SMALL_WIDTH_SCREEN') ? 'small' : 'large'}
              tooltipPlacement="right"
              getIcon={(placing) => <ObjectIcon
                key={this.props.row._id}
                parentRef={this.rowPlaceCardRef}
                authorization={this.props.authorization}
                row={this.props.row}
                layer={this.props.layer}
                size={Config.getValueAsBoolean('IS_SMALL_WIDTH_SCREEN') ? 24 : 36}
                maxSize='40vh'
                smMaxSize='54px'
                context={placing ? ObjectIconContext.PLACING : ObjectIconContext.PLACE}
                detailsLines={this.props.lines}
                lastImageVersionDate={this.props.lastImageVersionDate}
              />}
            />}
            title={this.props.title}
            titleField={this.props.titleField}
            onPlace={this.props.onPlace}
            lines={this.props.lines}
            rowId={this.props.rowId}
            isPlaced={this.props.row.isPlaced()}
            isImage={this.props.isImage}
            isModel={this.props.isModel}
            onTitleChange={this.props.onTitleChange}
            titleEditable={this.props.canEditTitle}
            actionButtons={createActionButtons(
              this.props.row,
              this.props.layer?.actions ?? [],
              this.props.registeredCallbacks,
              this.props.onActionClick,
            )}
            canEditAppearance={this.props.canEditAppearance}
            onTabChange={this.props.onTabChange}
            currentTab={this.props.currentTab}
            isCollapsed={this.props.isCollapsed}
          />
        </SubPanel>
      </SubPanelWrapper>
    )
  }
}

export default ObjectEditorItemComponent
