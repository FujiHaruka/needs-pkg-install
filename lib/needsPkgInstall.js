const {join} = require('path')
const {readJson, compareDependency} = require('./helpers')
const PackageLock = require('./PackageLock')
const NodeModules = require('./NodeModules')

/**
 * Teach the project needs `npm install` or not.
 * @param {String} path - project path
 * @param {Object} [options]
 * @param {Boolean} [options.strict=false]
 * @param {Array<String>} [options.ignore=[]]
 * @returns {Promise<Boolean>}
 */
async function needsPkgInstall (path, options = {}) {
  const {
    strict = false,
    ignore = [],
  } = options

  const pkgLockJson = await readJson(join(path, 'package-lock.json'))
  const pkgLock = new PackageLock(pkgLockJson)
  const nodeModules = new NodeModules(path, ignore)
  await nodeModules.load()

  // package-lock.json にあるモジュールが node_modules にあるか
  for (const dependency of pkgLock.allDependencies) {
    const {equals, detail} = await compareDependency({
      dependency,
      nodeModules,
      pkgLock,
    })
    if (!equals) {
      return true
    }
  }

  if (!strict) {
    return false
  }

  // 逆に、node_modules にあるモジュールが package-lock.json にあるか
  for (const dependency of nodeModules.allDependencies) {
    const {equals, detail} = await compareDependency({
      dependency,
      nodeModules,
      pkgLock,
    })
    if (!equals) {
      return true
    }
  }

  return false
}

module.exports = needsPkgInstall
