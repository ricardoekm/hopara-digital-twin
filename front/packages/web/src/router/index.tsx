import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { LoadingSpinner } from '@hopara/design-system/src/loading-spinner/Spinner'
import { ConnectedAuthProvider } from '@hopara/components/src/hoc/AuthProvider'
import { DataSourceProvider } from '@hopara/organization/src/data-source/service/DataSourceContext'
import { Pages, PageType } from '@hopara/page/src/Pages'
import EditFile from '@hopara/organization/src/data-source/pages/EditFile'
import RouterTransitionGroup from './RouterTransitionGroup'
import { BrowserProvider } from '@hopara/browser/src/BrowserContext'

const VisualizationOutlet = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/components/src/visualization/pages/VisualizationOutlet'
    )
)
const VisualizationsPage = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/organization/src/visualization/ListVisualizationsPage'
    )
)
const VisualizationPageTemplate = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/components/src/visualization/pages/VisualizationPageTemplate'
    )
)
const VisualizationTestPage = lazy(
  () =>
    import('@hopara/components/src/visualization/pages/TestVisualizationPage')
)
const DebugPage = lazy(
  () => import('@hopara/components/src/visualization/pages/DebugPage')
)
const ObjectEditorOutlet = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/components/src/object/editor/ObjectEditorOutletContainer'
    )
)
const SettingsOutlet = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/components/src/settings/SettingsOutletContainer'
    )
)
const LayerEditorOutlet = lazy(
  () =>
    import(
      /* webpackPreload: true */ '@hopara/components/src/layer/editor/LayerEditorOutletContainer'
    )
)

const SignIn = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ '@hopara/auth-front/src/pages/SignIn/SignIn'
    )
)
const ConfirmationPending = lazy(
  () => import('@hopara/auth-front/src/pages/SignUp/ConfirmationPending')
)
const ForgotPassword = lazy(
  () => import('@hopara/auth-front/src/pages/SignIn/ForgotPassword')
)
const ResetPasswordFromForgot = lazy(
  () => import('@hopara/auth-front/src/pages/SignIn/ResetPasswordFromForgot')
)
const SignUp = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ '@hopara/auth-front/src/pages/SignUp/SignUp'
    )
)
const AccountCreated = lazy(
  () => import('@hopara/auth-front/src/pages/SignUp/AccountCreated')
)
const ConfirmRegistration = lazy(
  () => import('@hopara/auth-front/src/pages/SignUp/ConfirmRegistration')
)
const ResetPasswordFromInvite = lazy(
  () => import('@hopara/auth-front/src/pages/SignUp/ResetPasswordFromInvite')
)
const AuthCallback = lazy(
  () => import('@hopara/auth-front/src/pages/SignIn/Callback')
)
const Auth = lazy(() => import('@hopara/auth-front/src/pages/Auth'))

const ListDataSources = lazy(
  () => import('@hopara/organization/src/data-source/pages/ListDataSources')
)
const EditDataSource = lazy(
  () => import('@hopara/organization/src/data-source/pages/EditDataSource')
)
const ViewDataSource = lazy(
  () => import('@hopara/organization/src/data-source/pages/ViewDataSource')
)
const EditQuery = lazy(
  () => import('@hopara/organization/src/data-source/pages/EditQuery')
)

const ChangePassword = lazy(
  () => import('@hopara/auth-front/src/pages/Authenticated/ChangePassword')
)

const ListIcons = lazy(
  () => import('@hopara/organization/src/resources/pages/ListIcons')
)
const ListIconLibraries = lazy(
  () => import('@hopara/organization/src/resources/pages/ListIconLibraries')
)
const EditIcon = lazy(
  () => import('@hopara/organization/src/resources/pages/EditIcon')
)

const ForbiddenPage = lazy(
  () => import('@hopara/design-system/src/static-pages/ForbiddenPage')
)
const NotFoundPage = lazy(
  () => import('@hopara/design-system/src/static-pages/NotFoundPage')
)

const StatusCheckPage = lazy(
  () => import('@hopara/components/src/status-check/StatusCheckPage')
)

const AuthRoutes: React.FunctionComponent = () => {
  const location = useLocation()
  if (!location.pathname.startsWith('/auth')) return null // prevent cross matching with authenticated routes

  return (
    <RouterTransitionGroup location={location}>
      <Routes location={location}>
        <Route path={Pages.getPath(PageType.Auth)} element={<Auth />} />
        <Route path={Pages.getPath(PageType.SignIn)} element={<SignIn />} />
        <Route
          path={Pages.getPath(PageType.ForgotPassword)}
          element={<ForgotPassword />}
        />
        <Route
          path={Pages.getPath(PageType.ResetPassword)}
          element={<ResetPasswordFromForgot />}
        />
        <Route path={Pages.getPath(PageType.SignUp)} element={<SignUp />} />
        <Route
          path={Pages.getPath(PageType.ConfirmationPending)}
          element={<ConfirmationPending />}
        />
        <Route
          path={Pages.getPath(PageType.AccountCreated)}
          element={<AccountCreated />}
        />
        <Route
          path={Pages.getPath(PageType.ConfirmRegistration)}
          element={<ConfirmRegistration />}
        />
        <Route
          path={Pages.getPath(PageType.DefinePassword)}
          element={<ResetPasswordFromInvite />}
        />
        <Route
          path={Pages.getPath(PageType.Callback)}
          element={<AuthCallback />}
        />
        <Route
          path={Pages.getPath(PageType.Forbidden)}
          element={<ForbiddenPage />}
        />
      </Routes>
    </RouterTransitionGroup>
  )
}

const HoparaRoutes: React.FunctionComponent = () => {
  const location = useLocation()
  if (
    location.pathname.startsWith('/auth') &&
    location.pathname !== Pages.getPath(PageType.UserProfile)
  ) {
    return null
  } // prevent cross matching with unauthenticated routes

  return (
    <Routes>
      <Route
        path={Pages.getPath(PageType.UserProfile)}
        element={<ChangePassword />}
      />
      <Route
        path={Pages.getPath(PageType.Debug)}
        element={<DebugPage />}
      ></Route>
      <Route
        path={Pages.getPath(PageType.ListVisualizations)}
        element={<VisualizationsPage />}
      />
      <Route
        path={Pages.getPath(PageType.NotFound)}
        element={<NotFoundPage />}
      />

      <Route element={<VisualizationPageTemplate />}>
        <Route
          path={Pages.getPath(PageType.VisualizationTest)}
          element={<VisualizationTestPage />}
        />
        <Route
          path={Pages.getPath(PageType.VisualizationDetail)}
          element={<VisualizationOutlet />}
        />
        <Route
          path={Pages.getPath(PageType.VisualizationObjectEditor)}
          element={<ObjectEditorOutlet />}
        />
        <Route
          path={Pages.getPath(PageType.VisualizationSettings)}
          element={<SettingsOutlet />}
        />
        <Route
          path={Pages.getPath(PageType.VisualizationLayerEditor)}
          element={<LayerEditorOutlet />}
        />
      </Route>

      <Route
        path={Pages.getPath(PageType.ListDataSources)}
        element={<ListDataSources />}
      />
      <Route
        path={Pages.getPath(PageType.EditDataSource)}
        element={<EditDataSource />}
      />
      <Route
        path={Pages.getPath(PageType.CreateDataSource)}
        element={<EditDataSource />}
      />
      <Route
        path={Pages.getPath(PageType.ViewDataSource)}
        element={<ViewDataSource />}
      />
      <Route path={Pages.getPath(PageType.EditQuery)} element={<EditQuery />} />
      <Route
        path={Pages.getPath(PageType.CreateQuery)}
        element={<EditQuery />}
      />

      <Route
        path={Pages.getPath(PageType.ListIconLibraries)}
        element={<ListIconLibraries />}
      />
      <Route path={Pages.getPath(PageType.ListIcons)} element={<ListIcons />} />
      <Route path={Pages.getPath(PageType.CreateIcon)} element={<EditIcon />} />
      <Route path={Pages.getPath(PageType.EditIcon)} element={<EditIcon />} />

      <Route
        path={Pages.getPath(PageType.EditDataFile)}
        element={<EditFile />}
      />
      <Route
        path={Pages.getPath(PageType.CreateDataFile)}
        element={<EditFile />}
      />

      <Route
        path={Pages.getPath(PageType.EditFunction)}
        element={<EditFile />}
      />
      <Route
        path={Pages.getPath(PageType.CreateFunction)}
        element={<EditFile />}
      />

      <Route
        path={Pages.getPath(PageType.StatusCheck)}
        element={<StatusCheckPage />}
      />

      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  )
}

const router = () => {
  return (
    <Router>
      <ConnectedAuthProvider>
        <DataSourceProvider>
          <BrowserProvider>
            <Suspense fallback={<LoadingSpinner fullscreen={true} />}>
              {/* <RumRouteMonitoring/> */}
              <AuthRoutes />
              <HoparaRoutes />
            </Suspense>
          </BrowserProvider>
        </DataSourceProvider>
      </ConnectedAuthProvider>
    </Router>
  )
}

export default router
