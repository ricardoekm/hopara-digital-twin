import {styled} from '../theme'
import {Box} from '@mui/material'

export const ListStyle = styled(Box, {name: 'List'})((props) => ({
    'marginBlockStart': 0,
    'border': 'none',
    'borderBlockStart': `1px solid ${props.theme.palette.spec.borderColor}`,
    'borderRadius': 0,
    '&.sublist': {
        'marginBlockStart': 12,
        'border': `1px solid ${props.theme.palette.spec.borderColor}`,
        'borderRadius': 6,
        'overflow': 'hidden',
    },
}))
