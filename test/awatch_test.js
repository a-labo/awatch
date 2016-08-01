/**
 * Test case for awatch.
 * Runs with mocha.
 */
'use strict'

const awatch = require('../lib/awatch.js')
const assert = require('assert')
const co = require('co')
const asleep = require('asleep')
const writeout = require('writeout')

describe('awatch', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Awatch', () => co(function * () {
    let filename = `${__dirname}/../tmp/foo/bar.txt`
    yield writeout(filename, 'hoge', { mkdirp: true, force: true })
    let changed = {}
    let close = yield awatch(`${__dirname}/../tmp/*`, (event, filename) => {
      changed[ `${event}:${filename}` ] = { event, filename }
    })
    yield writeout(filename, 'hoge2', { mkdirp: true, force: true })

    yield asleep(300)
    assert.ok(changed, 'rename:bar.txt')
    yield close()
  }))
})

/* global describe, before, after, it */
