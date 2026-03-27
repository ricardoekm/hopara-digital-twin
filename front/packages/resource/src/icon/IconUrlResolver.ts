import {Config} from '@hopara/config'

export class IconUrlResolver {
  static getIconUrl(iconName: string, tenant: string, libraryName?: string) {
    if (libraryName) {
      return new URL(`${Config.getValue('RESOURCE_API_ADDRESS')}/tenant/${tenant}/icon-library/${libraryName}/icon/${iconName}`)
    }
    return new URL(`${Config.getValue('RESOURCE_API_ADDRESS')}/tenant/${tenant}/icon/${iconName}`)
  }

  static resolve(tenant: string, libraryName: string | undefined, iconName: string, fallback?: string) {
    const url = this.getIconUrl(iconName, tenant, libraryName)
    if (fallback) url.searchParams.append('fallback', fallback)
    return url.toString()
  }
}
