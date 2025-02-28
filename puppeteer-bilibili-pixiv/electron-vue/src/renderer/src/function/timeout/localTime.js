import { ref } from 'vue'
// currentTime 响应式变量，存储当前时间字符串
export const currentTime = ref('')
// intervalId 存储计时器 ID
export let intervalId = ref()
// updateTime 函数，更新 currentTime 的值
export const updateTime = () => {
  currentTime.value = new Date().toLocaleString() // 使用toLocaleString()格式化时间
  //console.log('执行')
}
