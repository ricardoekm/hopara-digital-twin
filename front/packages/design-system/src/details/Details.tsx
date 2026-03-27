import React from 'react'
import { PureComponent } from '../component/PureComponent'
import { DetailsLine, DetailsTable } from './DetailsTable'
import { DetailsTitle } from './DetailsTitle'
import { DetailsIcon } from './DetailsIcon'
import { DetailsStyle, DetailsHeaderStyle, ActionsBox } from './DetailsStyle'
import { DetailsImage } from './DetailsImage'
import { PillButton } from '../buttons/PillButton'
import { DetailsPDFs } from './DetailsPDFs'

export type DetailsAction = {
  title: string;
  enabled: boolean;
  onClick: () => void;
}

interface Props {
  thumb: JSX.Element;
  isThumbImage: boolean;
  title?: string;
  actionButtons?: DetailsAction[];
  lines: DetailsLine[];
  containerId: string;
  pdfs: { name: string, url: string }[];
}

export class Details extends PureComponent<Props> {
  render() {
    return (
      <DetailsStyle
        className="isTitleBarFloating"
      >
        <DetailsHeaderStyle className={this.props.isThumbImage ? 'isThumbImage' : ''}>
          {!this.props.isThumbImage && <DetailsIcon icon={this.props.thumb} />}
          {this.props.isThumbImage && <DetailsImage image={this.props.thumb} />}
          <DetailsTitle
            title={this.props.title}
            _isThumbImage={this.props.isThumbImage}
          />
        </DetailsHeaderStyle>

        {!!this.props.actionButtons?.length &&
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
        }

        <DetailsPDFs pdfs={this.props.pdfs} />
        <DetailsTable lines={this.props.lines} />
      </DetailsStyle>
    )
  }
}
