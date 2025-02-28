import { userEmailCaptcha, userEmail, userPassword } from '../userData/userdata'
import { debounce } from 'lodash'
import { ref } from 'vue'
import { isValidEmail } from './noticeLogin'
import { isCaptchaTime } from '../timeout/noticetime'
import { emailCaptcha, login } from '../../axios/iframe'
//验证码
export let number = ref(0)
export const isCaptcha = ref(false)
export const captchaText = ref()
//页面切换
export const isEmail = ref(true)
//提示词
export const prompt = ref([
  { id: 0, name: '邮件为空' },
  { id: 1, name: '请输入有效邮箱' },
  { id: 2, name: '密码为空' },
  { id: 3, name: '验证码为空' },
  { id: 4, name: '验证码已发送' },
  { id: 5, name: '正在验证登录' },
  { id: 6, name: '验证失败' }
])
//登录
export const routerGoTo = debounce(async () => {
  console.log('是否为邮箱', isValidEmail.value)
  console.log(userEmail.value)
  console.log(userPassword.value)
  //邮箱,是否为有效邮箱,密码,验证码
  if (userEmail.value === '') {
    number.value = 0
    isCaptcha.value = true
    isCaptchaTime()
    console.log('邮箱')
  } else if (isValidEmail.value === false) {
    number.value = 1
    isCaptcha.value = true
    isCaptchaTime()
    console.log('有效邮箱')
  } else if (userPassword.value === '') {
    number.value = 2
    isCaptcha.value = true
    isCaptchaTime()
    console.log('密码')
  } else if (userEmailCaptcha.value === '') {
    number.value = 3
    isCaptcha.value = true
    isCaptchaTime()
    console.log('验证码')
  } else {
    console.log('表单完整')
    number.value = 5
    isCaptcha.value = true
    isCaptchaTime()
    await login()
  }
}, 1000)
//离线登录
export const offline = debounce(async () => {
  const ok = await window.api.searchData()
  console.log('离线登录', ok)
  await window.api.localData('默认用户', 1919810, '离线', '../../src/assets/2.jpg', 0)
  await window.api.sendWindow()
}, 100)
//按钮禁止点击
export const captchaButtonDisabled = ref(false)
const countdown = ref(60)
export const captchaButtonText = ref('发送验证码')
export const startCountdown = () => {
  if (captchaButtonDisabled.value) return // 防止重复点击
  captchaButtonDisabled.value = true
  const timer = setInterval(() => {
    countdown.value--
    captchaButtonText.value = `${countdown.value}s后重试`
    if (countdown.value <= 0) {
      clearInterval(timer)
      captchaButtonDisabled.value = false
      captchaButtonText.value = '发送验证码'
      countdown.value = 60
    }
  }, 1000)
}
//验证邮箱
export const ClickEmailCaptcha = debounce(async () => {
  if (userEmail.value === '') {
    number.value = 0
    isCaptcha.value = true
    isCaptchaTime()
    console.log('邮箱')
  } else if (isValidEmail.value === false) {
    number.value = 1
    isCaptcha.value = true
    isCaptchaTime()
    console.log('有效邮箱')
  } else {
    await emailCaptcha()
  }
}, 1000)
//验证手机号
export const ClickPhoneCaptcha = debounce(async () => {}, 1000)
//切换登录方式
export const SwitchLoginPhone = debounce(async () => {
  isEmail.value = false
}, 300)
export const SwitchLoginEmail = debounce(async () => {
  isEmail.value = true
}, 300)
