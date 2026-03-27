import { Logger } from '@hopara/logger'
import { AxiosInstance } from 'axios'

export type NotificationConfig = {
  url: string
}

export class NotificationService {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly notificationConfig: NotificationConfig,
    private readonly logger: Logger
  ) {
  }

  async notify(visualizationId:string, tenant: string, sessionId: string): Promise<void> {
    // Visualizations created by the tenant service have no session id
    if ( !sessionId ) {
      return
    }

    const url = new URL(`/notify/VISUALIZATION_CHANGE`, this.notificationConfig.url)

    try {
      return await this.httpClient.request({
        method: 'PUT',
        url: url.href,
        headers: {
          tenant,
          'Session-Id': sessionId,
        },
        data: {
          value: visualizationId,
        },
      })
    } catch (e) {
      this.logger.warn(`Error when notifiying ${tenant}#${visualizationId}`, e)
    }
  }
}
