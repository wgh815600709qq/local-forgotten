const { BrowserWindow } = require('electron');
const path = require('path')
class LoginWindow {
    constructor() {
        this.createWindow()
    }

    createWindow() {
        this.loginWindow = new BrowserWindow({
            width: 1024,
            height: 800,
            frame: false,
            resizable: false,
            title: '备忘录',
            movable: true,
            focusable: true,
            alwaysOnTop: false,
            show: false,
            acceptFirstMouse: true
        })

        this.loginWindow.loadURL(path.resolve(__dirname, '../template/login.html'))
        this.loginWindow.once('ready-to-show', () => {
            this.loginWindow.show()
        })
        this.loginWindow.webContents.openDevTools()
        this.loginWindow.on('closed', function () {
            this.loginWindow = null
        })
    }

    show() {

    }

    hide() {

    }
}

module.exports = LoginWindow 