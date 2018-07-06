const {ok} = require('assert')
const needsPkgInstall = require('../lib')
const {join} = require('path')

describe('needsPkgInstall', () => {
  it('Works', async () => {
    const projectDir = join(__dirname, '../misc/test-pkg')
    const not = await needsPkgInstall(projectDir)
    ok(!not)

    const stillNot = await needsPkgInstall(projectDir, { strict: true })
    ok(!stillNot)
  })
})

/* global describe, it */
