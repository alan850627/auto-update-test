const electron = require('electron')
const fs = require('fs')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

writeToFile('SessionStarted')

// Handle electron-squrrel events
const autoUpdater = require('auto-updater')
const appVersion = require('./package.json').version
const os = require('os').platform()
var updateFeed = 'http://localhost:4000/RELEASES'

if (process.env.NODE_ENV !== 'development') {
  updateFeed = os === 'darwin' ?
    'MAC-RELEASES-URL-HERE' :
    'http://localhost:4000/RELEASES';
}

autoUpdater.setFeedUrl(updateFeed)
autoUpdater.checkForUpdates()
autoUpdater.on('error', (err) => {
  writeToFile(msg)
})
autoUpdater.on('checking-for-update', () => {
  writeToFile('checking-for-update')
})
autoUpdater.on('update-available', () => {
  writeToFile('update-available')
})
autoUpdater.on('update-not-available', () => {
  writeToFile('update-not-available')
})
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
  writeToFile('update-downloaded')
  autoUpdater.quitAndInstall()
})

// ///////////////////////////////////////////////////////////
var path = require('path')
var spawn = require('child_process').spawn
var debug = require('debug')('electron-squirrel-startup')
function run (args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe')
  debug('Spawning `%s` with args `%s`', updateExe, args)
  spawn(updateExe, args, {
    detached: true,
  }).on('close', done)
}

function writeToFile (msg) {
  var s = String(new Date()) + ': ' + msg + '\n'
  fs.appendFile('debug.log', s, (err) => {
    if (err) throw err;
  })
}

if (process.platform === 'win32') {
  var cmd = process.argv[1]
  writeToFile(cmd)
  debug('processing squirrel command `%s`', cmd)
  var target = path.basename(process.execPath)

  if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
    run(['--createShortcut=' + target + ''], app.quit)
    return true
  }
  if (cmd === '--squirrel-uninstall') {
    run(['--removeShortcut=' + target + ''], app.quit)
    return true
  }
  if (cmd === '--squirrel-obsolete') {
    app.quit()
    return true
  }
}
// //////////////////////////////////////////////////////////////////////////

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  console.log('[log] window created')
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  console.log('[log] closed all windows')
})

app.on('activate', function () {
  console.log('[log] activate hook')
  if (mainWindow === null) {
    createWindow()
  }
})
