import { SubscriptionRepository } from './subscription-repository'
import socketIO from 'socket.io'
import { Subscription } from './subscription'

test('Find', () => {
   const subscriptionRepository = new SubscriptionRepository()
   subscriptionRepository.save( new Subscription({ id: '123', event: 'QUERY_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io' }) )
   subscriptionRepository.save( new Subscription({ id: '777', event: 'POSITION_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io' }) )
   subscriptionRepository.save( new Subscription({ id: '456', event: 'QUERY_CHANGE', socket: {} as socketIO.Socket, tenant: 'other.tech' }) )

   const subscriptions = subscriptionRepository.findForNotification('QUERY_CHANGE', 'hopara.io', '123')
   expect(subscriptions.length).toEqual(1)
   expect(subscriptions[0].id).toEqual('123')
})

test('Find considers value', () => {
    const subscriptionRepository = new SubscriptionRepository()
    subscriptionRepository.save( new Subscription({ id: '123', event: 'VISUALIZATION_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io', value: 'my-viz' }) )
    subscriptionRepository.save( new Subscription({ id: '456', event: 'VISUALIZATION_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io', value: 'other-viz' }) )
 
    let subscriptions = subscriptionRepository.findForNotification('VISUALIZATION_CHANGE', 'hopara.io', '123', 'my-viz')
    expect(subscriptions.length).toEqual(1)
    expect(subscriptions[0].id).toEqual('123')

    subscriptions = subscriptionRepository.findForNotification('VISUALIZATION_CHANGE', 'hopara.io', '123', 'bla')
    expect(subscriptions.length).toEqual(0)
 })

 test('Delete by event', () => {
    const subscriptionRepository = new SubscriptionRepository()
    subscriptionRepository.save( new Subscription({ id: '123', event: 'POSITION_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io' }) )
    subscriptionRepository.save( new Subscription({ id: '123', event: 'VISUALIZATION_CHANGE', socket: {} as socketIO.Socket, tenant: 'hopara.io'}) )
    
    subscriptionRepository.delete('123', 'POSITION_CHANGE')

    expect(subscriptionRepository.findForNotification('VISUALIZATION_CHANGE', 'hopara.io', '123').length).toEqual(1)
    expect(subscriptionRepository.findForNotification('POSITION_CHANGE', 'hopara.io', '123').length).toEqual(0)
 })
 
