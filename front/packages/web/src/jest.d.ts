/* eslint-disable no-unused-vars */
declare global {
  namespace jest {
    interface Matchers<R> {
      toVisualizeAs(expected: any): R
    }
  }
}

export {}
