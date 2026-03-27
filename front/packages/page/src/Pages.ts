import {i18n} from '@hopara/i18n'
import {Permission} from '@hopara/authorization/src/Permissions'

export interface Page {
  type: PageType
  title: string
  path: string
  authenticated?: boolean
  permission?: Permission
}

export enum PageType {
  ListVisualizations = 'List Visualizations',
  VisualizationDetail = 'Visualization',
  VisualizationObjectEditor = 'Object Editor',
  VisualizationSettings = 'Settings',
  VisualizationLayerEditor = 'Layer Editor',
  VisualizationTest = 'Visualization Test',
  ListDataSources = 'DataSources List',
  EditDataSource = 'EditDataSource',
  CreateDataSource = 'Create DataSource',
  ViewDataSource = 'DataSource',
  EditQuery = 'Edit Query',
  CreateQuery = 'Create Query',
  ListIconLibraries = 'List Icon Libraries',
  ListIcons = 'List Icons',
  CreateIcon = 'Create Icon',
  EditIcon = 'Edit Icon',
  CreateDataFile = 'Create DataFile',
  EditDataFile = 'Edit DataFile',
  CreateFunction = 'Create Function',
  EditFunction = 'Edit Function',
  Forbidden = 'Forbidden',
  NotFound = 'Not Found',
  UserProfile = 'User Profile',
  Auth = 'Auth',
  SignIn = 'SignIn',
  ForgotPassword = 'Forgot Password',
  ResetPassword = 'Reset Password',
  SignUp = 'SignUp',
  ConfirmationPending = 'Confirmation Pending',
  AccountCreated = 'Account Created',
  ConfirmRegistration = 'Confirm Registration',
  DefinePassword = 'Define Password',
  Callback = 'Callback',
  Debug = 'Debug',
  StatusCheck = 'Status Check',
  AssetsReport = 'Assets Report',
  RoomsReport = 'Rooms Report',
}

export class Pages {
  static readonly pages: Record<PageType, Page> = {
    [PageType.ListVisualizations]: {
      type: PageType.ListVisualizations,
      title: `${i18n('VISUALIZATIONS')} - Hopara`,
      path: `/:tenant/visualization`,
      authenticated: true,
      permission: Permission.APP_READ,
    },
    [PageType.VisualizationDetail]: {
      type: PageType.VisualizationDetail,
      title: `${i18n('VISUALIZATIONS')} - Hopara`,
      path: `/:tenant/visualization/:visualizationId`,
      authenticated: true,
      permission: Permission.APP_READ,
    },
    [PageType.VisualizationObjectEditor]: {
      type: PageType.VisualizationObjectEditor,
      title: `${i18n('MOVE_AND_PLACE')} - Hopara`,
      path: `/:tenant/visualization/:visualizationId/object-editor`,
      authenticated: true,
      permission: Permission.ROW_WRITE,
    },
    [PageType.VisualizationSettings]: {
      type: PageType.VisualizationSettings,
      title: `${i18n('SETTINGS')} - Hopara`,
      path: `/:tenant/visualization/:visualizationId/settings`,
      authenticated: true,
      permission: Permission.APP_WRITE,
    },
    [PageType.VisualizationLayerEditor]: {
      type: PageType.VisualizationLayerEditor,
      title: `${i18n('LAYER_EDITOR')} - Hopara`,
      path: `/:tenant/visualization/:visualizationId/layer-editor`,
      authenticated: true,
      permission: Permission.APP_WRITE,
    },
    [PageType.VisualizationTest]: {
      type: PageType.VisualizationTest,
      title: `${i18n('TEST_VISUALIZATION')} - Hopara`,
      path: `/test/:visualizationId`,
      authenticated: true,
      permission: Permission.APP_READ,
    },
    [PageType.ListDataSources]: {
      type: PageType.ListDataSources,
      title: `${i18n('DATA_SOURCES')} - Hopara`,
      path: `/:tenant/data-source`,
      authenticated: true,
      permission: Permission.DATASOURCE_LIST,
    },
    [PageType.EditDataSource]: {
      type: PageType.EditDataSource,
      title: `${i18n('DATA_SOURCE')} - Hopara`,
      path: `/:tenant/data-source/edit/:name`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.CreateDataSource]: {
      type: PageType.CreateDataSource,
      title: `${i18n('CREATE_DATA_SOURCE')} - Hopara`,
      path: `/:tenant/data-source/create`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.ViewDataSource]: {
      type: PageType.ViewDataSource,
      title: `${i18n('DATA_SOURCE')} - Hopara`,
      path: `/:tenant/data-source/:name`,
      authenticated: true,
      permission: Permission.DATASOURCE_READ,
    },
    [PageType.EditQuery]: {
      type: PageType.EditQuery,
      title: `${i18n('EDIT_QUERY')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/query/edit/:name`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.CreateQuery]: {
      type: PageType.CreateQuery,
      title: `${i18n('NEW_QUERY')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/query/create`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.ListIconLibraries]: {
      type: PageType.ListIconLibraries,
      title: `${i18n('ICON_LIBRARIES')} - Hopara`,
      path: `/:tenant/icon-library`,
      authenticated: true,
      permission: Permission.RESOURCE_READ,
    },
    [PageType.ListIcons]: {
      type: PageType.ListIcons,
      title: `${i18n('ICONS')} - Hopara`,
      path: `/:tenant/icon-library/:name/icon`,
      authenticated: true,
      permission: Permission.RESOURCE_READ,
    },
    [PageType.CreateIcon]: {
      type: PageType.CreateIcon,
      title: `${i18n('CREATE_ICON')} - Hopara`,
      path: `/:tenant/icon-library/:name/icon/create`,
      authenticated: true,
      permission: Permission.RESOURCE_WRITE,
    },
    [PageType.EditIcon]: {
      type: PageType.EditIcon,
      title: `${i18n('EDIT_ICON')} - Hopara`,
      path: `/:tenant/icon-library/:name/icon/edit/:icon`,
      authenticated: true,
      permission: Permission.RESOURCE_WRITE,
    },
    [PageType.EditDataFile]: {
      type: PageType.EditDataFile,
      title: `${i18n('EDIT_DATA_FILE')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/data-file/edit/:name`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.CreateDataFile]: {
      type: PageType.CreateDataFile,
      title: `${i18n('NEW_DATA_FILE')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/data-file/create`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.EditFunction]: {
      type: PageType.EditDataFile,
      title: `${i18n('EDIT_FUNCTION')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/function/edit/:name`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.CreateFunction]: {
      type: PageType.CreateDataFile,
      title: `${i18n('ADD_FUNCTION')} - Hopara`,
      path: `/:tenant/data-source/:dataSourceName/function/create`,
      authenticated: true,
      permission: Permission.DATASOURCE_WRITE,
    },
    [PageType.Forbidden]: {
      type: PageType.Forbidden,
      title: `${i18n('FORBIDDEN')} - Hopara`,
      path: `/auth/forbidden`,
    },
    [PageType.NotFound]: {
      type: PageType.NotFound,
      title: `${i18n('NOT_FOUND')} - Hopara`,
      path: `/:tenant/not-found`,
    },
    [PageType.UserProfile]: {
      type: PageType.UserProfile,
      title: `${i18n('PROFILE')} - Hopara`,
      path: `/auth/profile`,
      authenticated: true,
      permission: Permission.TENANT_READ,
    },
    [PageType.Auth]: {
      type: PageType.Auth,
      title: `Sign In - Hopara`,
      path: `/auth`,
    },
    [PageType.SignIn]: {
      type: PageType.SignIn,
      title: `Sign In - Hopara`,
      path: `/auth/signin`,
    },
    [PageType.ForgotPassword]: {
      type: PageType.ForgotPassword,
      title: `Forgot Password - Hopara`,
      path: `/auth/signin/forgot-password`,
    },
    [PageType.ResetPassword]: {
      type: PageType.ResetPassword,
      title: `Reset Password - Hopara`,
      path: `/auth/signin/reset-password`,
    },
    [PageType.SignUp]: {
      type: PageType.SignUp,
      title: `Sign Up - Hopara`,
      path: `/auth/signup`,
    },
    [PageType.ConfirmationPending]: {
      type: PageType.ConfirmationPending,
      title: `Confirmation Pending - Hopara`,
      path: `/auth/signup/confirmation-pending`,
    },
    [PageType.AccountCreated]: {
      type: PageType.AccountCreated,
      title: `Account Created - Hopara`,
      path: `/auth/signup/account-created`,
    },
    [PageType.ConfirmRegistration]: {
      type: PageType.ConfirmRegistration,
      title: `Confirm Registration - Hopara`,
      path: `/auth/signup/confirm-registration`,
    },
    [PageType.DefinePassword]: {
      type: PageType.DefinePassword,
      title: `Define Password - Hopara`,
      path: `/auth/signup/define-password`,
    },
    [PageType.Callback]: {
      type: PageType.Callback,
      title: `Callback - Hopara`,
      path: `/auth/callback`,
    },
    [PageType.Debug]: {
      type: PageType.Debug,
      title: `Debug - Hopara`,
      path: `/:tenant/debug`,
    },
    [PageType.StatusCheck]: {
      type: PageType.StatusCheck,
      title: `Status Check - Hopara`,
      path: `/status-check`,
    },
    [PageType.AssetsReport]: {
      type: PageType.AssetsReport,
      title: `Assets Report - Hopara`,
      path: `/:tenant/report/assets`,
    },
    [PageType.RoomsReport]: {
      type: PageType.RoomsReport,
      title: `Roos Report - Hopara`,
      path: `/:tenant/report/rooms`,
    },
  }

  static getByIndex(index: number) {
    return Object.values(this.pages)[index]
  }

  static getPage(page: PageType) {
    return this.pages[page]
  }

  static getTitle(page: PageType) {
    return this.pages[page].title
  }

  static getPath(page: PageType, params?: Record<string, string | undefined>, basePath = '') {
    let path = this.pages[page].path
    if (params) {
      path = path.replace(/:\w+/g, (match) => {
        const key = match.slice(1)
        return params?.[key] ?? match
      })
    }
    return basePath + path
  }

  static getAll() {
    return Object.values(this.pages)
  }
}

