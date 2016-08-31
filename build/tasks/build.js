/**
 * NOT IN USE. 
 * 
 * I played around with scripting the installer builder in an attempt
 * to make it behave more dynamicallyh, but it got too tedious. The build setup 
 * is using the electron-builder CLI and builder.json via NPM scripts instead of this file.
 */

'use strict'

const os = require('os')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const packager = require('electron-packager')
const del = require('del')
const builder = require('electron-builder').init()

const manifest = require('../../package.json')
const platform = argv.platform || os.platform() 

let config = {
  osx : {
    'title': manifest.productName,
    'background': './assets/osx/installer.png',
    'icon': './assets/osx/dmg-icon.icns',
    'icon-size': 128,
    'contents': [
      { 'x': 410, 'y': 220, 'type': 'link', 'path': '/Applications' },
      { 'x': 130, 'y': 220, 'type': 'file' },
    ]
  },
  win : {
    'title' : manifest.productName,
    'icon' : './assets/windows/icon.ico',
  }
}

if (platform === 'darwin') {
  platform = 'osx'

  Object.assign(config, {
    'background': './assets/osx/installer.png',
    'icon': './assets/osx/dmg-icon.icns',
    'icon-size': 128,
    'contents': [
      { 'x': 410, 'y': 220, 'type': 'link', 'path': '/Applications' },
      { 'x': 130, 'y': 220, 'type': 'file' }
    ]
  })
} else if (platform === 'win32') {
  let platform = 'win'

  Object.assign(config, {
    out: 'releases/windows',
    icon: 'assets/windows/icon.ico',
    arch: argv.arch || 'ia32',
    platform: 'win32',
  })
} else {
  throw new Error(`${platform} is unsupported.`)
}


function buildDMG (outputPath, appPath) {
  const appdmg = require('appdmg')
  const dmgName = `${_.getPackageName()}.dmg`

  // log('Building DMG...')

  let dmg = appdmg({
    basepath: path.join(__dirname, '../'),
    target: `releases/osx/${dmgName}`,
    specification: {
      title: 'Trip Report Database',
      icon: 'assets/osx/dmg-icon.icns',
      background: 'assets/osx/dmg-background.png',
      'icon-size': 128,
      contents: [
        { x: 410, y: 220, type: 'link', path: '/Applications' },
        { x: 130, y: 220, type: 'file', path: `${appPath}/${_.getAppName()}.app` }
      ]
    }
  })   

  dmg.on('progress', (info) => {
    if (info.type == 'step-begin') {
      log(`${info.title} (${info.current} of ${info.total})`, 'dmg')
    }
  })

  return new Promise((resolve, reject) => {
    dmg.on('finish', () => resolve())
    dmg.on('error', (err) => reject(err))
  })
}