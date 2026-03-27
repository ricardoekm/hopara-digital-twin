/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useContext, useEffect} from 'react'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {useMatch} from 'react-router-dom'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {i18n} from '@hopara/i18n'
import {Sidebar} from '../../sidebar/Sidebar'
import Helmet from 'react-helmet'
import {SidebarLayout} from '@hopara/design-system/src/SidebarLayout'
import {BarButton, TitleBar} from '@hopara/design-system/src/title-bar/TitleBar'
import {styled, useTheme} from '@hopara/design-system/src/theme'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {Icon, IconLibrary} from '../domain/Icon'
import {ResourceContext} from '../service/ResourceContext'
import {CardListTemplateSkeleton} from '@hopara/design-system/src/card-list/CardListSkeleton'
import {Box, Chip} from '@mui/material'
import {debounce} from 'lodash/fp'
import {MessagePanel} from '@hopara/design-system/src/MessagePanel'
import {ListIconsComponent} from '../ListIconsComponent'
import {Icon as HoparaIcon} from '@hopara/design-system/src/icons/Icon'


const Main = styled('div', {name: 'Main'})({
  gridArea: 'container',
  gridTemplateRows: 'auto 40vh 40vh',
  gap: '1em',
  overflow: 'hidden',
})

const INITIAL_PAGE_SIZE = 100

const ListIcons = () => {
  const theme = useTheme()
  const resourceContext = useContext(ResourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const [loading, setLoading] = React.useState(true)
  const [loadingIcons, setLoadingIcons] = React.useState(false)
  const [icons, setIcons] = React.useState<Icon[]>([])
  const [iconLibrary, setIconLibrary] = React.useState<IconLibrary>()
  const [resourcesError, setResourcesError] = React.useState<string>('')
  const [hasMore, setHasMore] = React.useState(true)
  const [pageToken, setPageToken] = React.useState<string>()
  const [search, setSearch] = React.useState('')

  const urlParams = useMatch({path: '/:tenant/icon-library/:name/*'})

  const libraryName = urlParams?.params.name as string

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [listResponse, iconLibrary] = await Promise.all([
          resourceContext.iconService.listLibraryIcons(libraryName, authContext.authorization, INITIAL_PAGE_SIZE, undefined),
          resourceContext.iconService.getLibrary(libraryName, authContext.authorization),
        ])
        setIcons(listResponse.icons)
        setPageToken(listResponse.nextPageToken)
        setIconLibrary(iconLibrary)

        if (listResponse.icons.length < INITIAL_PAGE_SIZE) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }

        setLoading(false)
      } catch (err: any) {
        if (err.status === 404) {
          pageNavigation.navigate(PageType.NotFound)
        } else {
          setResourcesError(err.message)
        }
      }
    })()
  }, [libraryName, resourceContext, authContext])

  const fetchMoreData = async (pageSize: number) => {
    try {
      setLoadingIcons(true)
      const moreIcons = await resourceContext.iconService.listLibraryIcons(libraryName, authContext.authorization, pageSize, pageToken, search)
      if (moreIcons.icons.length < pageSize) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setIcons(icons.concat(moreIcons.icons))
      setPageToken(moreIcons.nextPageToken)
      setLoadingIcons(false)
    } catch (err: any) {
      setResourcesError(err.message)
      setLoadingIcons(false)
    }
  }

  const deleteClicked = (icon: Icon) => {
    setIcons(icons.filter((i) => i.name !== icon.name))
  }

  if (!libraryName) {
    pageNavigation.navigate(PageType.ListIconLibraries, {tenant: authContext.authorization.tenant})
    return <></>
  }

  let titleButtons: BarButton[] = []

  if (iconLibrary?.editable && authContext.authorization.canEditResources()) {
    titleButtons = [{
      testId: 'createResourceButton',
      label: i18n('CREATE_ICON'),
      onClick: () => pageNavigation.navigate(PageType.CreateIcon, {
        tenant: authContext.authorization.tenant,
        name: libraryName,
      }),
      primary: true,
      responsiveIcon: <HoparaIcon icon="add"/>,
    }]
  }

  const fetchWithSearch = async (search) => {
    setLoading(true)
    try {
      const response = await resourceContext
        .iconService
        .listLibraryIcons(libraryName, authContext.authorization, INITIAL_PAGE_SIZE, undefined, search)
      if (response.icons.length < INITIAL_PAGE_SIZE) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setIcons(response.icons)
      setPageToken(response.nextPageToken)
      setLoading(false)
    } catch (err: any) {
      setResourcesError(err.message)
    }
  }

  const searchChanged = (newSearch: string) => {
    if (searchChangeDebounced.cancel) searchChangeDebounced.cancel();
    (async () => {
      setSearch(newSearch)
      await fetchWithSearch(newSearch)
    })()
  }

  const searchChangeDebounced = debounce(500, searchChanged)

  const handleSearchChange = (search) => {
    searchChangeDebounced(search)
  }

  const isSearchNotFound = !loading && search && icons.length === 0
  const isEmptyEditableList = icons.length === 0 && !loading && !search && iconLibrary?.editable
  const isLoadedListWithItems = !loading && icons.length > 0

  return (
    <SidebarLayout>
      <Helmet>
        <title>
          {pageNavigation.getTitle(PageType.ListIcons)}
        </title>
      </Helmet>
      <Sidebar/>
      <Main>
        <TitleBar
          title={<>
            <span style={{textTransform: 'capitalize', verticalAlign: 'baseline'}}>{libraryName}</span>
            {(iconLibrary && !iconLibrary.editable) ?
              <Chip
                size="small"
                label={i18n('READ_ONLY')}
                sx={{
                  textTransform: 'uppercase',
                  backdropFilter: theme.palette.spec.backgroundBlur,
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: 0.6,
                  height: 20,
                }}
              /> : ''}
          </>}
          titleTestId="resource-title"
          onBack={() => pageNavigation.navigate(PageType.ListIconLibraries, {tenant: authContext.authorization.tenant})}
          buttons={titleButtons}
          hasSearch
          onSearchChange={handleSearchChange}/>


        {loading &&
          <CardListTemplateSkeleton
            count={8}
            size="small"
            style={{width: 120, height: 150}}
          />
        }

        {isSearchNotFound &&
          <Box sx={{padding: '2em', placeContent: 'center', display: 'flex'}}>
            <MessagePanel>
              {i18n('THERE_ARE_NO_ICONS_MATCHING_YOUR_SEARCH', {query: search})}.
            </MessagePanel>
          </Box>
        }


        {isEmptyEditableList &&
          <Box sx={{padding: '2em', placeContent: 'center', display: 'flex'}}>
            <MessagePanel>
              {i18n('ADD_YOUR_ICONS_HERE')}.
            </MessagePanel>
          </Box>
        }

        {isLoadedListWithItems &&
          <ListIconsComponent
            libraryName={libraryName}
            icons={icons}
            hasMore={hasMore}
            loading={loadingIcons}
            editable={!!iconLibrary?.editable && authContext.authorization.canEditResources()}
            fetchMoreData={fetchMoreData}
            editUrl={(icon: Icon) => {
              if (iconLibrary?.editable) {
                return pageNavigation.getUrl(PageType.EditIcon, {
                  name: libraryName,
                  icon: icon.name,
                })
              }
              return undefined
            }}
            onDeleted={deleteClicked}
          />
        }

        <ErrorPanel
          testId="resourcesError"
          error={resourcesError}
        />
      </Main>
    </SidebarLayout>
  )
}

export default ListIcons
