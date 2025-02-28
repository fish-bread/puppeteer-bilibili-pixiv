//窗体
import { ref } from 'vue'
import { changeBackground } from '../../axios/iframe'
import { isUserBackground, user } from '../user'
import { debounce } from 'lodash'

export const windowWidth = ref(0)
export const windowHeight = ref(0)
//提示高度
export const promptHeight = ref(0)
export const promptWidth = ref(0)
//左侧高度
export const leftHeight = ref(0)
//列表高度
export const okHeight = ref(0)
//复制
export const isCopy = ref(false)
//刷新
export const netImg = ref()
export const reloadPage = debounce(() => {
  netImg.value.style.animationIterationCount = 1
  window.api.reloadPage()
  console.log('刷新')
}, 500)
//背景色
export const backgroundIndex = ref()
export const placeholderColor = ref('#757575') // 使用ref

//用户更改主题
export const backgroundColor = async (index) => {
  switch (index) {
    case 0:
      user.user[5].inName = 0
      await changeBackground()
      break
    case 1:
      user.user[5].inName = 1
      await changeBackground()
      break
    case 2:
      user.user[5].inName = 2
      isUserBackground.value = true
      break
    case 3:
      break
  }
}
export const updateWindowSize = async () => {
  //窗体宽度,窗体高度
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  //提示宽度,提示高度
  promptHeight.value = window.innerHeight - 100
  promptWidth.value = window.innerWidth - 100
  //左侧高度
  leftHeight.value = window.innerHeight - 60
  //列表高度
  okHeight.value = leftHeight.value - 140
}
