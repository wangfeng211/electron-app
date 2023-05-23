import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.handle('ping', () => 'pong---')

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  //添加一个菜单
  const menu = Menu.buildFromTemplate([
    {
      label: '操作',
      submenu: [
        {
          label: '加1',
          click: () => mainWindow.webContents.send('update-counter', 1)
        },
        {
          label: '减一',
          click: () => mainWindow.webContents.send('update-counter', -1)
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  mainWindow.webContents.on('context-menu', (e, params) => {
    //监听点击鼠标右键
    console.log(params)
    //弹框限制选中的文本
    mainWindow.webContents.executeJavaScript(`alert('${params.selectionText}')`)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'

ipcMain.handle('open-save-dialog', (e, params) => {
  // dialog
  //   .showOpenDialog({
  //     buttonLabel: '选择',
  //     defaultPath: app.getPath('documents'),
  //     properties: ['multiSelections', 'createDirectory']
  //   })
  //   .then((res) => {});

  //显示保存对话框
  // dialog.showSaveDialog({});

  dialog
    .showMessageBox({
      message: '提示信息',
      buttons: ['Yes', 'No', 'Not confum']
    })
    .then((result) => {
      // response 下标
      console.log(result.response)
    })
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
