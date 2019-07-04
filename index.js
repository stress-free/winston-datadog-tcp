const tls = require('tls')
const hostname = require('os').hostname()

const createConnection = () => {
  const conn = tls.connect({
    host: 'intake.logs.datadoghq.com',
    port: 10516,
  })
  conn.setEncoding('utf8')
  conn.setKeepAlive(true)
  conn.unref()

  return conn
}

const winstonDatadogTcp = (apiKey, tags) => {
  const dd = {
    createConnection,
    conn: createConnection(),
  }
  const ddtags = Object.keys(tags).map(t => `${t}:${tags[t]}`).join(',')
  return {
    dd,
    log: (loglevel, text, data, callback) => {
      const record = {
        status: loglevel,
        message: `${text} ${JSON.stringify(data)}`,
        data,
        ddtags,
        ddsource: '@cardash/winston-datadog-tcp',
        hostname,
        service: tags.app || undefined,
      }
      if (dd.conn.destroyed) dd.conn = dd.createConnection()
      dd.conn.write(`${apiKey} ${JSON.stringify(record)}\n`, callback)
    }
  }
}

module.exports = winstonDatadogTcp