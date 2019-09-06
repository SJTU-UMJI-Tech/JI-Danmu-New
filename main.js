const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow
let controlWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    transparent: true,
    backgroundColor: "#00FFFFFF",
    frame: false,
    alwaysOnTop: true,
    fullscreen: true
  })

  mainWindow.setIgnoreMouseEvents(true);

  // mainWindow.setSkipTaskbar(true);
  mainWindow.loadFile('index.html')

  controlWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'control'
  })
  controlWindow.loadFile('control.html')

  controlWindow.on('closed', function () {
    controlWindow = null
    if (process.platform !== 'darwin') app.quit()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
