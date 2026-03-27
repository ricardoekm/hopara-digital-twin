import {IconRepository} from './IconRepository'
import {toastError} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import React from 'react'
import {Box} from '@mui/material'
import {useSelector} from 'react-redux'
import {Store} from '../state/Store'
import {debounce} from '@mui/material/utils'
import {AsyncFilterableSelect} from '@hopara/design-system/src/form/AsyncFilterableSelect'
import { isNil } from 'lodash/fp'
import {ResourceIcon} from '@hopara/design-system/src/icons/ResourceIcon'

interface Props {
  value?: string
  onChange: (value?: string) => void
  onPreview?: (value?: string) => void
}

export function IconSelect(props: Props) {
  const [searchValue, setSearchValue] = React.useState('')
  const [options, setOptions] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const authorization = useSelector((state: Store) => state.auth.authorization)

  const fetchIcons = React.useMemo(() =>
      debounce(async (searchValue: string, callback: (results?: readonly string[]) => void) => {
        try {
          const res = await IconRepository.list(searchValue, authorization)
          callback(res.data.map((icon) => icon.name))
        } catch {
          toastError(i18n('AN_ERROR_OCCURRED_WHILE_LOADING_THE_ICON_LIST'))
        }
      }, 500),
    [],
  )

  React.useEffect(() => {
    let active = true

    if (searchValue === props.value || isNil(searchValue)) {
      return
    }
    setLoading(true)
    fetchIcons(searchValue, ((results?: string[]) => {
      if (active) {
        setOptions(results ?? [])
      }
      setLoading(false)
    }) as any)

    return () => {
      active = false
    }
  }, [searchValue, fetchIcons])

  return (
    <AsyncFilterableSelect
      showClearButton="BUTTON"
      clearLabel={i18n('CLEAR_FILTER')}
      noOptionsText={i18n('TYPE_TO_SEARCH_ICONS')}
      placeholder={i18n('TYPE_TO_SEARCH_ICONS')}
      options={options}
      value={props.value}
      loading={loading}
      onChange={(newValue?: string | null) => {
        props.onChange(newValue ?? undefined)
      }}
      onSearch={(newInputValue) => {
        setSearchValue(newInputValue)
      }}
      onClear={() => {
        props.onChange(undefined)
        setSearchValue('')
      }}
      onHighlightChange={(value) => {
        if (props.onPreview) props.onPreview(value)
      }}
      startAdornment={props.value && <ResourceIcon icon={props.value} tenant={authorization.tenant}/>}
      renderOption={(props, option) => {
        return <Box component="li" {...props} key={option} sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '.5em',
        }}>
          <ResourceIcon tenant={authorization.tenant} icon={option}/>
          <Box>{option}</Box>
        </Box>
      }}
    />
  )
}
