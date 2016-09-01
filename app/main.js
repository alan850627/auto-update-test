const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

// Handle electron-squrrel events
if (require('electron-squirrel-startup')) return;

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
