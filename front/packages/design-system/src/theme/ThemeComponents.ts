import {Components as MuiComponents} from '@mui/material/styles/components'
import {ThemeSpec} from './ThemeSpec'

export interface Components extends MuiComponents {
  HoparaTable: {
    row: {
      backgroundEven: string
      backgroundHover: string
    }
  }
  HoparaInput: any
  HoparaBranding: {
    logoUrl?: string
    logoSmallUrl?: string
  }
}

export const createComponents = (spec: ThemeSpec): Components => {
  return {
    'HoparaBranding': {
      logoUrl: spec.logoUrl,
      logoSmallUrl: spec.logoSmallUrl,
    },

    'HoparaTable': {
      row: {
        backgroundEven: '#fcfaff',
        backgroundHover: '#faf8fd',
      },
    },

    'HoparaInput': {
      backgroundClip: 'padding-box',
      borderRadius: spec.borderRadius,
      display: 'block',
      color: spec.onBackground,
      backgroundColor: spec.inputBackground,
      fontSize: 13,
      lineHeight: '1.85',
      padding: '.25em .75em',
      transition: 'border-color 0.15s ease-in-out',
      width: '100%',
      boxSizing: 'border-box',
    },

    'MuiFormHelperText': {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            'fontSize': 12,
            'color': spec.error,
            'marginInline': 8,
            '&:before, &:after': {
              border: 'none',
            },
          },
        },
      },
    },

    'MuiInputBase': {
      styleOverrides: {
        root: {
          fontSize: 13,
          borderRadius: 4,
        },
      },
    },

    'MuiButtonBase': {
      defaultProps: {
        disableRipple: true,
      }
    },

    'MuiOutlinedInput': {
      styleOverrides: {
        root: {
          'boxShadow': 'inset 0 1px 4px -1px rgba(0,0,0,0.3)',
          'borderRadius': 4,
          '& .MuiOutlinedInput-notchedOutline': {
            'borderColor': spec.borderColor,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            'borderColor': spec.primary,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: spec.error,
          },
        },
      },
    },

    'MuiFilledInput': {
      styleOverrides: {
        root: {
          'backgroundColor': spec.inputBackground,
          'maxWidth': '100%',
          'borderRadius': spec.borderRadius,
          'border': '1px solid transparent',
          ':hover': {
            'backgroundColor': spec.inputBackgroundHover,
            ':before, :after': {
              borderBottom: 'none',
            },
            ':not(.Mui-disabled)': {
              ':before': {
                borderBottom: 'none',
              },
            },
          },
          ':focus-within': {
            'backgroundColor': spec.inputBackgroundActive,
          },
          ':before': {
            border: 'none',
          },
          ':after': {
            border: 'none',
          },
          '&.Mui-error': {
            border: `1px solid ${spec.error} !important`,
            backgroundColor: 'none',
          },
          '&.Mui-disabled': {
            'backgroundColor': spec.inputBackgroundDisabled,
            '&:before, &:after': {
              border: 'none',
            },
          },
        },
      },
    },

    'MuiTextField': {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
        },
      },
    },

    'MuiInputAdornment': {
      styleOverrides: {
        root: {
          ':not(.MuiInputAdornment-hiddenLabel)': {
            marginTop: '0 !important',
          },
        },
      },
    },

    'MuiListItemButton': {
      styleOverrides: {
        root: {},
      },
    },

    'MuiTooltip': {
      styleOverrides: {
        tooltip: {
          fontSize: 12,
          color: 'inherit',
          backgroundColor: spec.backgroundCanvasButton,
          backdropFilter: spec.backgroundBlur,
          boxShadow: spec.shadowCanvasButton,
          userSelect: 'none',
          cursor: 'default',
        },
        tooltipPlacementRight: {
          marginLeft: '5px !important',
        },
        tooltipPlacementLeft: {
          marginRight: '5px !important',
        },
        tooltipPlacementTop: {
          marginBottom: '8px !important',
        },
        tooltipPlacementBottom: {
          marginTop: '8px !important',
        },
      },
    },

    'MuiChip': {
      styleOverrides: {
        root: {
          'cursor': 'default',
          '& .MuiChip-label': {
            'fontSize': 13,
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',
            'whiteSpace': 'nowrap',
          },
        },
      },
    },
    'MuiAutocomplete': {
      styleOverrides: {
        option: {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        },
      },
    },
    'MuiButton': {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            'borderColor': spec.inputColorDisabled,
          },
        },
      },
    },
  }
}
