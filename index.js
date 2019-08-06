const BaseTransport = require('winston-transport')
const winstonDatadogTcp = require('./2.x')

class WinstonDatadogTcp extends BaseTransport {
  constructor(opts) {
    super(opts)
    const { apiKey, tags, } = opts
    this.coreLogger = winstonDatadogTcp(apiKey, tags)
  }

  log(info, callback) {
    const {
      level,
      message,
      ...data
    } = info
    this.coreLogger.log(level, message, data, callback)
  }
}

module.exports = WinstonDatadogTcp
