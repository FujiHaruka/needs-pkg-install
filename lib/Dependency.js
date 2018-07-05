class Dependency {
  constructor ({name, parent}) {
    this.name = name
    this.parent = parent
  }

  get pkgJsonFilePath () {
    return this.modulePath + '/package.json'
  }

  get modulePath () {
    return 'node_modules/' + this.treePath.join('/node_modules/')
  }

  get pkgLockPath () {
    return this.treePath
      .map((name) => ['dependencies', name])
      .reduce((prev, path) => prev.concat(path), [])
  }

  get treePath () {
    const path = [this.name]
    let parent = this.parent
    while (parent) {
      path.unshift(parent.name)
      parent = parent.parent
    }
    return path
  }
}

module.exports = Dependency
