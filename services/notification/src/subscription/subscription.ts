import socketIO from 'socket.io'

export class Subscription { 
   id:string
   event: string
   value?: string
   sessionId: string
   socket: socketIO.Socket 
   tenant: string

   constructor(props:Partial<Subscription>) {
      Object.assign(this, props)
   }

   matches(event:string, tenant:string, value?: string) : boolean {
    if ( this.event === event && this.tenant == tenant ) {
        if ( value ) {
            return value === this.value
        }

        return true
    }

    return false
   }
}
