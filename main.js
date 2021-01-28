const { app, BrowserWindow, Menu, Tray } = require('electron');
const windowStateKeeper = require('electron-window-state');

let mainWindow = null;
let tray = null

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 390,
    defaultHeight: 470
  });

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: 390,
    height: 470,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`${__dirname}/src/index.html`);
  mainWindowState.manage(mainWindow);
  tray = new Tray(`${__dirname}/assets/icon/icon.png`)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click() {
        mainWindow.show()
      }
    },
    {
      label: 'Exit',
      click() {
        app.exit()
      }
    }
  ])
  tray.setToolTip('Take Break From works')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    mainWindow.show()
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
