export function resizeImage(
  ctx: CanvasRenderingContext2D,
  imageData: HTMLImageElement | ImageBitmap,
  maxWidth: number,
  maxHeight: number,
): {
  data: HTMLImageElement | HTMLCanvasElement | ImageBitmap;
  width: number;
  height: number;
} {
  const resizeRatio = Math.min(maxWidth / imageData.width, maxHeight / imageData.height)
  if (resizeRatio === 1) return {data: imageData, width: maxWidth, height: maxHeight}

  ctx.canvas.height = maxHeight
  ctx.canvas.width = maxWidth

  ctx.clearRect(0, 0, maxWidth, maxHeight)

  ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height, 0, 0, maxWidth, maxHeight)
  return {data: ctx.canvas, width: maxWidth, height: maxHeight}
}
