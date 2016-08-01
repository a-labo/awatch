/**
 * @function watchFiles to change
 * @param {string} pattern - Filename patterns
 * @param {function} handler - Change handler
 * @param {Object} [options={}] - Optional settings
 * @param {string} [options.cwd] - Current working directory
 * @param {string} [options.ignore] - Glob patterns to ignore
 * @param {number} [options.interval=100] - Watch fire interval
 * @param {function} [options.onError=(err) => console.error(err)] - Error handler
 * @returns {Promise}
 */
'use strict'

const co = require('co')
const fs = require('fs')
const path = require('path')
const aglob = require('aglob')
const defaults = require('defaults')
const debug = require('debug')('a:watch')
const asleep = require('asleep')

/** @lends awatch */
function awatch (pattern, handler, options = {}) {
  let { cwd, ignore, interval, onError } = defaults(options, {
    cwd: process.cwd(),
    ignore: [],
    interval: 100,
    onError: (err) => console.error(err)
  })
  return co(function * () {
    let filenames = yield aglob(pattern, { cwd, ignore })
    let changed = {}
    let watchers = {}
    let watch = (watched) => fs.watch(watched, (event, filename) => {
      let name = [ event, filename ].join(':')
      changed[ name ] = { event, filename, watched }
    })

    let timer = setInterval(() => co(function * () {
      for (let name of Object.keys(changed)) {
        let { event, filename, watched } = changed[ name ]
        yield Promise.resolve(handler(event, filename))
        delete changed[ name ]
        if (watchers[ watched ]) {
          watchers[ watched ].close()
        }
        yield asleep(0)
        watchers[ watched ] = watch(watched)
        yield asleep(0)
      }
    }).catch(onError), interval).unref()
    debug('Filenames', filenames)
    for (let filename of filenames) {
      watchers[ filename ] = watch(path.resolve(cwd, filename))
    }
    function close () {
      return co(function * () {
        clearInterval(timer)
        for (let filename of Object.keys(watchers)) {
          let watcher = watchers[ filename ]
          watcher.close()
        }
      })
    }

    return Object.assign(close, { close, filenames, timer })
  })
}

module.exports = awatch
