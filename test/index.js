const hostname = require('os').hostname()

const winstonDatadogTcp = require('..')

exports.testLogging = (test) => {
  test.expect(1)
  const fakeConn = {
    write: (str, cb) => {
      test.equals(str, `FAKE_KEY ${JSON.stringify({
        status: 'info',
        message: `Hello ${JSON.stringify(['world'])}`,
        data: ['world'],
        ddtags: 'env:test,app:winston-datadog-tcp',
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
        service: 'winston-datadog-tcp',
      })}\n`)
      cb()
    },
  }

  const logObj = winstonDatadogTcp('FAKE_KEY', { env: 'test', app: 'winston-datadog-tcp', })
  logObj.dd.conn = fakeConn
  logObj.log('info', 'Hello', ['world'], () => test.done())
}

exports.testNoService = (test) => {
  test.expect(1)
  const fakeConn = {
    write: (str, cb) => {
      test.equals(str, `FAKE_KEY ${JSON.stringify({
        status: 'info',
        message: `Hello ${JSON.stringify(['world'])}`,
        data: ['world'],
        ddtags: 'env:test',
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
      })}\n`)
      cb()
    },
  }

  const logObj = winstonDatadogTcp('FAKE_KEY', { env: 'test', })
  logObj.dd.conn = fakeConn
  logObj.log('info', 'Hello', ['world'], () => test.done())
}

// This test will fire a rejected message at Datadog. TODO: Make `createConnection` replaceable
exports.testRestoreConn = (test) => {
  test.expect(1)
  const fakeConn = {
    destroyed: true
  }
  const logObj = winstonDatadogTcp('FAKE_KEY', { env: 'test', })
  logObj.dd.conn = fakeConn
  setTimeout(() => {}, 300) // Since the conn is unref'd, add some lag to let it execute
  logObj.log('info', 'Hello', ['world'], () => {
    test.equals(true, logObj.dd.conn instanceof require('tls').TLSSocket)
    test.done()
  })
}
