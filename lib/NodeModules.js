const {join} = require('path')
const {readJson, readdirAsync, isDirAsync} = require('./helpers')
const Dependency = require('./Dependency')

class NodeModules {
  constructor (projectDir, ignore = []) {
    this.projectDir = projectDir
    this.ignore = ignore
    this.allDependencies = []
  }

  async load () {
    let parentNames = []
    try {
      parentNames = await readdirAsync(join(this.projectDir, 'node_modules'))
    } catch (err) {
      console.error(`[needs-pkg-install] Not found node_modules`)
      console.error(err.message)
    }
    parentNames = this._filter(parentNames)
    parentNames = await this._extractScoped(parentNames)

    const dependencies = parentNames.map((name) => new Dependency({ name }))
    for (const dependency of dependencies) {
      const children = await this._childenOf(dependency)
      this.allDependencies = this.allDependencies.concat(children)
    }
  }

  has (dependency) {
    return this.allDependencies.some(({modulePath}) => modulePath === dependency.modulePath)
  }

  async versionOf (dependency) {
    if (!this.has(dependency)) {
      return false
    }
    const pkg = await readJson(join(this.projectDir, dependency.pkgJsonFilePath))
    return pkg.version
  }

  _filter (names) {
    // '.bin' とかは不要
    let filtered = names.filter((name) => !name.startsWith('.'))
    for (const ignore of this.ignore) {
      filtered = filtered.filter((name) => name !== ignore)
    }
    return filtered
  }

  // scoped module を展開する
  async _extractScoped (names) {
    let extracted = []
    for (const name of names) {
      if (name.startsWith('@')) {
        const scopedNames = (await readdirAsync(join(this.projectDir, 'node_modules', name)))
          .map((mod) => `${name}/${mod}`)
        extracted = extracted.concat(scopedNames)
      } else {
        extracted.push(name)
      }
    }
    return extracted
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
