# needs-pkg-install

You can know if you shold npm install.

`needs-pkg-install` compares dependency versions in `package-lock.json` and actually installed library versions in `node_modules` directory, and returns `true` if found differences.

## Instalation

```
$ npm install needs-pkg-install
```

## Usage

```js
const needsPkgInstall = require('needs-pkg-install')

const packageDirectory = '.'
needsPkgInstall(packageDirectory).then(console.log)
// true or false
```
