# electron-app

An Electron application with Vue and TypeScript

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

1、主进程和渲染进程通信
1.1 send 和 on(单项)
渲染进程 preload
ipcRender.send('msg');

主进程
ipcMain.on('msg',(event, data)=>{

})

1.2 invoke handle 双向
ipcRender.invoke('msg').then(res=>{
console.log(res)
})

ipcMain.handle('msg',()=>{
return '111'
})

2、app 生命周期
app.on('',()=>{})

3、父子窗口
4、保存窗口位置和状态 npm install electron-win-state
需要注意的是 引入包的时候 加 .default
const WinState = require('electron-win-state').default;
5、win.webContents.on('did-finish-load',()=>{
console.log('dom 加载完毕')
})
win.webContents.on('dom-ready',()=>{
console.log('dom Ready')
})
监听鼠标右键点击
win.webContents.on('context-menu',(e, params)=>{

})

6、dialog 对话框
7、系统快捷键
