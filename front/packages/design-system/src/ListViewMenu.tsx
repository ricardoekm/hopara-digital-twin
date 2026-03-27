import { Component, createRef } from 'react'
import { styled, Box, keyframes } from '@mui/system'
import { ResourceIcon } from './icons/ResourceIcon'
import { Typography } from '@mui/material'
import { Icon } from './icons/Icon'
import { Row } from '@hopara/dataset'
import { Theme } from './theme'

type ListViewProps = {
  rows: Array<Row>
  isVisible: boolean
  onClose: () => void
  selectedLayer: any
}

type ListViewState = {
  expandedRow: string | null
  visibleItems: any[]
  titleItem: any | null
}

const expandIn = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0.9);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
    max-height: 500px;
  }
`

const expandOut = keyframes`
  from {
    opacity: 1;
    transform: scaleY(1);
    max-height: 500px;
  }
  to {
    opacity: 0;
    transform: scaleY(0.9);
    max-height: 0;
  }
`

const staggeredReveal = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`

const flipIn = keyframes`
  from {
    opacity: 0;
    transform: rotateY(90deg);
  }
  to {
    opacity: 1;
    transform: rotateY(0);
  }
`

const ListContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{
  isVisible: boolean
}>(({ theme, isVisible }) => ({
  position: 'fixed',
  top: 5,
  right: 45,
  width: '40vw',
  maxWidth: '40vw',
  height: '98vh',
  maxHeight: '98vh',
  overflowY: 'auto',
  padding: '5px 10px',
  zIndex: 1,
  borderRadius: 10,
  background: theme.palette.background.default,
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  animation: `${flipIn} 0.5s ease-in-out`,
  transformOrigin: 'top',
  opacity: isVisible ? 0.9 : 0,
  pointerEvents: isVisible ? 'auto' : 'none',
  backdropFilter: 'blur(9px)',
}))

const ListItem = styled(Box)(({ theme }) => ({
  'borderBottom': `1px solid ${theme.palette.divider}`,
  'marginBottom': theme.spacing(2),
  'overflow': 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: theme.palette.action.hover,
  },
}))

const TableRow = styled(Box)(({ theme }) => ({
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'padding': theme.spacing(2),
  'backgroundColor': theme.palette.tabColorBackground,
  'cursor': 'pointer',
  'transition': 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[200],
  },
}))

const RowContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}))

const ExpandIcon = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  color: theme.palette.primary.main,
}))

const ResourceIconWrapper = styled(Box)(({ theme }) => ({
  boxShadow: theme.palette.spec.shadowCanvasButton,
  padding: '5px 10px',
  marginBottom: 5,
  marginTop: 5,
  background: theme.palette.mode === 'dark' ? 'black' : 'white',
}))

const ExpandedContent = styled(Box)<{ isExpanded: boolean; totalRows: number }>(
  ({ theme, isExpanded }) => ({
    'padding': theme.spacing(2),
    'backgroundColor': theme.palette.background.paper,
    'overflow': 'hidden',
    'transformOrigin': 'top',
    'animation': `${isExpanded ? expandIn : expandOut} 0.7s ease-in-out forwards`,
    '& > div': {
      animation: `${staggeredReveal} 0.35s ease-in-out forwards`,
      opacity: 0,
      transform: 'translateY(20px)',
    },
  })
)

const KeyValueTable = styled(Box)(({ theme }) => ({
  'width': '100%',
  '& table': {
    width: '100%',
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  '& td': {
    width: '50%',
    padding: theme.spacing(5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: 12,
    fontWeight: 500,
  },
  '& th': {
    padding: theme.spacing(1),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

class ListViewMenu extends Component<
  ListViewProps,
  ListViewState,
  { theme: Theme }
> {
  listRef = createRef<HTMLDivElement>()

  constructor(props: ListViewProps) {
    super(props)
    this.state = {
      expandedRow: null,
      visibleItems: [] as any[],
      titleItem: null,
    }
  }

  componentDidMount() {
    if (this.props.isVisible) {
      document.addEventListener('mousedown', this.handleOutsideClick)
    }
    this.setState(this.getVisibleListItems())
  }

  componentDidUpdate(prevProps: ListViewProps) {
    if (prevProps.isVisible !== this.props.isVisible && this.props.isVisible) {
      document.addEventListener('mousedown', this.handleOutsideClick)
    } else if (!this.props.isVisible) {
      document.removeEventListener('mousedown', this.handleOutsideClick)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick)
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (
      this.listRef.current &&
      !this.listRef.current.contains(event.target as Node)
    ) {
      this.props.onClose()
    }
  }

  handleRowClick = (id: string) => {
    this.setState((prevState) => ({
      expandedRow: prevState.expandedRow === id ? null : id,
    }))
  }

  getVisibleListItems() {
    const visibleItems = this.props?.selectedLayer?.details.fields.filter((f) => !!f.visible)
    const titleItem = visibleItems.find((item) => item.value.encoding.text)!
    this.setState({ visibleItems, titleItem })
    return {
      visibleItems,
      titleItem,
    }
  }

  render() {
    const { rows, isVisible } = this.props
    const { expandedRow, visibleItems, titleItem } = this.state

    return (
      <ListContainer ref={this.listRef} isVisible={isVisible}>
        {rows?.map((row, index) => (
          <ListItem key={row._id} style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Row Content */}
            <TableRow onClick={() => this.handleRowClick(row._id!)}>
              <RowContent>
                <ResourceIconWrapper>
                  <ResourceIcon
                    tenant="default"
                    icon={row.category_name || row.type}
                    fallback="default-icon"
                    size={20}
                  />
                </ResourceIconWrapper>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  style={{ paddingLeft: 20 }}
                >
                  {row[titleItem?.getField() ?? '']}
                </Typography>
              </RowContent>
              <ExpandIcon>
                {expandedRow === row._id ? (
                  <Icon icon="expand-less" />
                ) : (
                  <Icon icon="expand-more" />
                )}
              </ExpandIcon>
            </TableRow>

            {/* Expanded Row */}
            {expandedRow === row._id && (
              <ExpandedContent
                isExpanded={expandedRow === row._id}
                totalRows={Object.entries(row).length}
              >
                {Object.entries(row)
                  .filter(([key]) =>
                    visibleItems?.some(
                      (item) => item?.value?.encoding?.text!.field === key
                    )
                  )
                  .map(([key, value], index) => {
                    const matchingItem = visibleItems.find(
                      (item) => item.getField() === key
                    )
                    return (
                      <div
                        key={key}
                        style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                      >
                        <KeyValueTable>
                          <table>
                            <tbody>
                              <tr key={key}>
                                <td
                                  style={{
                                    textTransform: 'capitalize',
                                    opacity: 0.66,
                                  }}
                                >
                                  {matchingItem?.title || key}
                                </td>
                                <td>
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : value}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </KeyValueTable>
                      </div>
                    )
                  })}
              </ExpandedContent>
            )}
          </ListItem>
        ))}
      </ListContainer>
    )
  }
}

export default ListViewMenu
