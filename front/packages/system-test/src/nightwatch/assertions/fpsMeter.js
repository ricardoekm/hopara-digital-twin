const d3 = require('d3')

exports.assertion = function(definition = {mean: 30}) {
  this.formatMessage = function() {
    return {
      message: 'Testing FPS',
      args: this.expected,
    }
  }

  this.expected = function() {
    if (!this.errors) return
    return Object.keys(this.errors).map((key) => {
      return `${key}: ${definition[key]}`
    })
  }

  this.actual = function() {
    return Object.keys(this.errors).reduce((message, key) => {
      const separator = !message ? '' : ', '
      return `${message}${separator}${key}: ${this.errors[key]}`
    }, '')
  }

  this.getMetricErrors = function(metrics, definition) {
    const metricErrors = {}

    for (const key in definition) {
      if (metrics[key] === undefined) continue
      if (definition[key] > metrics[key]) {
        metricErrors[key] = metrics[key]
      }
    }

    return metricErrors
  }

  this.evaluate = function(result) {
    const metrics = {
      percentile10: d3.quantile(result, 0.1),
      percentile20: d3.quantile(result, 0.2),
      percentile30: d3.quantile(result, 0.3),
      percentile40: d3.quantile(result, 0.4),
      percentile50: d3.quantile(result, 0.5),
      percentile60: d3.quantile(result, 0.6),
      percentile70: d3.quantile(result, 0.7),
      percentile80: d3.quantile(result, 0.8),
      percentile90: d3.quantile(result, 0.9),
      percentile95: d3.quantile(result, 0.95),
      mean: d3.mean(result),
      median: d3.median(result),
      max: d3.max(result),
      min: d3.min(result),
    }

    /* eslint-disable no-console */
    const definitionResults = Object.keys(definition).reduce(((str, def, i, arr) => {
      const sep = i === arr.length ? ',' : ''
      return `${str} ${def} = ${metrics[def]}${sep}`
    }), '')

    console.info(`PERF:${definitionResults}`)

    this.errors = this.getMetricErrors(metrics, definition)
    return !Object.keys(this.errors).length
  }

  this.value = function(result) {
    return result.value
  }

  this.failure = function(result) {
    return !result || !result.value || !result.value.length
  }

  this.command = async function(callback) {
    this.api.executeScript(this.summarize, [], callback)
  }

  this.summarize = function() {
    if (!window.meter) return new Error('meter is not defined')
    window.meter.stop()
    // collect meter fps windows
    const values = window.meter.fpsWindows.slice(-50)
    values.reverse()
    return values
  }
}
