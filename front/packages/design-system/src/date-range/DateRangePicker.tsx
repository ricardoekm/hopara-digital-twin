import React from 'react'
import {i18n} from '@hopara/i18n'
import {Box, Button} from '@mui/material'
import {Select} from '../form'
import {PureComponent} from '../component/PureComponent'
import {DateTimePanelCardField} from './DateTimePanelCardField'

type Props = {
  onChange: (values?: any) => void
  options: any[]
  values?: any[]
  canCustomize?: boolean
  showInitialDate?: boolean
  showFinalDate?: boolean
  hasAutoFill?: boolean
  showClearButton?: boolean
  locale?: string
  disabled?: boolean
}

export function getCurrentLocale() {
  return navigator.language === 'pt-BR' ? 'pt-br' : 'en'
}

export class DateRangePicker extends PureComponent<Props> {
  render(): React.ReactNode {
    const isCustomized = this.props.values && !this.props.options.find((option) => option.value === this.props.values![0])
    return <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5em',
    }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
      >
        {this.props.showClearButton && (
          <Button
            sx={{
              position: 'absolute',
              top: -30,
              right: 0,
              fontSize: 11,
              padding: 5,
            }}
            onClick={() => {
              this.props.onChange()
            }}
          >
            {this.props.hasAutoFill ? i18n('RESTORE_DEFAULT') : i18n('CLEAR_FILTER')}
          </Button>
        )}
        {this.props.canCustomize && 
          <Select
            disabled={this.props.disabled}
            options={[
              ...this.props.options,
              {value: '__CUSTOMIZE__', label: i18n('CUSTOMIZE_ELLIPSIS')},
            ]}
            value={isCustomized ? '__CUSTOMIZE__' : (this.props.values && this.props.values[0] ? this.props.values[0] : undefined)}
            onChange={(event) => {
              if (event.target.value === '__CUSTOMIZE__') {
                this.props.onChange([undefined, undefined])
              } else {
                this.props.onChange([event.target.value])
              }
            }}
          />
        }
      </Box>
      {this.props.showInitialDate && this.props.values &&
        <DateTimePanelCardField
          title={i18n('INITIAL_DATE')}
          date={this.props.values[0]}
          onChange={(date) => {
            if (this.props.showFinalDate) {
              this.props.onChange([date, this.props.values![1]])
            } else {
              this.props.onChange([date])
            }
          }}
          locale={this.props.locale ?? getCurrentLocale()}
        />
      }
      {this.props.showFinalDate && this.props.values &&
        <DateTimePanelCardField
          title={i18n('FINAL_DATE')}
          date={this.props.showInitialDate ? this.props.values[1] : this.props.values[0]}
          onChange={(date) => {
            if (this.props.showInitialDate) {
              this.props.onChange([this.props.values![0], date])
            } else {
              this.props.onChange([date])
            }
          }}
          locale={this.props.locale ?? getCurrentLocale()}
        />
      }
    </Box>
  }
}

