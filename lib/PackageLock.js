const Dependency = require('./Dependency')
const objPath = require('object-path')

class PackageLock {
  constructor (json) {
    this.json = json
  }

  has (dependency) {
    return Boolean(objPath.get(this.json, dependency.pkgLockPath))
  }

  versionOf (dependency) {
    return objPath.get(this.json, dependency.pkgLockPath.concat('version'))
  }

  isOptional (dependency) {
    return objPath.get(this.json, dependency.pkgLockPath.concat('optional'))
  }

  get allDependencies () {
    const parents = Object.keys(this.json.dependencies)
      .map((name) => new Dependency({ name }))
    let dependencies = []
    for (const parent of parents) {
      const children = this._childrenOf(parent)
      dependencies = dependencies.concat(children)
    }
    return dependencies
  }

  // 自分自身も含む
  _childrenOf (dependency) {
    const depObj = objPath.get(this.json, dependency.pkgLockPath)
    let children = [dependency]
    if (!depObj) {
      throw new Error(`Not found dependency in package-lock.json: ${dependency.PackageLock}`)
    }
    if (depObj && depObj.dependencies) {
      for (const name of Object.keys(depObj.dependencies)) {
        const child = new Dependency({ name, parent: dependency })
        children = children.concat(this._childrenOf(child))
      }
    }
    return children
  }
}

module.exports = PackageLock
