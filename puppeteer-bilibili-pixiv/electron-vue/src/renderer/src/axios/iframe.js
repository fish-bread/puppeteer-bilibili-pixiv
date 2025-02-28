import { creatAxios, fileAxios, loginAxios } from './index.js'
import { ref } from 'vue'
import { userEmail, userEmailCaptcha, userPassword } from '../function/userData/userdata'
//解析传递值
import { user, file, history } from '../function/user'
import { isCaptchaTime, attendanceTime, isPromptTime } from '../function/timeout/noticetime'
import { isCaptcha, number, startCountdown } from '../function/hide/loginToHome'
import { checkOut, isDisabled, isShow, num, outWeb, stopRotating } from '../function/search/click'
import {
  isSearch,
  isSearchOk,
  size,
  userSearch,
  progressNum,
  progressWidth,
  downloadIn,
  resource,
  videoRef,
  bodySearch,
  activeIndices,
  userChoose
} from '../function/search/search'
import { backgroundIndex, placeholderColor } from '../function/Window/window'
const tokenData = ref()
const webNet = ref()
//初始用户
export const Data = async () => {
  const newUser = await window.api.searchData()
  const userToken = await window.api.searchToken()
  console.log('Received data:', newUser)
  user.user[0].inName = newUser.user_name
  user.user[2].inName = newUser.user_uid
  user.user[3].inName = newUser.user_state
  user.user[4].inName = newUser.user_img
  user.user[5].inName = newUser.user_background
  await searchBackground()
  tokenData.value = userToken
}
//注册和登录
export const login = async () => {
  const userStore = ref({
    user_email: userEmail,
    user_password: userPassword,
    user_captcha: userEmailCaptcha
  })
  await loginAxios({
    method: 'POST',
    url: `/user/sign`,
    data: {
      email: userStore.value.user_email,
      password: userStore.value.user_password,
      captcha: userStore.value.user_captcha
    }
  })
    .then(async (res) => {
      console.log('成功', res.data.token)
      console.log(res.data.message)
      console.log(res.status)
      window.api.localData(
        res.data.userName,
        res.data.userUid,
        res.data.userState,
        `http://localhost:3000${res.data.userHeadshot}?t=${Date.now()}`,
        res.data.userBackground
      )
      window.api.localToken(res.data.token)
      await window.api.sendWindow()
    })
    .catch((err) => {
      console.log('失败', err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      } else {
        number.value = 6
        isCaptcha.value = true
        console.log('isCaptcha', isCaptcha.value)
        isCaptchaTime()
        console.log('isCaptcha', isCaptcha.value)
        console.log(err.status)
      }
    })
}
//邮箱验证码
export const emailCaptcha = async () => {
  const userStore = ref({
    user_email: userEmail
  })
  await loginAxios({
    method: 'POST',
    url: `/user/sendEmail`,
    data: {
      to: userStore.value.user_email
    }
  })
    .then((res) => {
      console.log(res.status)
      console.log('成功', res.data.message)
      number.value = 4
      isCaptcha.value = true
      isCaptchaTime()
      startCountdown()
      console.log('验证码已发送')
    })
    .catch((err) => {
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      } else {
        console.log(err.status)
      }
    })
}
//更改名字
export const changeUserName = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/changeUserName`,
    data: {
      userName: user.userSet[0].inName,
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('axios成功更改名字', res.data.userName, res.data.userUid)
      console.log('status', res.status)
      //设置名字
      await window.api.localData(
        res.data.userName,
        user.user[2].inName,
        user.user[3].inName,
        user.user[4].inName,
        user.user[5].inName
      )
      //刷新样式
      await Data()
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      } else {
        console.log(err.status)
        console.log('axios更改名字请求失败')
      }
    })
}
//更改密码
export const changeUserPassword = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/changeUserPassword`,
    data: {
      userPassword: user.userSet[1].inName,
      userUid: user.user[2].inName
    }
  })
    .then((res) => {
      console.log('axios成功更改密码', res.data.userUid)
      console.log('status', res.status)
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//上传头像图片
export const changeHeadshot = async (file) => {
  const formData = new FormData()
  formData.append('Headshot', file) // 确保字段名和后端一致
  formData.append('userUid', user.user[2].inName)
  await fileAxios({
    method: 'POST',
    url: `/user/changeUserHeadshot`,
    data: formData
  })
    .then(async (res) => {
      console.log('成功上传图片')
      console.log('是否成功', res.data.message)
      //设置头像
      await window.api.localData(
        user.user[0].inName,
        user.user[2].inName,
        user.user[3].inName,
        `http://localhost:3000${res.data.imageUrl}?t=${Date.now()}`,
        user.user[5].inName
      )
      //刷新样式
      await Data()
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//查询背景样式
export const searchBackground = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/searchUserBackground`,
    data: {
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('背景代码', res.data.background)
      //刷新样式
      placeholderColor.value = `${res.data.background.placeholder}`
      backgroundIndex.value.style.color = `${res.data.background.color}`
      backgroundIndex.value.style.background = `${res.data.background.backgroundColor}`
    })
    .catch((err) => {
      console.log(err)
    })
}
//上传用户自定义图片
export const changeBackgroundImage = async (file) => {
  const formData = new FormData()
  formData.append('Background', file) // 确保字段名和后端一致
  formData.append('userUid', user.user[2].inName)
  await fileAxios({
    method: 'POST',
    url: `/user/changeBackgroundImage`,
    data: formData
  })
    .then(async (res) => {
      console.log('背景代码', res.data.userBackground)
      //设置背景
      await window.api.localData(
        user.user[0].inName,
        user.user[2].inName,
        user.user[3].inName,
        user.user[4].inName,
        user.user[5].inName
      )
      //刷新样式
      placeholderColor.value = `${res.data.userBackground.placeholder}`
      backgroundIndex.value.style.color = `${res.data.userBackground.color}`
      backgroundIndex.value.style.background = `${res.data.userBackground.backgroundColor}`
    })
    .catch((err) => {
      console.log(err)
    })
}
//上传背景样式
export const changeBackground = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/changeUserBackground`,
    data: {
      userNewBackground: user.user[5].inName,
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('成功上传背景样式')
      console.log('是否成功', res.data.message)
      console.log('背景代码', res.data.userBackground)
      //设置背景
      await window.api.localData(
        user.user[0].inName,
        user.user[2].inName,
        user.user[3].inName,
        user.user[4].inName,
        res.data.userBackground.num
      )
      //刷新样式
      placeholderColor.value = `${res.data.userBackground.placeholder}`
      backgroundIndex.value.style.color = `${res.data.userBackground.color}`
      backgroundIndex.value.style.background = `${res.data.userBackground.backgroundColor}`
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//删除用户
export const deleteUser = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/deleteUser`,
    data: {
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('状态', res.data.message)
      await window.api.sendLoginWindow()
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//首次签到
export const firstCheckIn = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/firstCheckIn`,
    data: {
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('检查签到', res.data.message, res.data.isCheck)
      console.log('签到天数:', res.data.totalDays)
      checkOut(res.data.isCheck, res.data.totalDays)
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//签到
export const checkIn = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/checkIn`,
    data: {
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('签到', res.data.message, res.data.isCheck)
      console.log('签到天数:', res.data.totalDays)
      checkOut(res.data.isCheck, res.data.totalDays)
      //签到内容
      isShow.value = true
      attendanceTime()
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//用户历史
export const userHistoryAxios = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/userHistory`,
    data: {
      userUid: user.user[2].inName
    }
  })
    .then(async (res) => {
      console.log('历史请求', res.data.history)
      user.userHistory = res.data.history
      history.value = user.userHistory.length !== 0
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//删除用户历史
export const updateUserHistory = async (userHistory_id) => {
  await creatAxios({
    method: 'POST',
    url: '/user/updateUserHistory',
    data: {
      userUid: user.user[2].inName,
      id: userHistory_id
    }
  })
    .then(async (res) => {
      console.log('新历史', res.data.history)
      user.userHistory = res.data.history
      history.value = user.userHistory.length !== 0
    })
    .catch((err) => {
      console.log(err)
    })
}
//puppeteer发送搜索请求
export const puppeteerAxios = async () => {
  await creatAxios({
    method: 'POST',
    url: `/user/puppeteerAxios`,
    data: {
      userUid: user.user[2].inName,
      videoUrl: userSearch.value,
      outWeb: outWeb.value
    },
    timeout: 300000
  })
    .then(async (res) => {
      console.log('puppeteer:', res.data.message)
      console.log('是否为合集:', res.data.isMulti)
      console.log('视频数组:', res.data.videoList)
      console.log('选择网站', res.data.outWeb)
      //成功
      num.value = 4
      stopRotating()
      // 清空之前的选中状态
      activeIndices.value.clear()
      userChoose.value = []
      webNet.value = res.data.outWeb
      isDisabled.value = false
      if (res.data.isMulti === true) {
        //数组
        bodySearch.value.style.gridTemplateRows = '45px 45px 40px 180px 40px;'
        videoRef.value = res.data.videoList
        resource.value = res.data.videoList.length
        isSearch.value = 0
        //设置文本
        if (res.data.outWeb === 'pixiv') {
          file.value = '图片'
        } else if (res.data.outWeb === 'bilibili') {
          file.value = '视频'
        } else if (res.data.outWeb === '网易云') {
          file.value = '音频'
        }
        // 设置默认选中的 userSet
        if (res.data.userSet) {
          activeIndices.value.add(res.data.userSet.id)
          userChoose.value.push(res.data.userSet)
        }
        isPromptTime()
      } else {
        bodySearch.value.style.gridTemplateRows = '45px 45px 40px 30px 40px;'
        videoRef.value = res.data.videoList
        resource.value = res.data.videoList.length
        isSearch.value = 1
        //设置文本
        if (res.data.outWeb === 'pixiv') {
          file.value = '图片'
        } else if (res.data.outWeb === 'bilibili') {
          file.value = '视频'
        } else if (res.data.outWeb === '网易云') {
          file.value = '音频'
        }
        isPromptTime()
      }
    })
    .catch((err) => {
      console.log(err)
      //失败
      num.value = 5
      stopRotating()
      isPromptTime()
      if (err.code === 'ERR_NETWORK') {
        // 处理网络错误
        console.error('网络错误:', err.message)
        window.api.internetError()
      }
    })
}
//puppeteer下载回客户端
export const downloadAxios = async (videoRef) => {
  for (let i = 0; i < videoRef.length; i++) {
    progressWidth.value = '0%'
    isSearchOk.value = true
    try {
      const response = await fetch('http://localhost:3000/user/downloadAxios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await window.api.searchToken()}` // 获取 token
        },
        body: JSON.stringify({
          userUid: user.user[2].inName,
          userChoose: videoRef[i],
          outWeb: webNet.value
        }) // 使用 body 并将数据转换为 JSON 字符串
      })

      if (!response.ok) {
        // 检查 HTTP 状态码
        if (response.status === 401) {
          console.log('token无效')
          await window.api.sendLoginWindow()
        } else {
          console.log(`HTTP error! status: ${response.status}`)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      const reader = response.body.getReader() // 获取流读取器
      const contentLength = response.headers.get('content-length') // 获取文件总大小
      let receivedLength = 0
      const chunks = []

      size.value = contentLength
      let isReading = true
      while (isReading) {
        const { done, value } = await reader.read()
        if (done) {
          isReading = false
          break
        }
        chunks.push(value)
        receivedLength += value.length
        const percentCompleted = Math.round((receivedLength * 100) / contentLength)
        isSearch.value = 2
        isSearchOk.value = true
        downloadIn.value = receivedLength
        progressNum.value = receivedLength
        progressWidth.value = `${percentCompleted}%`
        console.log(`下载进度：${percentCompleted}%`)
      }
      const blob = new Blob(chunks) // 合并 chunks 为 Blob
      const arrayBuffer = await blob.arrayBuffer()
      let filename = response.headers.get('content-disposition')
      if (filename) {
        const match = /filename\*=\S*''(.*)/.exec(filename)
        if (match) {
          filename = decodeURIComponent(match[1])
        } else {
          const matchNoEncode = /filename="(.*)"/.exec(filename)
          if (matchNoEncode) {
            filename = matchNoEncode[1]
          } else {
            filename = 'downloaded_video.mp4'
          }
        }
      } else {
        filename = 'downloaded_video.mp4'
      }
      console.log('文件下载完成，准备保存...')
      await window.api.saveVideo(arrayBuffer, filename, webNet.value)
      isSearch.value = 3
      isDisabled.value = true
    } catch (error) {
      console.error('下载失败:', error)
      if (error.message.includes('Failed to fetch')) {
        // 检测网络错误
        window.api.internetError()
      }
    }
  }
  isSearch.value = 5
}
export const uploadCookie = async (cookieName, cookie) => {
  await creatAxios({
    method: 'POST',
    url: `/user/uploadCookie`,
    data: {
      userUid: user.user[2].inName,
      userCookie: cookie,
      cookieName: cookieName
    }
  })
    .then((res) => {
      console.log('更新是否成功', res.data.message)
    })
    .catch((err) => {
      console.log(err)
    })
}
