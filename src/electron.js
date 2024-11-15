//electron.js
const {app, BrowserWindow} = require('electron');
const path = require('path');
const isDev = import('electron-is-dev');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        resizable: false,
        maximizable: true,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.removeMenu();

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null){
        createWindow();
    }
});