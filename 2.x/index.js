const tls = require('tls')
const hostname = require('os').hostname()
const safeStringify = require('fast-safe-stringify')

const createConnection = () => {
  const conn = tls.connect({
    host: 'intake.logs.datadoghq.com',
    port: 10516,
  })
  conn.setEncoding('utf8')
  conn.setKeepAlive(true)
  conn.unref()
  conn.on('error', () => { conn.destroyed = true })

  return conn
}

const winstonDatadogTcp = (apiKey, tags) => {
  const dd = {
    createConnection,
    conn: createConnection(),
    queuedMessage: undefined,
  }
  const ddtags = Object.keys(tags).map(t => `${t}:${tags[t]}`).join(',')
  return {
    dd,
    log: (loglevel, text, data, callback) => {
      const record = {
        status: loglevel,
        message: `${text} ${safeStringify(data)}`,
        data,
        ddtags,
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
        service: tags.app || undefined,
      }
      if (dd.conn.destroyed) {
        dd.conn = dd.createConnection()
        if (dd.queuedMessage) return dd.conn.write(dd.queuedMessage, () => {
          dd.queuedMessage = `${apiKey} ${safeStringify(record)}\n`
          dd.conn.write(dd.queuedMessage, () => {
            dd.queuedMessage = undefined
            callback()
          })
        })
      }
      dd.queuedMessage = `${apiKey} ${safeStringify(record)}\n`
      dd.conn.write(dd.queuedMessage, () => {
        dd.queuedMessage = undefined
        callback()
      })
    }
  }
}

module.exports = winstonDatadogTcp