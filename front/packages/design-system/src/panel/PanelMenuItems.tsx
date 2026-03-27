import React from 'react'
import {styled} from '../theme'
import {Box, lighten} from '@mui/material'
import {PureComponent} from '../component/PureComponent'
import {Tooltip} from '../tooltip/Tooltip'
import {Icon} from '../icons/Icon'
import {PanelMenuScrollButton} from './PanelMenuScrollButton'

export interface MenuOption {
  id: string
  name?: string
  icon: React.ReactNode
  onClick?: (item: MenuOption) => void
  selected?: boolean
  disabled?: boolean
  badgeIcon?: React.ReactNode
  divider?: boolean
  tooltip?: string
}

interface Props {
  items?: MenuOption[]
  onItemClick?: (item: MenuOption) => void
}

const itemWidth = 70
const gap = 4
const maxItemsWithNoScroll = 5

export const PanelMenuItemsStyle = styled(Box, {name: 'PanelMenuItems'})<{
  _items?: MenuOption[]
}>(({_items = []}) => ({
  'display': 'grid',
  'gridAutoColumns': _items?.length > maxItemsWithNoScroll ? `${itemWidth}px` : 'minmax(auto, 1fr)',
  'gridAutoFlow': 'column',
  gap,
  'overflowX': 'auto',
  'position': 'relative',
  '&::-webkit-scrollbar': {
    'display': 'none',
  },
  'msOverflowStyle': 'none',
  'scrollbarWidth': 'none',
  'gridColumn': '1 / -1',
  'gridRow': '1 / -1',
}))

interface ItemProps {
  _selected: boolean
  _disabled?: boolean
}

export const ItemStyle = styled(Box, {name: 'Item'})<ItemProps>((props) => {
  const hover = props._disabled ? {} : (props._selected ? {} : {
    backgroundColor: props.theme.palette.spec.tabColorBackground,
    color: props.theme.palette.spec.tabColorForeground,
  })
  const active = props._disabled ? {} : ({
    backgroundColor: lighten(props.theme.palette.spec.tabColorBackground, 0.25),
    color: lighten(props.theme.palette.spec.tabColorForeground, 0.15),
  })

  return {
    'background': props._selected ? props.theme.palette.spec.tabColorBackground : 'transparent',
    'borderRadius': '3px',
    'color': props._selected ? props.theme.palette.spec.tabColorForeground : 'inherit',
    'cursor': props._disabled ? 'default' : 'pointer',
    'display': 'grid',
    'gap': 7,
    'gridTemplateRows': '24px auto',
    'opacity': props._disabled ? 0.4 : 1,
    'paddingBlock': 6,
    'placeItems': 'center',
    'transition': 'color 60ms ease-out, background-color 60ms ease-out',
    '&:hover': hover,
    '&:active': active,
    'height': '100%',
    'alignItems': 'start',
  }
})

export const IconStyle = styled(Box, {name: 'Icon'})({
  height: 24,
  position: 'relative',
  width: 24,
})

export const TextStyle = styled(Box, {name: 'Text'})({
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: 0.66,
  lineHeight: 'inherit',
  overflow: 'hidden',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  textTransform: 'uppercase',
  width: '100%',
  paddingInline: 4,
  whiteSpace: 'wrap',
})

const DividerBox = styled(Box, {name: 'menuDividerBox'})(({theme}) => ({
  alignItems: 'center',
  display: 'grid',
  gridAutoFlow: 'row',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    gridAutoFlow: 'column',
  },
}))

const Divider = styled(Box, {name: 'menuDivider'})(({theme}) => ({
  backgroundColor: theme.palette.spec.borderColor,
  height: 1,
  margin: '5px auto',
  width: '75%',
  [theme.breakpoints.down('sm')]: {
    height: '75%',
    margin: 'auto 5px',
    width: 1,
  },
}))

const BadgeStyle = styled(Box, {name: 'Badge'})(({theme}) => ({
  backdropFilter: theme.palette.spec.backgroundBlur,
  backgroundColor: 'rgba(255,255,255,0.75)',
  borderRadius: '50%',
  color: theme.palette.spec.accentTabColorBackground,
  display: 'grid',
  fontSize: 13,
  height: 21,
  padding: 2,
  placeContent: 'center',
  position: 'absolute',
  right: 4,
  top: 4,
  width: 21,
  [theme.breakpoints.down('sm')]: {
    top: 21,
  },
}))

interface State {
  leftDisabled: boolean
  rightDisabled: boolean
}

export class PanelMenuItems extends PureComponent <Props, State> {
  private readonly menuRef: React.RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.menuRef = React.createRef()
    this.state = {
      leftDisabled: true,
      rightDisabled: false,
    }
  }

  onScroll() {
    if (this.menuRef.current) {
      if (this.menuRef.current.scrollLeft === 0) {
        this.setState({
          leftDisabled: true,
        })
      } else {
        this.setState({
          leftDisabled: false,
        })
      }

      if (this.menuRef.current.scrollLeft === this.menuRef.current.scrollWidth - this.menuRef.current.clientWidth) {
        this.setState({
          rightDisabled: true,
        })
      } else {
        this.setState({
          rightDisabled: false,
        })
      }
    }
  }

  onWheel(e: React.WheelEvent) {
    e.preventDefault()
    if (this.menuRef.current) {
      if (e.deltaX !== 0) {
        this.menuRef.current.scrollLeft += e.deltaX
        return
      }
      this.menuRef.current.scrollLeft += e.deltaY
    }
  }

  componentDidMount() {
    if (this.menuRef.current) {
      this.menuRef.current.addEventListener('scroll', this.onScroll.bind(this))
      this.menuRef.current.addEventListener('wheel', this.onWheel.bind(this) as any)
    }
  }

  componentWillUnmount() {
    if (this.menuRef.current) {
      this.menuRef.current.removeEventListener('scroll', this.onScroll.bind(this))
      this.menuRef.current.removeEventListener('wheel', this.onWheel.bind(this) as any)
    }
  }

  scrollRight() {
    if (this.menuRef.current) {
      this.menuRef.current.scrollLeft += itemWidth + (gap / 2)
    }
  }

  scrollLeft() {
    if (this.menuRef.current) {
      this.menuRef.current.scrollLeft -= (itemWidth + (gap / 2))
    }
  }


  render() {
    const showScroll = (this.props.items?.length ?? 0) > maxItemsWithNoScroll
    return (
      <Box sx={{
        display: 'grid',
        gridTemplateAreas: '"left buttons right"',
        gridTemplateColumns: '24px 1fr 24px',
        gridTemplateRows: '1fr',
        width: '100%',
        userSelect: 'none',
      }}>
        {showScroll && !this.state.leftDisabled && (
          <PanelMenuScrollButton
            area="left"
            onClick={() => this.scrollLeft()}
          >
            <Icon icon="panel-menu-chevron-left" />
          </PanelMenuScrollButton>
        )}

        <PanelMenuItemsStyle ref={this.menuRef} _items={this.props.items}>
          {this.props.items?.map((item, index) => {
            return (
              <DividerBox key={index}>
                {item.divider && <Divider key={`divider-${index}`}/>}
                <Tooltip title={item.tooltip} placement="right">
                  <ItemStyle
                    data-testid={`toolbar-menu-item-${item.id.toLowerCase()}`}
                    key={`item-${index}`}
                    _selected={!!item.selected}
                    _disabled={item.disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.disabled) return
                      if (item.onClick) {
                        item.onClick(item)
                      } else if (this.props.onItemClick) {
                        this.props.onItemClick(item)
                      }
                    }}
                  >
                    <IconStyle>{item.icon}</IconStyle>
                    <TextStyle>{item.name}</TextStyle>
                  </ItemStyle>
                </Tooltip>
                {item.badgeIcon && <BadgeStyle>{item.badgeIcon}</BadgeStyle>}
              </DividerBox>
            )
          })}
        </PanelMenuItemsStyle>

        {showScroll && !this.state.rightDisabled && (
          <PanelMenuScrollButton
            area="right"
            disabled={this.state.rightDisabled}
            onClick={() => this.scrollRight()}
          >
            <Icon icon="panel-menu-chevron-right" />
          </PanelMenuScrollButton>
        )}
      </Box>
    )
  }
}
