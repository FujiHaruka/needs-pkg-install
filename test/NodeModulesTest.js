const {equal, ok} = require('assert')
const NodeModules = require('../lib/NodeModules')
const Dependency = require('../lib/Dependency')
const {join} = require('path')

describe('NodeModules', () => {
  it('Works', async () => {
    const projectDir = join(__dirname, '../misc/test-pkg')
    const modules = new NodeModules(projectDir)
    await modules.load()

    equal(modules.allDependencies.length, 56)

    const express = new Dependency({name: 'express'})
    ok(modules.has(express))
    equal(await modules.versionOf(express), '4.16.3')
  })
})

/* global describe, it */
