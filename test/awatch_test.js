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
const rimraf = require('rimraf')
const asleep = require('asleep')
const writeout = require('writeout')

describe('awatch', function () {
  this.timeout(4000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Awatch', () => co(function * () {
    yield new Promise((resolve, reject) =>
      rimraf(`${__dirname}/../tmp/foo`, (err) =>
        err ? reject(err) : resolve())
    )
    let filename = `${__dirname}/../tmp/foo/bar.txt`
    yield writeout(filename, 'hoge', { mkdirp: true, force: true })
    let changed = {}
    let close = yield awatch(`${__dirname}/../tmp/*`, (event, filename) => {
      changed[ filename ] = (changed[ filename ] || 0) + 1
    }, { interval: 5 })
    for (let i = 0; i < 10; i++) {
      yield writeout(filename, 'hoge2')
      yield asleep(20)
      assert.equal(changed[ path.basename(filename) ], 1)
      yield writeout(filename, 'hoge3')
      yield asleep(20)
      assert.equal(changed[ path.basename(filename) ], 2)
      yield asleep(20)
      fs.renameSync(filename, `${filename}.bk`)
      yield writeout(filename, 'hoge4')
      yield asleep(20)
      assert.ok(changed[ path.basename(filename) ])
      yield asleep(20)
      changed = {}
    }
    yield close()
  }))
})

/* global describe, before, after, it */
