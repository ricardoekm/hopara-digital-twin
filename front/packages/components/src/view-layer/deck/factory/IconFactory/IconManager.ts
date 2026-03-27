import GL from '@luma.gl/constants'
import {Texture2D} from '@luma.gl/core'
import {load} from '@loaders.gl/core'
import {createIterable} from '@deck.gl/core'

import type {AccessorFunction} from '@deck.gl/core/typed'
import { IconLoader } from './IconLoader'
import { throttle } from 'lodash/fp'
import { resizeImage } from '@hopara/resource'
import { DEFAULT_TEXTURE_SIZE } from '@hopara/browser'
import { Logger } from '@hopara/internals'

const DEFAULT_TEXTURE_PADDING = 4
const DEFAULT_TEXTURE_ICON_SIZE = 204

const noop = () => ({})

const DEFAULT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
  [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
}

type IconDef = {
  width: number;
  height: number;
  anchorX?: number;
  anchorY?: number;
  mask?: boolean;
};

export type UnpackedIcon = {
  url: string;
  id?: string;
} & IconDef;

type PrepackedIcon = {
  x: number;
  y: number;
  id?: string;
} & IconDef;

export type IconMapping<IconType> = Record<string, IconType & {filename?: string}>;

export type LoadIconErrorContext = {
  error: Error;
  url: string;
  source: any;
  sourceIndex: number;
  loadOptions: any;
};

function getIconId(icon: UnpackedIcon): string {
  return icon && (icon.id || icon.url)
}

// Generate coordinate mapping to retrieve icon left-top position from an icon atlas
export function buildIconMapping({
  icon,
  padding,
  iconMapping = {},
  canvasSize,
  cellSize,
}: {
  icon: UnpackedIcon & {filename?: string}
  padding: number
  canvasSize: number
  cellSize: number
  iconMapping: IconMapping<PrepackedIcon>
}): IconMapping<PrepackedIcon> {
  if (iconMapping[icon.filename!]) return iconMapping

  const iconIndex = Object.keys(iconMapping).length + 1
  const maxSlotsPerRow = Math.floor((canvasSize - padding) / cellSize)
  const rowSlot = Math.floor(iconIndex / maxSlotsPerRow)
  const colSlot = iconIndex % maxSlotsPerRow

  return {
    ...iconMapping,
    [icon.filename!]: {
      ...icon,
      x: colSlot * cellSize,
      y: rowSlot * cellSize,
    },
  }
}

// extract icons from data
// return icons should be unique, and not cached or cached but url changed
export function getDiffIcons(
  data: any,
  getIcon: AccessorFunction<any, UnpackedIcon> | null,
  cachedIcons: IconMapping<UnpackedIcon> | null,
): Record<
  string,
  UnpackedIcon & {
    source: any;
    sourceIndex: number;
  }
> | null {
  if (!data || !getIcon) {
    return null
  }

  cachedIcons = cachedIcons || {}
  const icons = {}
  const {iterable, objectInfo} = createIterable(data)
  for (const object of iterable) {
    objectInfo.index++
    const icon = getIcon(object, objectInfo)
    const id = getIconId(icon)

    if (!icon) {
      throw new Error('Icon is missing.')
    }

    if (!icon.url) {
      throw new Error('Icon url is missing.')
    }

    if (!icons[id] && (!cachedIcons[id] || icon.url !== cachedIcons[id].url)) {
      icons[id] = {...icon, source: object, sourceIndex: objectInfo.index}
    }
  }
  return icons
}

export default class IconManager {
  gl: WebGLRenderingContext

  private onUpdateFns: Record<string, () => void> = {}
  private onErrorFns: Record<string, (context: LoadIconErrorContext) => void> = {}
  private throttleUpdate: () => void
  private _loadOptions: any = null
  private _textureParameters: Record<number, number> | null = null
  private _pendingCount = 0
  private _canvas: HTMLCanvasElement | null = null


  _iconMapping: IconMapping<PrepackedIcon> = {}
  _fetchedIconMapping: IconMapping<UnpackedIcon> = {}
  _texture: Texture2D | null = null
  _texturePadding: number = DEFAULT_TEXTURE_PADDING
  _canvasSize: number
  _textureIconSize = DEFAULT_TEXTURE_ICON_SIZE

  constructor(maxTextureSize: number) {
    this._canvasSize = Math.min(maxTextureSize, DEFAULT_TEXTURE_SIZE)
  }

  init(
    layerId:string,
    gl: WebGLRenderingContext,
    {onUpdate = noop, onError = noop}: {onUpdate: () => void; onError: (context: LoadIconErrorContext) => void}
  ): void {
    this.gl = gl
    this.onUpdateFns[layerId] = onUpdate
    this.onErrorFns[layerId] = onError

    this.throttleUpdate = throttle(400, () => {
      this._texture?.generateMipmap()
      this.onUpdate()
    })
  }

  onUpdate(): void {
    Object.values(this.onUpdateFns).forEach((fn) => fn())
  }

  onError(context: LoadIconErrorContext): void {
    Object.values(this.onErrorFns).forEach((fn) => fn(context))
  }

  finalize(): void {
    // this._texture?.delete()
  }

  getTexture(): Texture2D | null {
    return this._texture
  }

  getIconMapping(icon: UnpackedIcon): PrepackedIcon {
    const iconId = getIconId(icon)
    const filename = this._fetchedIconMapping[iconId]?.filename
    const defaultMapping = {x: 0, y: 0, width: this._textureIconSize, height: this._textureIconSize, mask: true} as any

    if (filename && this._iconMapping[filename]) {
      return {...defaultMapping, ...this._iconMapping[filename]}
    }

    return defaultMapping
  }

  setProps({
    loadOptions,
    textureParameters,
  }: {
    loadOptions?: any;
    textureParameters?: Record<number, number> | null;
  }) {
    if (loadOptions) this._loadOptions = loadOptions
    if (textureParameters) this._textureParameters = textureParameters
  }

  // eslint-disable-next-line no-restricted-syntax
  get isLoaded(): boolean {
    return this._pendingCount === 0
  }

  packIcons(data: any, getIcon: AccessorFunction<any, UnpackedIcon>): void {
    if (typeof document === 'undefined') return

    const icons = Object.values(getDiffIcons(data, getIcon, this._fetchedIconMapping) || {})
    if (!icons.length) return

    if (!this._texture) {
      this._texture = new Texture2D(this.gl, {
        width: this._canvasSize,
        height: this._canvasSize,
        parameters: this._textureParameters || DEFAULT_TEXTURE_PARAMETERS,
      })
    }

    this.throttleUpdate()

    // load images
    this._canvas = this._canvas || document.createElement('canvas')
    this._loadIcons(icons)
  }

  private _loadIcons(icons: (UnpackedIcon & {
    source: any;
    sourceIndex: number;
  })[]): void {
    const ctx = this._canvas!.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D

    for (const icon of icons) {
      const iconId = getIconId(icon)
      this._pendingCount++
      load(icon.url, IconLoader, this._loadOptions)
        .then((imageData) => {
          const {data, width, height} = resizeImage(ctx, imageData.image, this._textureIconSize, this._textureIconSize)
          
          const fetchedIcon = {...icon, width, height, filename: imageData.filename ?? iconId }
          this._fetchedIconMapping[iconId] = fetchedIcon

          const newIconMapping = buildIconMapping({
            icon: fetchedIcon,
            padding: this._texturePadding,
            canvasSize: this._canvasSize,
            cellSize: this._textureIconSize,
            iconMapping: this._iconMapping,
          })
 
          const {x, y} = newIconMapping[fetchedIcon.filename!]
          if (y > (this._canvasSize - this._textureIconSize)) {
            Logger.warn(`Icon limit exceeded: ${fetchedIcon.filename}`)
            return
          }

          this._iconMapping = newIconMapping
          this._texture?.setSubImageData({data, x, y, width, height})
          this.throttleUpdate()
        })
        .catch((error) => {
          this.onError({
            url: icon.url,
            source: icon.source,
            sourceIndex: icon.sourceIndex,
            loadOptions: this._loadOptions,
            error,
          })
        })
        .finally(() => {
          this._pendingCount--
        })
    }
  }
}
