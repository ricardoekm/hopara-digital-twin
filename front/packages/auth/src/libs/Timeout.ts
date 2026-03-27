export const asyncTimeout = (ms: number): Promise<any> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
