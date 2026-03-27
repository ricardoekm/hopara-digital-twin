import {buffers, END, eventChannel} from 'redux-saga'

export function createUploadFunctionChannel<Fn extends(...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>) {
  return eventChannel((emitter) => {
    fn(...args, (p) => emitter({ progress: p.progress }))
      .then((response) => {
        setTimeout(() => {
          emitter({ ...response.data, success: true, processing: response.status === 202 })
          emitter(END)
        }, 200)
      })
      .catch((err) => {
        emitter({ err })
        emitter(END)
    })
    
    return () => ({})
  }, buffers.sliding(2) as any)
}
