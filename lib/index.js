/**
 * 
 * @module awatch
 * @version 1.0.8
 */

'use strict'

const awatch = require('./awatch')

let lib = awatch.bind(this)
Object.assign(lib, {
  awatch
})

module.exports = lib
