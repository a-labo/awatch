'use strict'

const awatch = require('awatch')
const co = require('co')

co(function * () {

  let close = yield awatch('src/**/*.jsx', (event, filename) => {
    /* ... */
  })
  /* ... */
  process.on('beforeExit', () => {
    close()
  })
}).catch((err) => console.error(err))
