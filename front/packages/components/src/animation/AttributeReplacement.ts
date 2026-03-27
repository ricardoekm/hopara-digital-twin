import { isUndefined, omitBy } from 'lodash/fp'

export type Replacements = Record<string, (keyFrameProps, encoding, originalProps) => any>

export const attributeReplacement = (
  keyFrames: Record<string, any> = {},
  replacements: Replacements = {},
  encoding: Record<string, any>,
  deckProps: any,
) => {
  return Object.fromEntries(Object.entries(keyFrames).map(([percent, keyframe]) => {
    const localKeyframe = {...keyframe}
    Object.entries(replacements).forEach(([key, fn]) => {
      localKeyframe[key] = fn(keyframe, encoding, deckProps)
    })
    return [percent, omitBy(isUndefined, localKeyframe)]
  }))
}
