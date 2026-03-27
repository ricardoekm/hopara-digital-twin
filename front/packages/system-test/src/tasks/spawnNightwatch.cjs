const {spawn} = require('child_process')

const getFilterArgv = () => {
  return process.argv.filter((arg) => {
    return arg.startsWith('-f=') || arg.startsWith('--filter=')
  }).join(' ')
}

const getConfArgv = () => {
  return process.argv.filter((arg) => {
    return arg.startsWith('-c=') || arg.startsWith('--config=')
  }).join(' ')
}

const getEnvArgv = () => {
  return process.argv.filter((arg) => {
    return arg.startsWith('--env=')
  }).join(' ')
}

module.exports = function(server) {
  const args = ['nightwatch']

  if (getFilterArgv()) {
    args.push(getFilterArgv())
  }

  if (getEnvArgv()) {
    args.push(getEnvArgv())
  }

  if (getConfArgv()) {
    args.push(getConfArgv())
  }
  
  const test = spawn('yarn', args)
  test.stdout.on('data', (data) => {
    // eslint-disable-next-line no-console
    console.log(`${data}`)
  })

  test.stderr.on('data', (data) => {
    // eslint-disable-next-line no-console
    console.log(`${data}`)
  })

  test.on('close', (code) => {
    server.close(code)
    process.exit(code)
  })

  test.on('exit', (code) => {
    server.close(code)
    process.exit(code)
  })
}
