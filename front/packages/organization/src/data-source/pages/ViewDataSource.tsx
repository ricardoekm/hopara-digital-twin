import React, {useContext, useEffect} from 'react'
import {DataSourceContext} from '../service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {useMatch} from 'react-router-dom'
import {PageType} from '@hopara/page/src/Pages'
import {usePageNavigation, useQuery} from '@hopara/page/src/PageNavigation'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {i18n} from '@hopara/i18n'
import {Sidebar} from '../../sidebar/Sidebar'
import Helmet from 'react-helmet'
import {SidebarLayout} from '@hopara/design-system/src/SidebarLayout'
import {TitleBar} from '@hopara/design-system/src/title-bar/TitleBar'
import {styled} from '@hopara/design-system/src/theme'
import {Box, Button} from '@mui/material'
import {DataSource, DataSourceType} from '../DataSource'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {ListFiles} from './ListFiles'
import {ListQueries} from './ListQueries'
import {Tabs} from '@hopara/design-system/src/tabs/Tabs'
import {Tab} from '@hopara/design-system/src/tabs/Tab'

const Main = styled('div', {name: 'Main'})({
  gridArea: 'container',
})

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props

  return (
    <Box
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </Box>
  )
}

const ViewDataSource = () => {
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)

  const [dataSource, setDataSource] = React.useState<DataSource | undefined>(
    undefined,
  )
  const [dataSourceError, setDataSourceError] = React.useState<string>('')

  const urlParams = useMatch({path: '/:tenant/data-source/:name/*'})
  const qs = useQuery()
  const qsTab = qs.get('tab')

  const requestName = urlParams?.params.name ? decodeURIComponent(urlParams.params.name as string) : undefined

  if (!requestName) {
    pageNavigation.navigate(PageType.ListDataSources, {
      tenant: authContext.authorization.tenant,
    })
    return <></>
  }
  const [selectedTab, setSelectedTab] = React.useState(qsTab ?? 'queries')
  const queryContent = <ListQueries dataSourceName={requestName}/>

  const tabComponents: Record<string, any> = {}

  useEffect(() => {
    if (dataSource?.getType() === DataSourceType.DUCKDB && !qsTab) {
      setSelectedTab('files')
    } else if (dataSource?.getType() === DataSourceType.JS_FUNCTION && !qsTab) {
      setSelectedTab('functions')
    }
  }, [qsTab, dataSource])

  if (dataSource?.getType() === DataSourceType.DUCKDB) {
    tabComponents['files'] = {
      id: 'files',
      label: i18n('DATA_FILES'),
      icon: <Icon icon="document"/>,
      content: <ListFiles dataSource={dataSource} dataSourceName={requestName}/>,
      createText: i18n('NEW_DATA_FILE'),
      onCreateClick: () => {
        pageNavigation.navigate(PageType.CreateDataFile, {
          dataSourceName: requestName,
        })
      },
    }
  }

  if (dataSource?.getType() === DataSourceType.JS_FUNCTION) {
    tabComponents['functions'] = {
      id: 'functions',
      label: i18n('FUNCTIONS'),
      icon: <Icon icon="code-block"/>,
      content: <ListFiles dataSource={dataSource} dataSourceName={requestName}/>,
      createText: i18n('ADD_FUNCTION'),
      onCreateClick: () => {
        pageNavigation.navigate(PageType.CreateFunction, {
          dataSourceName: requestName,
        })
      },
    }
  }

  if (dataSource && dataSource.getType() !== DataSourceType.JS_FUNCTION) {
    tabComponents['queries'] = {
      id: 'queries',
      label: i18n('QUERIES'),
      icon: <Icon icon="query"/>,
      content: queryContent,
      createText: i18n('NEW_QUERY'),
      onCreateClick: () => {
        pageNavigation.navigate(PageType.CreateQuery, {
          dataSourceName: requestName,
        })
      },
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const ds = await dataSourceContext.dataSourceService.get(requestName, await authContext.getRefreshedAuthorization())
        const dataSource = new DataSource(ds)
        setDataSource(dataSource)
      } catch (err: any) {
        if (err.status === 404) {
          pageNavigation.navigate(PageType.NotFound)
        }
        setDataSourceError(err.message)
      }
    })()
  }, [requestName])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(Object.keys(tabComponents)[newValue])
  }

  const selectedTabIndex = Object.keys(tabComponents).indexOf(selectedTab)

  return (
    <SidebarLayout>
      <Helmet>
        <title>{pageNavigation.getTitle(PageType.ListDataSources)}</title>
      </Helmet>
      <Sidebar/>
      <Main>
        <TitleBar
          title={requestName}
          titleTestId="data-source-title"
          onBack={() =>
            pageNavigation.navigate(PageType.ListDataSources, {
              tenant: authContext.authorization.tenant,
            })
          }
        />
        <ErrorPanel error={dataSourceError}/>

        <Box sx={{
          margin: '0 2em 0 2em',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
        }}>
          {Object.values(tabComponents).length &&
            <Tabs value={selectedTabIndex} onChange={handleChange}>
              {Object.values(tabComponents).map((tab) => (<Tab key={tab.id} label={tab.label} icon={tab.icon}/>))}
            </Tabs>
          }
          {tabComponents[selectedTab] && (
            <Button
              variant="contained"
              onClick={tabComponents[selectedTab].onCreateClick}
              data-testid={tabComponents[selectedTab].createText + '-button'}
            >
              <Icon icon="add"/>
              {tabComponents[selectedTab]?.createText}
            </Button>
          )}
        </Box>
        {Object.values(tabComponents).map((tab, index) => (
          <TabPanel key={tab.id} value={selectedTabIndex} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Main>
    </SidebarLayout>
  )
}

export default ViewDataSource
