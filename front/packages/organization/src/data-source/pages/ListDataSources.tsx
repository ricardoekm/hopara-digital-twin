import React, { useContext, useEffect } from 'react'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { DataSourceContext } from '../service/DataSourceContext'
import { BrowserContext } from '@hopara/browser'
import { ErrorPanel } from '@hopara/design-system/src/error/ErrorPanel'
import { Title } from '@hopara/design-system/src/Title'
import { ListCardsLayout } from '@hopara/design-system/src/ListCardsLayout'
import { SidebarLayout } from '@hopara/design-system/src/SidebarLayout'
import { CardListItem } from '@hopara/design-system/src/card-list/CardListItem'
import { HelperButton } from '@hopara/design-system/src/HelperButton'
import { CardListSkeleton } from '@hopara/design-system/src/card-list/CardListSkeleton'
import { Image } from '@hopara/design-system/src/image/Image'
import { CardList, CardListTemplate } from '@hopara/design-system/src/card-list/CardList'
import { BrowserWarningComponent } from '@hopara/design-system/src/warning/BrowserWarningComponent'
import { SpotlightContainer } from '@hopara/design-system/src/spotlight'

import MySQLImage from '../images/mysql.png'
import PostgresImage from '../images/postgres.png'
import SinglestoreImage from '../images/singlestore.png'
import TimescaleImage from '../images/timescale.png'
import DuckDbImage from '../images/duckdb.png'
import SnowflakeImage from '../images/snowflake.png'
import JSImage from '../images/js.png'

import { Helmet } from 'react-helmet'
import { Box } from '@mui/material'
import { useTheme } from '@hopara/design-system/src'
import { sortBy } from 'lodash/fp'
import { i18n } from '@hopara/i18n'
import { PageType } from '@hopara/page/src/Pages'
import { usePageNavigation } from '@hopara/page/src/PageNavigation'
import { Logger } from '@hopara/internals'
import { INTERNAL_DATA_SOURCE } from '@hopara/dataset'

import { Sidebar } from '../../sidebar/Sidebar'
import { DataSource } from '../DataSource'
import { DataSourceListItem } from '../DataSourceListItem'
import { ListDataSourcesOnboarding } from './ListDataSourcesOnboarding'

const ListDataSources = () => {
  const theme = useTheme()
  const dataSourceContext = useContext(DataSourceContext)
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const browserContext = useContext(BrowserContext)

  const [error, setError] = React.useState('')
  const [dataSources, setDataSources] = React.useState<DataSource[]>([])
  const [loading, setLoading] = React.useState(true)

  const borderColors = {
    MYSQL: '#417BA2',
    POSTGRES: '#00618A',
    SINGLESTORE: '#8602DD',
    TIMESCALE: '#FDB515',
    DUCKDB: '#6D32E4',
    SNOWFLAKE: '#29b5e8',
    JS_FUNCTION: '#F0DB4F'
  }

  const newDataSourceUrl = (type: string) => {
    return pageNavigation.getUrl(PageType.CreateDataSource, { type })
  }

  const editClicked = (dataSource: DataSource) => {
    pageNavigation.navigate(PageType.EditDataSource, { name: dataSource.name })
  }

  const viewUrl = (dataSource: DataSource) => {
    return pageNavigation.getUrl(PageType.ViewDataSource, { name: dataSource.name })
  }

  const onDeleted = (dataSource: DataSource) => {
    const index = dataSources.findIndex((ds) => ds.name === dataSource.name)
    if (index >= 0) {
      dataSources.splice(index, 1)
      setDataSources([...dataSources])
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const dataSources =
          (await dataSourceContext.dataSourceService.list(authContext.authorization)) ?? []
        setDataSources(
          sortBy(['default'], dataSources.map((ds) => new DataSource(ds)))
            .filter((ds) => ds.name !== INTERNAL_DATA_SOURCE),
        )
      } catch (err: any) {
        Logger.error(err)
        setError(err?.message)
      }
      setLoading(false)
    })()
  }, [dataSourceContext, setLoading, setDataSources, authContext])

  const sampleDataSources = dataSources.filter((ds) => ds.name === 'sample')
  const notSampleDataSources = dataSources.filter((ds) => ds.name !== 'sample')
  const shouldShowOnboarding = !loading && notSampleDataSources.length === 0 && authContext.authorization.canEditDataSources()

  return (
    <>
      <SidebarLayout>
        <Helmet>
          <title>{pageNavigation.getTitle(PageType.ListDataSources)}</title>
        </Helmet>

        <SpotlightContainer />
        <Sidebar />

        <ListCardsLayout>
          <BrowserWarningComponent
            inline
            isBrowserSupported={browserContext.platform.isSupported}
            isWebGLSupported={!!browserContext.webgl?.isSupported}
            isWebGLEnabled={!!browserContext.webgl?.isEnabled}
          />

          <Box
            sx={{
              marginBlockStart: '3em',
              [theme.breakpoints.down('sm')]: {
                display: 'none',
              },
            }}
          >
            <Title sx={{ margin: 0 }}>
              {i18n('CREATE_A_NEW_DATA_SOURCE')}
              <HelperButton
                description={i18n('CREATE_A_NEW_DATA_SOURCE_DESCRIPTION')}
                placement="right"
              />
            </Title>

            <CardListTemplate id="spotlight-6">
              <CardListItem
                name={i18n('POSTGRES')}
                icon={<Image src={PostgresImage} sx={{ width: 80 }} />}
                href={newDataSourceUrl('POSTGRES')}
                testId="postgres-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.POSTGRES}`,
                }}
              />
              <CardListItem
                id="spotlight-3"
                name={i18n('FILES')}
                icon={<Image src={DuckDbImage} sx={{width: 80}}/>}
                href={newDataSourceUrl('DUCKDB')}
                testId="duckdb-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.DUCKDB}`,
                }}
              />
              <CardListItem
                name={i18n('JS_FUNCTION')}
                icon={<Image src={JSImage} sx={{width: 80}}/>}
                href={newDataSourceUrl('JS_FUNCTION')}
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.JS_FUNCTION}`,
                }}
              />
              <CardListItem
                name={i18n('MYSQL')}
                icon={<Image src={MySQLImage} sx={{ width: 80 }} />}
                href={newDataSourceUrl('MYSQL')}
                testId="mysql-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.MYSQL}`,
                }}
              />
              <CardListItem
                name={i18n('SINGLESTORE')}
                icon={<Image src={SinglestoreImage} sx={{ width: 80 }} />}
                href={newDataSourceUrl('SINGLESTORE')}
                testId="singlestore-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.SINGLESTORE}`,
                }}
              />
              <CardListItem
                name={i18n('TIMESCALE')}
                icon={<Image src={TimescaleImage} sx={{ width: 80 }} />}
                href={newDataSourceUrl('TIMESCALE')}
                testId="timescale-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.TIMESCALE}`,
                }}
              />
              <CardListItem
                name={i18n('SNOWFLAKE')}
                icon={<Image src={SnowflakeImage} sx={{ width: 80 }} />}
                href={newDataSourceUrl('SNOWFLAKE')}
                testId="snowflake-button"
                size="medium"
                color="#FFFFFF"
                imageStyle={{
                  boxShadow: `inset 0px 0px 0px 3px ${borderColors.SNOWFLAKE}`,
                }}
              />
            </CardListTemplate>
          </Box>

            <Title sx={{ margin: 0 }}>
              {i18n('YOUR_DATA_SOURCES')}
            </Title>

          {shouldShowOnboarding && (
            <ListDataSourcesOnboarding />
          )}

          {loading && <CardListSkeleton testId="loading" count={2} />}

          {!loading && notSampleDataSources.length > 0 && (
            <>
              <ErrorPanel error={error}></ErrorPanel>
              <CardList>
                {notSampleDataSources.map((dataSource, index) => (
                  <DataSourceListItem
                    key={index}
                    dataSource={dataSource}
                    editClicked={editClicked}
                    viewUrl={viewUrl}
                    onDeleted={onDeleted}
                  />
                ))}
              </CardList>
            </>
          )}

          {!loading && sampleDataSources.length > 0 && (
            <>
              <Title sx={{ margin: 0 }}>
                {i18n('SAMPLE_DATA_SOURCES')}
              </Title>
              <ErrorPanel error={error}></ErrorPanel>
              <CardList>
                {sampleDataSources.map((dataSource, index) => (
                  <DataSourceListItem
                    id="spotlight-4"
                    key={index}
                    dataSource={dataSource}
                    editClicked={editClicked}
                    viewUrl={viewUrl}
                    onDeleted={onDeleted}
                  />
                ))}
              </CardList>
            </>
          )}
        </ListCardsLayout>
      </SidebarLayout>
    </>
  )
}

export default ListDataSources
