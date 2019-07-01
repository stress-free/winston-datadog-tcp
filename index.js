const tls = require('tls')
const host = require('os').hostname

const createPersistentConnection = () => {
  let conn = tls.connect({
    host: 'intake.logs.datadoghq.com',
    port: 10516,
  })
  conn.setKeepAlive(true)
  const result = {
    conn,
  }
  conn.on('end', () => {
    result.conn = createPersistentConnection().conn
  })

  return result
}

const winstonDatadogTcp = (apiKey, tags) => {
  const dd = createPersistentConnection()
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
        host,
        service: tags.app || undefined,
      }
      dd.conn.write(`${apiKey} ${JSON.stringify(record)}\n`, callback)
    }
  }
}

module.exports = winstonDatadogTcp