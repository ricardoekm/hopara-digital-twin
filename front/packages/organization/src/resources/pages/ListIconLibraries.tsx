import React, {useContext, useEffect} from 'react'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {i18n} from '@hopara/i18n'
import {Sidebar} from '../../sidebar/Sidebar'
import Helmet from 'react-helmet'
import {SidebarLayout} from '@hopara/design-system/src/SidebarLayout'
import {CardListItem} from '@hopara/design-system/src/card-list/CardListItem'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {IconLibrary} from '../domain/Icon'
import {ResourceContext} from '../service/ResourceContext'
import {Title} from '@hopara/design-system/src/Title'
import {HelperButton} from '@hopara/design-system/src/HelperButton'
import {ListCardsLayout} from '@hopara/design-system/src/ListCardsLayout'
import {CardListSkeleton} from '@hopara/design-system/src/card-list/CardListSkeleton'
import {CardList} from '@hopara/design-system/src/card-list/CardList'
import { Image } from '@hopara/design-system/src/image/Image'
import {BrowserContext} from '@hopara/browser'
import {BrowserWarningComponent} from '@hopara/design-system/src/warning/BrowserWarningComponent'
import { Logger } from '@hopara/internals'

const ListIconLibraries = () => {
  const resourceContext = useContext(ResourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const [loading, setLoading] = React.useState(true)
  const [libraries, setLibraries] = React.useState<IconLibrary[]>([])
  const [error, setError] = React.useState<string>('')
  const browserContext = useContext(BrowserContext)

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const libraries = await resourceContext.iconService.listLibraries(authContext.authorization)
        setLibraries(libraries)
      } catch (err: any) {
        Logger.error(err)
        setError(err.message)
      }
      setLoading(false)
    })()
  }, [resourceContext, authContext])

  const createMosaic = (library: IconLibrary) => {
    const icons = library.icons ?? []

    if (icons.length === 0) {
      return <div>{i18n('ADD_YOUR_ICONS_HERE')}</div>
    }

    return <div style={{padding: 10}}>
      {icons.map((icon, index) => {
          return <Image
            key={index}
            src={resourceContext.iconService.getIconUrl(library.name, icon.name, authContext.authorization)}
            sx={{
              width: 32,
              height: 32,
              opacity: 0.8,
              filter: 'brightness(0)',
          }}
          />
        },
      )}
    </div>
  }

  return (
    <SidebarLayout>
      <Helmet>
        <title>{pageNavigation.getTitle(PageType.ListIconLibraries)}</title>
      </Helmet>
      <Sidebar/>
      <ListCardsLayout>
        <BrowserWarningComponent
        inline
        isBrowserSupported={browserContext.platform.isSupported}
        isWebGLSupported={!!browserContext.webgl?.isSupported}
        isWebGLEnabled={!!browserContext.webgl?.isEnabled} />
        <Title sx={{'margin': '1.5em 0 0 0'}}>{i18n('ICON_LIBRARIES')}
          <HelperButton
            description={i18n('ICON_LIBRARIES_DESCRIPTION')}
            placement="right"/>
        </Title>
        {loading && <CardListSkeleton count={4}/>}
        {(!loading && !error) && (
          <CardList data-testid="librariesList">
            {libraries.map((library) => (
              <CardListItem
                key={library.name}
                name={library.name}
                backgroundImage={''}
                icon={createMosaic(library)}
                chip={library.editable ? '' : i18n('READ_ONLY')}
                href={pageNavigation.getUrl(PageType.ListIcons, {name: library.name})}
              />
            ))}
          </CardList>
        )}
        <ErrorPanel error={error}/>
      </ListCardsLayout>
    </SidebarLayout>
  )
}

export default ListIconLibraries
