const hostname = require('os').hostname()

const WinstonDatadogTcp = require('../')

exports.testLogging = (test) => {
  test.expect(1)
  const fakeConn = {
    write: (str, cb) => {
      test.equals(str, `FAKE_KEY ${JSON.stringify({
        status: 'info',
        message: `Hello ${JSON.stringify({ meta: 'world', })}`,
        data: { meta: 'world', },
        ddtags: 'env:test,app:winston-datadog-tcp',
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
        service: 'winston-datadog-tcp',
      })}\n`)
      cb()
    },
  }

  const logObj = new WinstonDatadogTcp({
    apiKey: 'FAKE_KEY',
    tags: {
      env: 'test',
      app: 'winston-datadog-tcp',
    },
  })

  logObj.coreLogger.dd.conn = fakeConn
  logObj.log({
    level: 'info',
    message: 'Hello',
    meta: 'world',
  }, () => test.done())
}

/* Remaining tests are in the 2.x test since the actual TCP handling logic is there */