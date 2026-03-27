import React, {PureComponent} from 'react'
import Button from '@mui/material/Button'
import {styled} from '../theme'

interface Props {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
    'data-testid'?: string;
    pillVariant?: 'default' | 'primary' | 'warning';
    smallButton?: boolean;
}

const PanelPillButtonStyle = styled(Button, {name: 'PanelPillButton'})(({theme}) => ({
    'minWidth': 'auto',
    'width': 'max-content',
    'padding': '6px 16px',
    'margin': 0,
    'borderRadius': '100px !important',
    'transition': 'none',
    'textTransform': 'none',
    'fontSize': 15,
    'fontWeight': 500,
    'lineHeight': 'revert',
    '&.smallButton': {
        'padding': '2px 10px',
        'fontSize': 12,
        'lineHeight': 1.9,
    },

    '&.default': {
        'color': theme.palette.text.primary,
        'backgroundImage': theme.palette.spec.backgroundPanelPillButton,
        'boxShadow': theme.palette.spec.shadowPanelPillButton,
        '&:hover': {
            backgroundImage: theme.palette.spec.backgroundPanelPillButtonHover,
        },
    },

    '&.primary': {
        'color': theme.palette.primary.main,
        'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
        'boxShadow': theme.palette.spec.shadowPanelPillButton,
        'fontWeight': 600,
        '&:hover': {
            backgroundImage: theme.palette.spec.backgroundPanelPillButtonPrimaryHover,
        },
    },

    '&.warning': {
        'color': theme.palette.spec.error,
        'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
        'boxShadow': theme.palette.spec.shadowPanelPillButton,
        'fontWeight': 600,
        '&:hover': {
            backgroundImage: theme.palette.spec.backgroundPanelPillButtonPrimaryHover,
        },
    },

    '&[disabled]': {
        'color': theme.palette.text.disabled,
        'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
        'boxShadow': theme.palette.spec.shadowPanelPillButton,
        'opacity': 0.75,
        'pointerEvents': 'none',
    },
}))

export class PillButton extends PureComponent<Props> {
    render() {
        const {
            children,
            onClick,
            disabled,
            'data-testid': testId,
            pillVariant = 'default',
            smallButton = false
        } = this.props

        return (
            <PanelPillButtonStyle
                disableRipple
                onClick={onClick}
                disabled={disabled}
                data-testid={testId}
                className={`${pillVariant} ${smallButton ? 'smallButton' : ''}`}
            >
                {children}
            </PanelPillButtonStyle>
        )
    }
}
