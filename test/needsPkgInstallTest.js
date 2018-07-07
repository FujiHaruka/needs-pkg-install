const {ok} = require('assert')
const needsPkgInstall = require('../lib')
const {join} = require('path')

describe('needsPkgInstall', () => {
  it('test-pkg1', async () => {
    const project = 'test-pkg1'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)

    const stillNo = await needsPkgInstall(projectDir, { strict: true })
    ok(!stillNo)
  })

  it('test-pkg2', async () => {
    const project = 'test-pkg2'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)

    const stillNo = await needsPkgInstall(projectDir, { strict: true })
    ok(!stillNo)
  })

  it('test-pkg3', async () => {
    const project = 'test-pkg3'
    const projectDir = join(__dirname, '../misc', project)
    const no = await needsPkgInstall(projectDir)
    ok(!no)

    const butYes = await needsPkgInstall(projectDir, { strict: true })
    ok(butYes)

    const thenNo = await needsPkgInstall(projectDir, { strict: true, ignore: ['ignored'] })
    ok(!thenNo)
  })
})

/* global describe, it */
