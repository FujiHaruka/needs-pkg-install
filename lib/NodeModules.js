const {join} = require('path')
const {readJson, readdirAsync, isDirAsync} = require('./helpers')
const Dependency = require('./Dependency')

class NodeModules {
  constructor (projectDir, excludes = []) {
    this.projectDir = projectDir
    this.excludes = []
    this.allDependencies = []
  }

  async load () {
    // const installedVersion = (await readJson(join(path, dependency.pkgJsonFilePath))).version
    let parentNames = await readdirAsync(join(this.projectDir, 'node_modules'))
    parentNames = this._filter(parentNames)

    const dependencies = parentNames.map((name) => new Dependency({ name }))
    for (const dependency of dependencies) {
      const children = await this._childenOf(dependency)
      this.allDependencies = this.allDependencies.concat(children)
    }
  }

  has (dependency) {
    // FIXME: スコープドモジュールが無理じゃん
    return this.allDependencies.some(({modulePath}) => modulePath === dependency.modulePath)
  }

  async versionOf (dependency) {
    const pkg = await readJson(join(this.projectDir, dependency.pkgJsonFilePath))
    return pkg.version
  }

  _filter (names) {
    let filtered = names.filter((name) => !name.startsWith('.'))
    for (const exclude of this.excludes) {
      filtered = filtered.filter((name) => name === exclude)
    }
    return filtered
  }

  // 自分自身も含む
  async _childenOf (dependency) {
    let children = [dependency]
    const childrenModuleDir = join(this.projectDir, dependency.modulePath, 'node_modules')
    const hasChildren = await isDirAsync(childrenModuleDir)
    if (hasChildren) {
      let names = await readdirAsync(childrenModuleDir)
      names = this._filter(names)
      const dependencies = names.map((name) => new Dependency({ name, parent: dependency }))
      for (const dep of dependencies) {
        children = children.concat(await this._childenOf(dep))
      }
    }
    return children
  }
}

module.exports = NodeModules
