const { app, BrowserWindow,ipcMain, Notification, dialog } = require("electron");
const path = require("path");
const fs = require('fs');
// const { Howl } = require('howler');  // Using CommonJS syntax

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'), // Link the preload script
      contextIsolation: true, // Keep the app secure
    },
  });

  // Load the React app
  mainWindow.loadURL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  console.log(`file://${path.join(__dirname, "../build/index.html")}`);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.on("ready", createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('notify', (event, { title, subtitle, body, soundPath }) => {
    
  const options = {
    title: title,
    subtitle: subtitle,
    body: body,
    silent: true,
    timeoutType: 'never', 
    urgency: 'critical' 
  }

  const customNotification = new Notification(options);
  customNotification.show();
});