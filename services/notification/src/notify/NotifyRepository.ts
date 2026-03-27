import {AxiosInstance, AxiosResponse} from 'axios'

export class NotifyRepository {
    httpClient: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.httpClient = httpClient
    }

    async notify(ip: string, event:string, tenant: string, sessionId: string, value:string | undefined, payload:any) : Promise<AxiosResponse> {
        return await this.httpClient.request({
            method: 'PUT',
            // eslint-disable-next-line @microsoft/sdl/no-insecure-url
            url: `http://${ip}:8085/notify/${event}`,
            params: {
               broadcast: false
            },
            data: {
                value,
                ...payload
            },
            headers: {
               tenant,
               'session-id': sessionId
             },
          })
    }
}
