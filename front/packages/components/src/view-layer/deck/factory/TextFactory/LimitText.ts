import { Dimensions } from '@hopara/spatial'
import { isNil } from 'lodash'

function hasReachedMaxHeight(maxHeight: number | undefined, y:any) {
  return !isNil(maxHeight) && y > maxHeight
}

export type CharCoordinates = {
  x: number[],
  y: number[]
}

function removeTrailingNewLine(text:string) { 
  if (text[text.length - 1] === '\n') {
    return text.slice(0, -1)
  }

  return text
}

export const ELLIPSIS = '…'

function addEllipsis(text:string, x:number[], maxWidth:number, ellipsisWidth: number) {
  for (let i = text.length - 1, j = x.length - 1; i >= 0 && j >= 0; i--, j--) {
    if (text[i] === '\n') {
      return text + ELLIPSIS
    }

    if (x[j] + ellipsisWidth <= maxWidth) {
      return text.slice(0, i) + ELLIPSIS
    }
  }

  return text + ELLIPSIS
}

export function limitText(text:string, charCoordinates: CharCoordinates, maxDimensions:Dimensions, ellipsisSize: number) {
  let limitedText = ''
  for (let i = 0; i < text.length; i++) {
    if (hasReachedMaxHeight(maxDimensions.height, charCoordinates.y[i])) {
      const limitedXCoordinates = charCoordinates.x.slice(0, i)
      return addEllipsis(removeTrailingNewLine(limitedText), limitedXCoordinates, maxDimensions.width, ellipsisSize)
    }

    if (charCoordinates.y[i] === charCoordinates.y[i + 1]) {
      limitedText += text[i]
    } else {
      limitedText += text[i] + '\n'
    }
  }

  return removeTrailingNewLine(limitedText)
}
