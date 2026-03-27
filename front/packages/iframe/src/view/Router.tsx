import React, {lazy, Suspense} from 'react'
import {Route, Routes} from 'react-router-dom'
import {Pages, PageType} from '@hopara/page/src/Pages'
import {LoadingSpinner} from '@hopara/design-system/src/loading-spinner/Spinner'
import {ConnectedAuthProvider} from '@hopara/components/src/hoc/AuthProvider'
import {RumRouteMonitoring} from '@hopara/rum/src/RumMonitoring'

const VisualizationOutlet = lazy(() => import(/* webpackPreload: true */ '@hopara/components/src/visualization/pages/VisualizationOutlet'))
const VisualizationPageTemplate = lazy(() => import(/* webpackPreload: true */ '@hopara/components/src/visualization/pages/VisualizationPageTemplate'))
const ObjectEditorOutlet = lazy(() => import(/* webpackPreload: true */ '@hopara/components/src/object/editor/ObjectEditorOutletContainer'))
const SettingsOutlet = lazy(() => import(/* webpackPreload: true */ '@hopara/components/src/settings/SettingsOutletContainer'))
const LayerEditorOutlet = lazy(() => import(/* webpackPreload: true */ '@hopara/components/src/layer/editor/LayerEditorOutletContainer'))
const ForbiddenPage = lazy(() => import(/* webpackPreload: true */ '@hopara/design-system/src/static-pages/ForbiddenPage'))
const NotFoundPage = lazy(() => import(/* webpackPreload: true */ '@hopara/design-system/src/static-pages/NotFoundPage'))

export const Router = () => {
  return (
    <ConnectedAuthProvider>
      <Suspense fallback={<LoadingSpinner fullscreen={true}/>}>
        <RumRouteMonitoring />
        <Routes>
          <Route path={Pages.getPath(PageType.Forbidden)} element={<ForbiddenPage/>}/>
          <Route path={Pages.getPath(PageType.NotFound)} element={<NotFoundPage/>}/>
          <Route element={<VisualizationPageTemplate/>}>
            <Route path={Pages.getPath(PageType.VisualizationDetail)} element={<VisualizationOutlet/>}/>
            <Route path={Pages.getPath(PageType.VisualizationObjectEditor)} element={<ObjectEditorOutlet/>}/>
            <Route path={Pages.getPath(PageType.VisualizationSettings)} element={<SettingsOutlet/>}/>
            <Route path={Pages.getPath(PageType.VisualizationLayerEditor)} element={<LayerEditorOutlet/>}/>
          </Route>
          <Route path="*" element={<LoadingSpinner fullscreen={true}/>}/>
        </Routes>
      </Suspense>
    </ConnectedAuthProvider>
  )
}
