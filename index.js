const tls = require('tls')
const hostname = require('os').hostname

const winstonDatadogTcp = (apiKey, tags) => {
  const conn = tls.connect({
    host: 'intake.logs.datadoghq.com',
    port: 10516,
  })
  conn.setKeepAlive(true)
  const ddtags = Object.keys(tags).map(t => `${t}:${tags[t]}`).join(',')
  return {
    conn,
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
      conn.write(`${apiKey} ${JSON.stringify(record)}\n`, callback)
    }
  }
}

module.exports = winstonDatadogTcp