const tls = require('tls')
const hostname = require('os').hostname

const createConnection = () => {
  let conn = tls.connect({
    host: 'intake.logs.datadoghq.com',
    port: 10516,
  })
  conn.setEncoding('utf8')
  conn.setKeepAlive(true)
  conn.unref()
  const result = {
    conn,
  }

  return result
}

const winstonDatadogTcp = (apiKey, tags) => {
  const dd = createConnection()
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
      if (dd.conn.destroyed) dd.conn = createConnection().conn
      dd.conn.write(`${apiKey} ${JSON.stringify(record)}\n`, callback)
    }
  }
}

module.exports = winstonDatadogTcp