export interface BitmapManager {
  getLoadUrl(imageUrl:string, viewport, boundsArray: any[], version: Date | undefined, isDragging:boolean, isVisible:boolean): string
}
