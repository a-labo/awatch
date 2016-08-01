/**
 * Async file watcher
 * @module awatch
 */

'use strict'

let d = (module) => module.default || module

module.exports = {
  get awatch () { return d(require('./awatch')) }
}
