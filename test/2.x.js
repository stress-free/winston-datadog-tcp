const hostname = require('os').hostname()

const winstonDatadogTcp = require('../2.x')

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

exports.testRestoreConn = (test) => {
  test.expect(2)
  const fakeConn = {
    destroyed: true,
    write: (str, callback) => {
      test.equals(str, `FAKE_KEY ${JSON.stringify({
        status: 'info',
        message: `Hello ${JSON.stringify(['world'])}`,
        data: ['world'],
        ddtags: 'env:test',
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
      })}\n`)
      callback()
    }
  }
  const fakeCreateConnection = () => fakeConn
  const logObj = winstonDatadogTcp('FAKE_KEY', { env: 'test', })
  logObj.dd.conn = fakeConn
  logObj.dd.createConnection = fakeCreateConnection
  logObj.log('info', 'Hello', ['world'], () => {
    test.equals(fakeConn, logObj.dd.conn)
    test.done()
  })
}

exports.testWriteError = (test) => {
  test.expect(2)
  let writes = 0
  const fakeCreateConnection = () => {
    const fakeConn = {
      destroyed: writes === 1,
      write: (str, callback) => {
        writes++
        if (writes === 1) {
          fakeConn.destroyed = true
          return undefined
        }
        if (writes === 2) {
          test.equals(str, `FAKE_KEY ${JSON.stringify({
            status: 'info',
            message: `Hello ${JSON.stringify(['world'])}`,
            data: ['world'],
            ddtags: 'env:test',
            ddsource: '@cardash/winston-datadog-tcp',
            hostname,
          })}\n`)
        }
        if (writes === 3) {
          test.equals(str, `FAKE_KEY ${JSON.stringify({
            status: 'info',
            message: `Foo ${JSON.stringify(['bar'])}`,
            data: ['bar'],
            ddtags: 'env:test',
            ddsource: '@cardash/winston-datadog-tcp',
            hostname,
          })}\n`)
        }
        callback()
      }
    }
    return fakeConn
  }
  const logObj = winstonDatadogTcp('FAKE_KEY', { env: 'test', })
  logObj.dd.conn = fakeCreateConnection()
  logObj.dd.createConnection = fakeCreateConnection
  logObj.log('info', 'Hello', ['world'], () => {
    test.ok(false, 'This path should not be called')
    test.done()
  })
  logObj.log('info', 'Foo', ['bar'], () => {
    test.done()
  })
}
