import { ColorEncoding, Condition, SizeEncoding } from '@hopara/encoding'
import { Internals } from '@hopara/internals'
import {KeyFrames, Timeline} from '@luma.gl/engine'
import {Channel} from '@luma.gl/engine/dist/es5/animation/timeline'
import { attributeReplacement, Replacements } from './AttributeReplacement'

export interface AnimationData {
  channel: Channel,
  keyFrames: Record<string, [number, Record<string, any>]>
  createdTimestamp: Date
}

export interface Animation {
  keyFrames: Record<string, any>
  channel: {
    duration: number
    delay: number
    repeat: number
  }
  condition: Condition
  createdTimestamp: Date
}

export const isSameAnimationDataList = (a: AnimationData[], b: AnimationData[]): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].createdTimestamp.getTime() !== b[i].createdTimestamp.getTime()) return false
  }
  return true
}

export class AnimationEngine {
  private keyframes: KeyFrames<any>[]
  private renderLoopId: number
  private isAnimationEnabled: boolean

  constructor(params: {redrawFn: () => void, fps?: number}) {
    this.keyframes = []
    this.isAnimationEnabled = Internals.getParam('animate') !== false
    this.renderLoopId = this.startRenderLoop(params.redrawFn, params.fps)
  }

  private startRenderLoop(redrawFn: () => void, fps: number = 24): number {
    const interval = 1000 / fps
    return window.setInterval(() => {
      if (!this.keyframes?.length) return
      window.requestAnimationFrame(() => redrawFn())
    }, interval)
  }

  private static createAnimation(encoding: ColorEncoding | SizeEncoding, deckProps: any, replacements?: Replacements): Animation {
    return {
      condition: encoding.animation?.condition,
      keyFrames: attributeReplacement(
        encoding.animation?.keyFrames,
        replacements,
        encoding,
        deckProps,
      ),
      channel: encoding.animation?.channel,
      createdTimestamp: encoding.createdTimestamp,
    }
  }

  static getSizeAnimations(encoding: Record<string, any>, deckProps: any): Animation[] {
    const animations = [] as Animation[]
    if (encoding.size?.animation) animations.push(this.createAnimation(encoding.size, deckProps))
    return animations
  }

  static getColorAnimations(encoding: Record<string, any>, deckProps: any): Animation[] {
    const animations = [] as Animation[]
    if (encoding.color?.animation) animations.push(this.createAnimation(encoding.color, deckProps))
    return animations
  }

  createKeyFrames(animationDataList: AnimationData[], timeline: Timeline): void {
    if (!animationDataList?.length) return
    const keyFramesList = [] as KeyFrames<any>[]

    animationDataList.forEach((animationData) => {
      if (!animationData) return new KeyFrames([])

      const data = Object.assign({}, animationData)

      if (data.channel?.repeat === -1 || !data.channel?.repeat) {
        data.channel = {
          ...data.channel,
          repeat: Number.POSITIVE_INFINITY,
        }
      }

      if (!data.channel?.duration) {
        data.channel = {
          ...data.channel,
          duration: 5000,
        }
      }

      const channel = timeline.addChannel(data.channel)
      const frames:Array<[number, any]> = []

      for (const timePercent in data.keyFrames) {
        const time = data.channel.duration * parseInt(timePercent) / 100
        frames.push([time, data.keyFrames[timePercent]])
      }

      const keyFrames = new KeyFrames(frames)
      timeline.attachAnimation(keyFrames, channel)

      keyFramesList.push(keyFrames)
    })

    this.keyframes = keyFramesList
  }

  private calculateUniformValue(key, startValues: any, endValues: any, factor: number): any {
    const startValue = startValues[key]
    const endValue = endValues[key]
    return startValue + factor * (endValue - startValue)
  }

  private getUniformsFromKeyframes(): Record<string, any> {
    const newUniformValues = {} as Record<string, any>

    if (!this.isAnimationEnabled) return newUniformValues
  
    for (const keyFrames of this.keyframes) {
      const startValues = keyFrames.getStartData()
      const endValues = keyFrames.getEndData()

      for (const key in startValues) {
        newUniformValues[key] = this.calculateUniformValue(key, startValues, endValues, keyFrames.factor)
      }
    }
  
    return newUniformValues
  }

  getUniforms(): Record<string, any> {
    return this.getUniformsFromKeyframes()
  }

  finalize(): void {
    clearInterval(this.renderLoopId)
  }
}
