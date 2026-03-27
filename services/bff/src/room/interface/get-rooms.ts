import { RoomService } from '../RoomService'
import {NotFoundError, RouteFactory, routeVerb, Response} from '@hopara/http-server'

interface RouteInput {
  source: string
  query: string
  positionField: string
  titleField?: string
  coordinates?: string
}

export const getRoomsRoute: RouteFactory<RouteInput, any> = () => ({
  path: '/room',
  verb: routeVerb.get,
  handler: async ({params, container, headers}) => {
    const resp = await container.resolve<RoomService>('roomService').getRooms(
      params.source,
      params.query,
      params.positionField,
      params.titleField,
      params.coordinates ? JSON.parse(params.coordinates) : undefined,
      {
        tenant: headers.tenant,
        token: headers.authorization,
      }
    )
    if (!resp) throw new NotFoundError('Rooms not found')
    return new Response(resp, undefined, {
      'Tenant': headers.tenant,
    })
  },
})
