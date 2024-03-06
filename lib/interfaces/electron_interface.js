const path = require('path');
const electron = require('electron');

/**
* Creates and returns a window that overlays the content at the given URL. The overlay is displayed in a pop - up menu and the scroll bar is dismissed
* 
* @param url - The URL of the content to overlay
* 
* @return { BrowserWindow } An overlay window ready to be shown to the user ( via onLoad event )
*/

function createOverlayWindow(url) {
  const overlayWindow = new electron.BrowserWindow({
    width: 1000,
    height: 800,
    transparent: true,
    frame: true,
    resizable: false,
    alwaysOnTop: true,
    movable: true,
    minimizable: false,
    closable: true,
    autoHideMenuBar: true,
    darkTheme: true,
    skipTaskbar: true,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  overlayWindow.loadURL(url); 
  overlayWindow.focus(); 

  overlayWindow.setAlwaysOnTop(true, 'pop-up-menu', 1);

  overlayWindow.webContents.executeJavaScript(`
    const style = document.createElement('style');
    style.innerHTML = '::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
  `).catch(error => {
    console.error('Error executing JavaScript:', error);
  });

  return overlayWindow; 
}

module.exports = {
  createOverlayWindow
};
