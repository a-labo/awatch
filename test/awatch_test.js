/**
 * Test case for awatch.
 * Runs with mocha.
 */
'use strict'

const awatch = require('../lib/awatch.js')
const assert = require('assert')
const path = require('path')
const fs = require('fs')
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
      changed[ filename ] = (changed[ filename ] || 0) + 1
    }, { interval: 10 })
    yield writeout(filename, 'hoge2')
    yield asleep(100)
    assert.equal(changed[ path.basename(filename) ], 1)
    yield writeout(filename, 'hoge3')
    yield asleep(100)
    assert.equal(changed[ path.basename(filename) ], 2)
    yield asleep(100)
    fs.renameSync(filename, `${filename}.bk`)
    yield writeout(filename, 'hoge4')
    yield asleep(100)
    assert.equal(changed[ path.basename(filename) ], 3)
    yield close()
  }))
})

/* global describe, before, after, it */
