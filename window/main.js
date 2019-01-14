
const { app, BrowserWindow, ipcMain } = require('electron')
const LoginWindow = require('./controller/login')
class App {
  constructor() {
    this.loginWindow = null;
  }

  init() {
    this.initApp();
    this.initIPC();
  }

  initApp() {
    app.on('ready', () => {
      this.createLoginWindow()
    });

    app.on('activate', () => {
      if (this.mainWindow == null) {
        this.createMainWindow();
      } else {
        this.mainWindow.show();
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });
  }

  initIPC() {
    ipcMain.on('closeWindow', (event, winName) => {
      this[winName][winName].close()
    })

    ipcMain.on('minWindow', (event, winName) => {
      this[winName][winName].minimize()
    })

  }

  createLoginWindow() {
    this.loginWindow = new LoginWindow()
  }

}

new App().init();




