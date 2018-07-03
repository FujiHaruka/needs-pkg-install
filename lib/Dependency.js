class Dependency {
  constructor ({name, parent}) {
    this.name = name
    this.parent = parent
  }

  get pkgJsonFilePath () {
    let path = `node_modules/${this.name}/package.json`
    let parent = this.parent
    while (parent) {
      path = `node_modules/${parent.name}/${path}`
      parent = parent.parent
    }
    return path
  }

  get pkgLockPath () {
    let path = ['dependencies', this.name]
    let parent = this.parent
    while (parent) {
      path = ['dependencies', parent.name, ...path]
      parent = parent.parent
    }
    return path
  }
}

module.exports = Dependency
