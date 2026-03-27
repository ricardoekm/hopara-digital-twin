import {Subscription} from './subscription'

export class SubscriptionRepository {
  subscriptionMap: Map<string, Subscription[]>

  constructor() {
    this.subscriptionMap = new Map()
  }

  save(subscription: Subscription) {
    if ( !this.subscriptionMap.get(subscription.id) ) {
        this.subscriptionMap.set(subscription.id, [])
    }

    this.subscriptionMap.get(subscription.id)!.push(subscription)
  }

  delete(id: string, event?: string) {
    const subscriptions = this.subscriptionMap.get(id) 
    if ( !subscriptions ) {
        return
    }
    
    if ( !event ) {
        this.subscriptionMap.delete(id)
    }

    const subscriptionToDelete = subscriptions.find((s) => s.event === event)
    if ( subscriptionToDelete ) {
        const index = subscriptions.indexOf(subscriptionToDelete)
        if ( index > -1 ) {
            subscriptions.splice(index, 1)
        }
    }
  }

  findForNotification(event:string, tenant:string, sessionId?: string, value?: string) : Subscription[] {
    return Array.from(this.subscriptionMap.values())
                .flat()
                .filter((subscription: Subscription) => subscription.matches(event, tenant, value) 
                                                        && subscription.sessionId !== sessionId)
  }
}
