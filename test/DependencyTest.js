const {equal, deepEqual} = require('assert')
const Dependency = require('../lib/Dependency')

describe('Dependency', () => {
  it('Works', () => {
    const d1 = new Dependency({name: 'one'})
    const d2 = new Dependency({name: 'two', parent: d1})
    const d3 = new Dependency({name: 'three', parent: d2})

    equal(d3.pkgJsonFilePath, 'node_modules/one/node_modules/two/node_modules/three/package.json')
    deepEqual(d3.pkgLockPath, [
      'dependencies',
      'one',
      'dependencies',
      'two',
      'dependencies',
      'three'
    ])
  })
})

/* global describe, it */
