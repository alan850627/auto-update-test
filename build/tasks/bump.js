'use strict'

const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const paths = {
  package: path.join(__dirname, '../../package.json'),
}

function read (file) {
  return JSON.parse(fs.readFileSync(file))
}

function write (file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2))
}

const packageConfig = read(paths.package)
// const builderConfig = read(paths.builder)


let version = packageConfig.version.split('.')

version.push(parseInt(version.pop()) + 1)

let newVersion = version.join('.')

packageConfig.version             = newVersion
packageConfig.builder.win.version = newVersion 
packageConfig.builder.osx.version = newVersion

write(paths.package, packageConfig)

// exec(`git add package.json && git commit -m 'Bump version to ${newVersion}'`)
