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

const fs = require('fs')
const path = require('path')
const aglob = require('aglob')
const debug = require('debug')('a:watch')

/** @lends awatch */
async function awatch (pattern, handler, options = {}) {
  const {
    cwd = process.cwd(),
    ignore = [],
    interval = 100,
    onError = (err) => console.error(err)
  } = options
  const filenames = await aglob(pattern, {cwd, ignore})
  const changed = {}
  const watchers = {}
  const watch = (watched) => fs.watch(watched, (event, filename) => {
    fs.stat(watched, (err, state) => {
      const isDir = !err && state && state.isDirectory()
      const detected = path.resolve(isDir ? path.resolve(watched, filename) : watched)
      const name = [event, detected].join(':')
      changed[name] = {event, filename, detected, watched}
    })
  })

  const timer = setInterval(async () => {
    for (const name of Object.keys(changed)) {
      if (!changed[name]) {
        continue
      }
      const {event, watched, detected} = changed[name]
      delete changed[name]
      await Promise.resolve(handler(event, detected)).catch(onError)
      const oldWatcher = watchers[watched]
      watchers[watched] = watch(watched)
      if (oldWatcher) {
        oldWatcher.close()
      }
    }
  }, interval).unref()
  debug('Filenames', filenames)
  for (const filename of filenames) {
    watchers[filename] = watch(path.resolve(cwd, filename))
  }

  async function close () {
    clearInterval(timer)
    for (const filename of Object.keys(watchers)) {
      const watcher = watchers[filename]
      watcher.close()
    }
  }

  return Object.assign(close, {close, filenames, timer})
}

module.exports = awatch
