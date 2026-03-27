const path = require('path')

module.exports = {
  'src_folders': ['tests/spec'],
  'custom_commands_path': path.resolve(__dirname, 'nightwatch/commands'),
  'custom_assertions_path': path.resolve(__dirname, 'nightwatch/assertions'),
  'skip_testcases_on_fail': false,
  'webdriver': {
    'start_process': true,
    'server_path': path.resolve(__dirname, '..', '..', '..', 'node_modules/.bin/chromedriver'),
    'port': 9515,
  },
 
  'test_settings': {
    'default': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'goog:chromeOptions': {
          'args': [
            '--disable-extensions',
            '--headless',
            '--no-sandbox',
            '--no-zygote',
            '--disable-dev-shm-usage',
            '--disable-infobars',
            `--user-data-dir=${path.resolve(__dirname, 'user-data')}`,
            'window-size=1280,800',
          ],
        },
      },
    },
    'debugger': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'goog:chromeOptions': {
          'args': [
            '--disable-extensions',
            'window-size=1280,800',
          ],
        },
      },
    },
  },
}
