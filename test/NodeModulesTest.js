const {equal, ok} = require('assert')
const NodeModules = require('../lib/NodeModules')
const Dependency = require('../lib/Dependency')
const PackageLock = require('../lib/PackageLock')
const {join} = require('path')
const {readJson} = require('../lib/helpers')

describe('NodeModules', () => {
  it('Works', async () => {
    const projectDir = join(__dirname, '../misc/test-pkg2')
    const modules = new NodeModules(projectDir)
    await modules.load()

    const pkgLockJson = await readJson(join(projectDir, 'package-lock.json'))
    const pkgLock = new PackageLock(pkgLockJson)

    equal(modules.allDependencies.length, pkgLock.allDependencies.length)

    const express = new Dependency({name: 'express'})
    ok(modules.has(express))
    equal(
      await modules.versionOf(express),
      pkgLock.versionOf(express)
    )

    const babelCore = new Dependency({name: '@babel/core'})
    ok(modules.has(babelCore))
    equal(
      await modules.versionOf(babelCore),
      pkgLock.versionOf(babelCore)
    )
  })
})

/* global describe, it */
