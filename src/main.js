const { app, BrowserWindow, Menu, screen } = require('electron');
const wallpaper = require('wallpaper');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff'
    },
    frame: false,
    webPreferences: {
      webSecurity: false, // Needed to load the wallpaper
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  // Remove menu
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Send wallpaper
  (async () => {

    function base64Encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString('base64');
    }

    mainWindow.webContents.send('wallpaper', base64Encode(await wallpaper.get()));
  })();

  // Send screen size
  const screenSize = screen.getPrimaryDisplay().bounds;
  mainWindow.webContents.send('screen-size', screenSize);

  // Listen to will-move event of the window
  mainWindow.on('will-move', (event, newBounds) => {
    event.sender.send('window-move', newBounds);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
