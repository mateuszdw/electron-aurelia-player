//Note: This file is provided as an aid to help you get up and running with
//Electron for desktop apps. See the readme file for more information.
/* eslint-disable strict, no-var, no-console */

'use strict';

const electron = require('electron');
const remote = electron.remote;
const {app, BrowserWindow, Menu, Tray} = electron;

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(app.getName());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // let tray = new Tray('./favicon.ico')
  // const contextMenu = Menu.buildFromTemplate([
  //   {label: 'Item3', type: 'radio', checked: true},
  //   {label: 'Item4', type: 'radio'}
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  // (function() {
  //
  //     document.getElementById("min-btn").addEventListener("click", function (e) {
  //          var window = remote.getCurrentWindow();
  //          window.minimize();
  //     });
  //
  //     document.getElementById("max-btn").addEventListener("click", function (e) {
  //          var window = remote.getCurrentWindow();
  //          if (!window.isMaximized()) {
  //              window.maximize();
  //          } else {
  //              window.unmaximize();
  //          }
  //     });
  //
  //     document.getElementById("close-btn").addEventListener("click", function (e) {
  //          var window = remote.getCurrentWindow();
  //          window.close();
  //     });
  //
  // })();

});
