import React from 'react'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {Details} from '@hopara/design-system/src/details/Details'
import {ImageWrapper} from '@hopara/design-system/src/image/ImageWrapper'
import {MAIN_VIEW_ELM_ID} from '../../view/View'
import {DetailsLine} from '../DetailsLine'
import { Row } from '@hopara/dataset'
import { Layer } from '../../layer/Layer'
import {LayerType} from '../../layer/LayerType'
import { CallbackFunction } from '../../action/ActionReducer'
import { Rowset } from '../../rowset/Rowset'
import { PureComponent } from '@hopara/design-system'
import { Authorization } from '@hopara/authorization'
import { ObjectIcon } from '../../object/ObjectIcon'
import {createActionButtons} from '../../action/ActionLineFactory'
import {Config} from '@hopara/config'
import {PanelTitleBarWithCloseOnly} from '@hopara/design-system/src/panel/PanelTitleBarWithCloseOnly'

export type StateProps = {
  rowId?: string,
  lines: DetailsLine[],
  row: Row
  layer: Layer
  registeredCallbacks: CallbackFunction[]
  rowset: Rowset
  tenant: string
  imageUrl?: string
  authorization: Authorization
  lastImageVersionDate?: Date,
  pdfs: { name: string, url: string }[]
}

export type ActionProps = {
  onCloseButtonClick: () => void,
  onActionClick: (action) => void
}

export type Props = StateProps & ActionProps

export const isImagePreview = (layer: Layer, detailsLines?: DetailsLine[]): boolean => {
  return layer.isType(LayerType.image) || layer.isType(LayerType.model) || !!detailsLines?.some((line) => !!line.image)
}

export class DetailsComponent extends PureComponent<Props> {
  imageWrapperRef: React.RefObject<HTMLDivElement> = React.createRef()

  render() {
    return (
      <Panel
        header={
          <PanelTitleBarWithCloseOnly
            onCloseClick={this.props.onCloseButtonClick}
          />
        }
      >
        <Details
          containerId={MAIN_VIEW_ELM_ID}
          isThumbImage={isImagePreview(this.props.layer, this.props.lines)}
          pdfs={this.props.pdfs}
          thumb={
            <ImageWrapper fullWidth={!isImagePreview(this.props.layer, this.props.lines)} ref={this.imageWrapperRef}>
              <ObjectIcon
                key={this.props.row._id}
                layer={this.props.layer}
                row={this.props.row}
                authorization={this.props.authorization}
                detailsLines={this.props.lines}
                size={Config.getValueAsBoolean('IS_SMALL_WIDTH_SCREEN') ? 24 : 36}
                maxSize='40vh'
                smMaxSize='54px'
                placeHolderSize={300}
                parentRef={this.imageWrapperRef}
                lastImageVersionDate={this.props.lastImageVersionDate}
              />
            </ImageWrapper>
          }
          title={this.props.lines[0]?.value}
          actionButtons={createActionButtons(
            this.props.row,
            this.props.layer?.actions ?? [],
            this.props.registeredCallbacks,
            this.props.onActionClick,
          )}
          lines={this.props.lines}
        />
      </Panel>
    )
  }
}
