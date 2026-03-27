import { UAParser } from 'ua-parser-js'
export type {IDevice as Device} from 'ua-parser-js'

export const getDevice = async () => {
  const parser = new UAParser()
  const device = parser.getDevice()
  if (device.type) return device
  return await parser.getDevice().withFeatureCheck()
}

export const isMobile = async () => {
  const device = await getDevice()
  return device.type === 'mobile' || device.type === 'tablet'
}
