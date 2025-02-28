import { noticeTime } from './timeout/noticetime'
// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}
export default {
  beforeMount(el) {
    const handleInput = debounce((event) => {
      const value = event.target.value
      const filteredValue = value.replace(/[^a-zA-Z0-9@]/g, '') // 允许字母、数字、汉字和日文
      if (value !== filteredValue) {
        event.target.value = filteredValue
        console.log('执行特殊', value, '->', filteredValue)
        noticeTime()
      } else {
        console.log('非特殊字符')
      }
    }, 100)
    el.addEventListener('input', handleInput)
  }
}
