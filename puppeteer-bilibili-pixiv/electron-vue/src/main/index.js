import { app, BrowserWindow, dialog, ipcMain, protocol, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
//axios请求
import axios from 'axios'
//electron-store
const Store = require('electron-store')
const store = new Store({
  encryptionKey: 'your - secret - encryption - key'
})
//fs
const fs = require('fs')
const path = require('path')
//变量
let full = false
let AlwaysOnTop = false

//创建登录窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 375,
    height: 595,
    center: true,
    resizable: false,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    contextIsolation: true,
    nodeIntegration: false,
    webviewTag: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  //准备窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then()
    return { action: 'den// 自定义底部拖盘\n' + "  require('./tray')" }
  })

  // 为基于electron-vite cli的渲染器设置热模块替换（HMR）。
  // 在开发环境中加载远程URL，在生产环境中加载本地HTML文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL('http://localhost:5173/#/login').then()
  } else {
    mainWindow
      .loadFile(join(__dirname, '../renderer/index.html'), {
        hash: '#/login'
      })
      .then()
  }
}
//创建home窗口
function homeWindow() {
  //启动页面
  const splashWindow = new BrowserWindow({
    width: 400,
    height: 400,
    center: true,
    frame: false,
    show: true,
    autoHideMenuBar: true,
    contextIsolation: true,
    nodeIntegration: false,
    transparent: true,
    webviewTag: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 加载启动动画页面，这里假设启动动画页面为 splash.html
  const splashPath = is.dev
    ? join(__dirname, '../../resources/splash.html')
    : join(process.resourcesPath, 'app.asar.unpacked/resources/splash.html')

  splashWindow
    .loadFile(splashPath)
    .then(() => {
      console.log('加载启动成功')
    })
    .catch((err) => {
      console.log('加载启动失败', err)
    })
  //主页面
  const newWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 1080,
    minHeight: 660,
    center: true,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    contextIsolation: true,
    nodeIntegration: false,
    webviewTag: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  newWindow.on('ready-to-show', () => {})

  // 为基于electron-vite cli的渲染器设置热模块替换（HMR）。
  // 在开发环境中加载远程URL，在生产环境中加载本地HTML文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    newWindow.loadURL('http://localhost:5173/#/Home').then()
  } else {
    newWindow
      .loadFile(join(__dirname, '../renderer/index.html'), {
        hash: '#/Home'
      })
      .then()
  }

  // 监听 newWindow 的 did-finish-load 事件
  newWindow.webContents.on('did-finish-load', () => {
    // 关闭启动动画窗口
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close()
    }
    // 显示 newWindow
    newWindow.show()
  })
}
// 此方法将在Electron完成时调用。
// 初始化完成且准备好创建浏览器窗口。
//此事件发生后，某些API才能使用。
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // 默认情况下，通过F12在开发环境中打开或关闭开发者工具。
  // 并在生产环境中忽略CommandOrControl + R快捷键。
  // 看 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test,预加载脚本
  //缩小,全屏,关闭,固定设置
  ipcMain.on('minimize-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
    }
  })
  ipcMain.on('setFull-screen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (full === false) {
        window.setFullScreen(true)
        full = true
      } else {
        window.setFullScreen(false)
        full = false
      }
    }
  })
  ipcMain.on('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
    }
  })
  ipcMain.on('fixed-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (AlwaysOnTop === false) {
        window.setAlwaysOnTop(true)
        AlwaysOnTop = true
      } else {
        window.setAlwaysOnTop(false)
        AlwaysOnTop = false
      }
    }
  })
  //登录后更改窗体大小
  ipcMain.on('resize-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      homeWindow()
      window.destroy()
      console.log('登录')
    }
  })
  //注销和退出后打开登录页面
  ipcMain.on('login-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      //删除用户token
      store.delete('token')
      store.delete('user')
      store.delete('cookie')
      console.log('token', store.get('token'))
      console.log('user', store.get('user'))
      console.log('cookie', store.get('cookie'))
      //创建新窗口
      createWindow()
      window.destroy()
      console.log('注销或退出')
    }
  })
  //store用户信息本地储存
  ipcMain.on('local-data', (event, user_name, user_uid, user_state, user_img, user_background) => {
    if (store.get('user') === undefined) {
      store.set('user', {
        user_name: user_name,
        user_uid: user_uid,
        user_state: user_state,
        user_img: user_img,
        user_background: user_background
      })
      console.log('新user', store.get('user'))
    } else {
      console.log('销毁之前的user', store.get('user'))
      store.delete('user')
      store.set('user', {
        user_name: user_name,
        user_uid: user_uid,
        user_state: user_state,
        user_img: user_img,
        user_background: user_background
      })
      console.log('销毁之后的新user', store.get('user'))
    }
  })
  //读取store本地user储存
  ipcMain.handle('search-data', () => {
    if (store.get('user')) {
      return store.get('user')
    } else {
      return 'user为空'
    }
  })
  //本地偏好储存
  //本地token储存
  ipcMain.on('local-token', (event, token) => {
    if (store.get('token') === undefined) {
      store.set('token', token)
      console.log('token', store.get('token'))
    } else {
      console.log('销毁之前的token', token)
      store.delete('token')
      store.set('token', token)
      console.log('销毁之后的新token', store.get('token'))
    }
  })
  //本地token读取
  ipcMain.handle('search-token', () => {
    if (store.get('token')) {
      return store.get('token')
    } else {
      return 'token为空'
    }
  })
  //网络出错
  ipcMain.on('net-error', async (event, errorMessage) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    await dialog.showMessageBox(window, {
      type: 'error',
      title: 'FishBread 网络错误',
      message: '网络连接异常或服务器访问失败或用户凭证失效,请重新尝试,或重新登录',
      detail: errorMessage, // 显示从渲染进程接收到的错误信息
      buttons: ['确定']
    })
  })
  //刷新页面
  ipcMain.on('reload-page', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.webContents.reload()
    }
  })
  //打开外部链接
  ipcMain.on('shell-Network', (event, url) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      shell
        .openExternal(url)
        .then((res) => {
          console.log('链接打开成功', res)
        })
        .catch((err) => console.log('链接打开失败', err))
    }
  })
  //首次本地下载地址
  ipcMain.handle('first-select-save-path', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      try {
        //store.delete('filePath')
        if (store.get('filePath') === undefined) {
          const videoPath = join(__dirname, '../../resources/video')
          const audioPath = join(__dirname, '../../resources/audio')
          const photoPath = join(__dirname, '../../resources/photo')
          store.set('filePath', [
            {
              id: 0,
              inName: videoPath,
              text: '视频'
            },
            {
              id: 1,
              inName: audioPath,
              text: '图片'
            },
            {
              id: 2,
              inName: photoPath,
              text: '音频'
            }
          ])
          return store.get('filePath')
        } else {
          return store.get('filePath')
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
  //本地下载地址
  ipcMain.handle('select-save-path', async (event, index) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: '选择保存位置',
          defaultPath: app.getPath('downloads'),
          buttonLabel: '保存',
          properties: ['openDirectory']
        })
        const getFilePath = store.get('filePath')
        if (!canceled && filePaths.length > 0 && index === 0) {
          getFilePath[0].inName = filePaths[0]
          store.set('filePath', getFilePath)
          return store.get('filePath') // 直接返回选择的路径字符串
        } else if (!canceled && filePaths.length > 0 && index === 1) {
          getFilePath[1].inName = filePaths[0]
          store.set('filePath', getFilePath)
          return store.get('filePath') // 直接返回选择的路径字符串
        } else if (!canceled && filePaths.length > 0 && index === 2) {
          getFilePath[2].inName = filePaths[0]
          store.set('filePath', getFilePath)
          return store.get('filePath') // 直接返回选择的路径字符串
        } else {
          return null // 用户取消，返回 null
        }
      } catch (err) {
        console.error(err)
        return null // 出错，返回 null
      }
    }
    return null // 没有窗口，返回 null
  })
  // 保存文件
  ipcMain.on('save-video-file', async (event, { arrayBuffer, filename, fileType }) => {
    try {
      // 确保存储路径存在
      if (fileType === 'bilibili') {
        const savePath = store.get('filePath')
        if (!fs.existsSync(savePath[0].inName)) {
          fs.mkdirSync(savePath[0].inName, { recursive: true })
        }
        // 拼接完整路径
        const filePath = path.join(savePath[0].inName, filename)
        // 将 ArrayBuffer 写入文件
        fs.writeFile(filePath, Buffer.from(arrayBuffer), (err) => {
          if (err) {
            console.error('写入文件失败:', err)
            event.reply('download-error', err.message) // 发送错误消息
          } else {
            console.log('文件保存成功:', filePath)
            event.reply('download-complete', filePath) // 发送完成消息
          }
        })
      } else if (fileType === 'pixiv') {
        const savePath = store.get('filePath')
        if (!fs.existsSync(savePath[1].inName)) {
          fs.mkdirSync(savePath[1].inName, { recursive: true })
        }
        // 拼接完整路径
        const filePath = path.join(savePath[1].inName, filename)
        // 将 ArrayBuffer 写入文件
        fs.writeFile(filePath, Buffer.from(arrayBuffer), (err) => {
          if (err) {
            console.error('写入文件失败:', err)
            event.reply('download-error', err.message) // 发送错误消息
          } else {
            console.log('文件保存成功:', filePath)
            event.reply('download-complete', filePath) // 发送完成消息
          }
        })
      } else if (fileType === '网易云') {
        const savePath = store.get('filePath')
        if (!fs.existsSync(savePath[2].inName)) {
          fs.mkdirSync(savePath[2].inName, { recursive: true })
        }
        // 拼接完整路径
        const filePath = path.join(savePath[2].inName, filename)
        // 将 ArrayBuffer 写入文件
        fs.writeFile(filePath, Buffer.from(arrayBuffer), (err) => {
          if (err) {
            console.error('写入文件失败:', err)
            event.reply('download-error', err.message) // 发送错误消息
          } else {
            console.log('文件保存成功:', filePath)
            event.reply('download-complete', filePath) // 发送完成消息
          }
        })
      }
    } catch (error) {
      event.reply('file-save-result', {
        success: false,
        error: error.message
      })
    }
  })
  //本地读取视频文件
  protocol.registerFileProtocol('my-video', (request, callback) => {
    const url = request.url.replace('my-video://', '') // 移除协议头
    const decodedUrl = decodeURI(url) // 解码URL，处理中文文件名
    try {
      return callback(decodedUrl) // 直接返回文件路径
    } catch (error) {
      console.error(`Failed to register my-video protocol: ${error}`)
      return callback({ error: -1001 }) // 自定义错误码
    }
  })
  ipcMain.handle('get-videos', async (event) => {
    // 接收directoryPath参数
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (window) {
        let directoryPath = store.get('filePath')
        if (!directoryPath) {
          // 如果没有传入路径，则打开对话框选择文件夹
          const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: '选择视频文件夹'
          })

          if (canceled) {
            return { error: '用户取消了选择' } // 直接返回错误对象
          }

          directoryPath[0].inName = filePaths[0]
        }

        const files = await fs.promises.readdir(directoryPath[0].inName) // 使用promises避免回调地狱

        const videoFiles = files.filter((file) => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp4', '.webm', '.ogg', '.avi', '.mov'].includes(ext)
        })

        const videoList = videoFiles.map((file) => ({
          name: file,
          path: `my-video://${path.join(directoryPath[0].inName, file)}` // 不要在主进程中添加file://
        }))
        if (videoList.length > 0) {
          return { videoList } // 直接返回包含videoList的对象
        } else {
          return { videoList: '什么也没有' }
        }
      }
    } catch (error) {
      console.error('获取视频列表错误:', error)
      return { error: error.message } // 直接返回错误对象
    }
  })
  // 本地读取图片文件
  protocol.registerFileProtocol('my-photo', (request, callback) => {
    const url = request.url.replace('my-photo://', '')
    try {
      const decodedUrl = decodeURIComponent(url) // 使用 decodeURIComponent 确保正确解码
      const filePath = path.normalize(decodedUrl)
      return callback(filePath)
    } catch (error) {
      console.error(`Failed to register my-photo protocol: ${error}`)
      return callback({ error: -1001 })
    }
  })
  ipcMain.handle('get-photos', async (event) => {
    // 接收directoryPath参数
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (window) {
        let directoryPath = store.get('filePath')
        if (!directoryPath) {
          // 如果没有传入路径，则打开对话框选择文件夹
          const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: '选择视频文件夹'
          })

          if (canceled) {
            return { error: '用户取消了选择' } // 直接返回错误对象
          }

          directoryPath[1].inName = filePaths[0]
        }

        const files = await fs.promises.readdir(directoryPath[1].inName) // 使用promises避免回调地狱

        const videoFiles = files.filter((file) => {
          const ext = path.extname(file).toLowerCase()
          return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)
        })

        const videoList = videoFiles.map((file) => ({
          name: file,
          path: `my-photo://${path.join(directoryPath[1].inName, file)}` // 不要在主进程中添加file://
        }))
        if (videoList.length > 0) {
          return { videoList } // 直接返回包含videoList的对象
        } else {
          return { videoList: '什么也没有' }
        }
      }
    } catch (error) {
      console.error('获取视频列表错误:', error)
      return { error: error.message } // 直接返回错误对象
    }
  })
  //本地读取视频文件
  protocol.registerFileProtocol('my-audio', (request, callback) => {
    const url = request.url.replace('my-audio://', '') // 移除协议头
    const decodedUrl = decodeURI(url) // 解码URL，处理中文文件名
    try {
      return callback(decodedUrl) // 直接返回文件路径
    } catch (error) {
      console.error(`Failed to register my-audio protocol: ${error}`)
      return callback({ error: -1001 }) // 自定义错误码
    }
  })
  ipcMain.handle('get-audios', async (event) => {
    // 接收directoryPath参数
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (window) {
        let directoryPath = store.get('filePath')
        if (!directoryPath) {
          // 如果没有传入路径，则打开对话框选择文件夹
          const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: '选择视频文件夹'
          })

          if (canceled) {
            return { error: '用户取消了选择' } // 直接返回错误对象
          }

          directoryPath[2].inName = filePaths[0]
        }

        const files = await fs.promises.readdir(directoryPath[2].inName) // 使用promises避免回调地狱

        const videoFiles = files.filter((file) => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp3', '.wav', '.ogg', '.flac', '.aac'].includes(ext)
        })

        const videoList = videoFiles.map((file) => ({
          name: file,
          path: `my-video://${path.join(directoryPath[2].inName, file)}` // 不要在主进程中添加file://
        }))
        if (videoList.length > 0) {
          return { videoList } // 直接返回包含videoList的对象
        } else {
          return { videoList: '什么也没有' }
        }
      }
    } catch (error) {
      console.error('获取视频列表错误:', error)
      return { error: error.message } // 直接返回错误对象
    }
  })
  //打开窗口
  const token = store.get('token')
  const uid = store.get('user')
  if (token && uid) {
    const creatAxios = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 5000,
      headers: {
        'content-type': 'application/json'
      }
    })
    //请求拦截器
    creatAxios.interceptors.request.use(async (config) => {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('是否有jwt', token)
      return config
    })
    //响应拦截器
    creatAxios.interceptors.response.use(async (response) => {
      const isToken = response.data.code
      if (isToken === 1) {
        console.log('token有效')
      } else {
        console.log('token无效')
      }
      return response
    })
    const searchUser = async () => {
      console.log('本地', uid.user_uid)
      await creatAxios({
        method: 'POST',
        url: `/user/LaunchTheApp`,
        data: {
          Uid: uid.user_uid
        }
      })
        .then((res) => {
          console.log('成功', res.data.code)
          if (res.data.code === 0) {
            createWindow()
          } else {
            homeWindow()
          }
        })
        .catch((err) => {
          console.log('失败', err)
          createWindow()
        })
    }
    searchUser().then()
  } else {
    createWindow()
  }
  app.on('activate', function () {
    // 在macOS上，当应用程序重新创建窗口时，这是很常见的。
    // 当点击程序坞图标且没有其他窗口打开时，应用程序通常会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//当所有窗口都关闭时，程序将退出，除了在macOS上。在那里，通常
//对于应用程序及其菜单栏，通常保持激活状态，直到用户主动退出。
//通过按下Command + Q键显式退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//在这个文件中，你可以包含应用程序特定的主进程代码。
// 你也可以将它们放在单独的文件中，并在这里引入。
