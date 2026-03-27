import {RouteFactory, routeVerb, Response} from '@hopara/http-server'
import {NotFoundError} from '@hopara/http-server'
import {ScriptService} from '../../script/ScriptService'

interface RouteInput {
  id: string
  scriptName: string
}

export const getScriptRoute: RouteFactory<RouteInput, any, ScriptService> = (scriptService) => ({
  path: '/template/:id/script/:scriptName',
  verb: routeVerb.get,
  handler: async ({params}) => {
    const script = await scriptService.getScript(params.id, params.scriptName)
    if (!script) throw new NotFoundError('script not found')
    return new Response(script.Data, 'application/text')
  },
})

