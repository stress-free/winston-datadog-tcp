# @cardash/winston-datadog-tcp [![CircleCI](https://circleci.com/gh/cardash/winston-datadog-tcp/tree/master.svg?style=svg)](https://circleci.com/gh/cardash/winston-datadog-tcp/tree/master) [![Coverage Status](https://coveralls.io/repos/github/cardash/winston-datadog-tcp/badge.svg?branch=master)](https://coveralls.io/github/cardash/winston-datadog-tcp?branch=master)  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A Winston-compatible (3.x and 2.x) Datadog logger via TCP+SSL. No local file taking up space, no log rotation management.

## Install

`yarn add @cardash/winston-datadog-tcp`

## Usage

This library supports both Winston 3.x and 2.x, with 3.x being the default.

### Winston 3.x

Just provide the library your Datadog API Key and attach it as a Winston transport. Optionally add datadog tags to include in object notation. The `app` tag is also used to flag the service to Datadog for APM integration if present.

```js
const config = require('@cardash/config')
const WinstonDatadogTcp = require('@cardash/winston-datadog-tcp')
const winston = require('winston')

const logger = winston.createLogger({
  level: config.logLevel,
  transports: [
    new winston.transports.Console(),
    new WinstonDatadogTcp({
      apiKey: config.datadogKey,
      tags: {
        app: 'my-server',
        env: config.NODE_ENV,
      },
    }),
  ],
})

...
```

### Winston 2.x

Just provide the library your Datadog API Key and attach it as a Winston transport. Optionally add datadog tags to include in object notation. The `app` tag is also used to flag the service to Datadog for APM integration if present.

```js
const config = require('@cardash/config')
const winstonDatadogTcp = require('@cardash/winston-datadog-tcp/2.x')
const winston = require('winston')

const logger = new winston.Logger({
  level: config.logLevel,
  transports: [
    new winston.transports.Console(),
    winstonDatadogTcp(config.datadogKey, {
      app: 'my-server',
      env: config.NODE_ENV,
    }),
  ],
})

...
```

## License (MIT)

Copyright 2019 CarDash, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
