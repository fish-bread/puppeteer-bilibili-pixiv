import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer,自定义api
const api = {
  minimize: () => ipcRenderer.send('minimize-window'),
  setFullScreen: () => ipcRenderer.send('setFull-screen'),
  close: () => ipcRenderer.send('close-window'),
  fixe: () => ipcRenderer.send('fixed-window'),
  //打开主窗体
  sendWindow: () => ipcRenderer.send('resize-window'),
  //打开登录页面
  sendLoginWindow: () => ipcRenderer.send('login-window'),
  //刷新页面
  reloadPage: () => ipcRenderer.send('reload-page'),
  //打开外部链接
  shellNetwork: (url) => ipcRenderer.send('shell-Network', url),
  //传递用户数据
  localData: (user_name, user_uid, user_state, user_img, user_background) =>
    ipcRenderer.send('local-data', user_name, user_uid, user_state, user_img, user_background),
  searchData: () => ipcRenderer.invoke('search-data'),
  //传递token数据
  localToken: (token) => ipcRenderer.send('local-token', token),
  searchToken: () => ipcRenderer.invoke('search-token'),
  //在多个窗体间传递数据
  receiveInitData: (callback) => ipcRenderer.on('init-data', (event, data) => callback(data)),
  //传递网络错误
  internetError: (errMessage) => ipcRenderer.send('net-error', errMessage),
  //传递下载地址
  firstSavePath: () => ipcRenderer.invoke('first-select-save-path'),
  savePath: (index) => ipcRenderer.invoke('select-save-path', index),
  //保存文件
  saveVideo: (arrayBuffer, filename, fileType) =>
    ipcRenderer.send('save-video-file', { arrayBuffer, filename, fileType }),
  //本地文件
  localVideo: () => ipcRenderer.invoke('get-videos'),
  localPhoto: () => ipcRenderer.invoke('get-photos'),
  localAudio: () => ipcRenderer.invoke('get-audios')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
