/* eslint-disable */
class SilentReporter {
  onRunComplete(_, results) {
    if (results.numFailedTests > 0) {
      console.error('Tests failed')
    } else {
      console.log(`Success: ${results.numPassedTests} test(s)`)
    }
  }

  onTestResult(test, testResult) {
    if (testResult.numFailingTests > 0 || testResult.failureMessage) {
      console.error(`Test file failed: ${test.path}`)
      testResult.testResults.forEach((result) => {
        if (result.status === 'failed') {
          console.error(`  Test failed: ${result.fullName}`)
        }
      })
      console.error(testResult.failureMessage)
    }
  }
}

module.exports = SilentReporter;
