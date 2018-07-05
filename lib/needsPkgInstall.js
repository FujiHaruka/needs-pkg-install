const {join} = require('path')
const {readJson} = require('./helpers')
const PackageLock = require('./PackageLock')

async function needsPkgInstall (path) {
  const pkgLockJson = await readJson(join(path, 'package-lock.json'))

  const pkgLock = new PackageLock(pkgLockJson)
  // const nodeModules = new NodeModules()

  for (const dependency of pkgLock.allDependencies) {
    const versionExpected = pkgLock.versionOf(dependency)
    if (versionExpected.startsWith('github:')) {
      continue
    }
    const installedVersion = (await readJson(join(path, dependency.pkgJsonFilePath))).version
    if (versionExpected !== installedVersion) {
      return true
    }
  }
  return false
}

module.exports = needsPkgInstall
