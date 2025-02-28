import { isCaptcha } from '../hide/loginToHome'
import { isPrompt, isShow } from '../search/click'
import { isCopy } from '../Window/window'
//定时器id
export let noticeTimeId
export let noticeLoginTimeId
//登录定时器
export let isCaptchaTimeId
//签到定时器
export let attendanceTimeId
//提示计算器
export let isPromptTimeId
//复制计时器
export let isCopyTimeId
export const noticeTime = () => {
  clearTimeout(noticeTimeId)
  noticeTimeId = setTimeout(() => {}, 1500)
  console.log('ok')
  return noticeTimeId
}
//登录页定时器
export const isCaptchaTime = () => {
  clearTimeout(isCaptchaTimeId)
  isCaptchaTimeId = setTimeout(() => {
    isCaptcha.value = false
  }, 1500)
  return isCaptchaTimeId
}
//签到定时器
export const attendanceTime = () => {
  clearTimeout(attendanceTimeId)
  attendanceTimeId = setTimeout(() => {
    isShow.value = false
  }, 5000)
  return attendanceTimeId
}
//提示计时器
export const isPromptTime = () => {
  clearTimeout(isPromptTimeId)
  isPromptTimeId = setTimeout(() => {
    isPrompt.value = false
  }, 3000)
  return isPromptTimeId
}
export const isCopyTime = () => {
  clearTimeout(isCopyTimeId)
  isCopyTimeId = setTimeout(() => {
    isCopy.value = false
  }, 1000)
}
