import { styled } from '../theme'

export const CardList = styled('ul', { name: 'CardList' })(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 220px)',
  gap: '1.75em',
  listStyle: 'none',
  padding: 0,

  [theme.breakpoints.down('sm')]: {
    gap: '1.5em',
    margin: '0 auto',
  },
}))

export const CardListTemplate = styled('ul', { name: 'CardListTemplate' })(
  ({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 140px)',
    gap: '1.25em',
    listStyle: 'none',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
    },
  }),
)
