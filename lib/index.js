/**
 * 
 * @module awatch
 * @version 2.0.1
 */

'use strict'

const awatch = require('./awatch')

let lib = awatch.bind(this)
Object.assign(lib, {
  awatch
})

module.exports = lib
