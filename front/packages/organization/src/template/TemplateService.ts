import {Config} from '@hopara/config'
import {httpGet} from '@hopara/http-client'

export class TemplateService {
  async list() {
    const res = await httpGet(Config.getValue('TEMPLATE_API_ADDRESS'), `/template`)
    return res.data
  }
}
