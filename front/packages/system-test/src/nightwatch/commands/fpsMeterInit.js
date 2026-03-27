const FPSMeter = require('@hopara/fpsmeter')

exports.command = function({logUpdate = false, logStop = false} = {}, callback) {
  const api = this
  
  api.executeScript(init, [FPSMeter, logUpdate, logStop], callback).pause(200)

  return this // allows the command to be chained.
}

function init(FPSMeterClassStr, logUpdate, logStop) {
  // eslint-disable-next-line no-eval
  eval('window.FPSMeter = ' + FPSMeterClassStr)
  const meter = new FPSMeter({
    calculatePerMs: 50, // calculation window for FPS
    onUpdate: (update) => {
      // update.fps - FPS of last window (per defined calculatePerMs option)
      // update.avgfps - FPS average since start()
      // eslint-disable-next-line no-console
      if (logUpdate) console.log('fps', update.fps)
    },
    onStop: (reason) => {
      // reasons why FPSMeter can halt:
      // FPSMeter.stop() initiated by: user
      // FPSMeter.stop() initiated by: document visibilitychange event
      // FPSMeter.stop() initiated by: rAF timed out
      // FPSMeter.stop() initiated by: window blur event
      // eslint-disable-next-line no-console
      if (logStop) console.log('meter stopped:', reason)
    },
  })
  meter.start()
  window.meter = meter
}
