import { styled } from './theme'

export const SidebarLayout = styled('div', {name: 'SidebarLayout'})(({theme}) => {
  return (`
  height: 100vh;
  height: 100dvh;
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-areas: "sidebar container";

  ${theme.breakpoints.down('sm')} {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(40px, min-content);
    grid-template-areas: "sidebar" "container";
  }
`)
})
