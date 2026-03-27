import 'reflect-metadata'
import {container, Lifecycle} from 'tsyringe'
import { FetchController, FetchControllerToken } from '../rowset/fetch/FetchController'
import { FetchStateFactory, FetchStateFactoryToken } from '../rowset/fetch/FetchStateFactory'
import { TransformFactory, TransformFactoryToken } from '../transform/TransformFactory'
import { SimpleFetchController } from '../rowset/fetch/SimpleFetchController'
import { SimpleFetchStateFactory } from '../rowset/fetch/SimpleFetchStateFactory'
import { SimpleTransformFactory } from '../transform/SimpleTransformFactory'

container.register<FetchController>(FetchControllerToken, 
                                   {useClass: SimpleFetchController}, 
                                   {lifecycle: Lifecycle.Singleton})


container.register<FetchStateFactory>(FetchStateFactoryToken, 
                                     {useClass: SimpleFetchStateFactory}, 
                                     {lifecycle: Lifecycle.Singleton})

container.register<TransformFactory>(TransformFactoryToken, 
                                     {useClass: SimpleTransformFactory}, 
                                     {lifecycle: Lifecycle.Singleton})
