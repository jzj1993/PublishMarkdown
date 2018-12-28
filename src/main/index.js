import {app, BrowserWindow, screen} from 'electron'

const log = require('electron-log')

const AppMenu = require('./AppMenu')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

global.globalData = {
  fileToOpen: null
}

function createWindow() {
  /**
   * Initial window options
   */
  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      // enable to load local image files
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  log.info('create window', winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  AppMenu.init(mainWindow)
}

app.on('open-file', (event, path) => {

  log.info('open-file', event, path, process.argv)

  if (!path && process.platform === 'win32' && process.argv.length >= 2) {
    path = process.argv[1]
  }

  if (path) {
    event.preventDefault()
    globalData.fileToOpen = path
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
