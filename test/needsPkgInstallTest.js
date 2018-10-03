const {ok} = require('assert')
const needsPkgInstall = require('../lib')
const {join} = require('path')

describe('needsPkgInstall', () => {
  it('test-pkg1', async () => {
    const project = 'test-pkg1'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)

    const {needs} = await needsPkgInstall(projectDir, { verbose: true })
    ok(!needs)
  })

  it('test-pkg2', async () => {
    const project = 'test-pkg2'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)

    const {needs} = await needsPkgInstall(projectDir, { verbose: true })
    ok(!needs)
  })

  it('test-pkg3', async () => {
    const project = 'test-pkg3'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)
  })

  it('test-pkg4', async () => {
    const project = 'test-pkg4'
    const projectDir = join(__dirname, '../misc', project)
    const yes = await needsPkgInstall(projectDir)
    ok(yes)

    const {needs, detail} = await needsPkgInstall(projectDir, { verbose: true })
    ok(needs)
    ok(detail['node_modules/color'])
  })
})

/* global describe, it */
