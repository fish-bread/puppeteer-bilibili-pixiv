import { ref } from 'vue'
//缩小
export const shrink = () => {
  window.api.minimize()
}
//全屏
export const setFullScreen = () => {
  window.api.setFullScreen()
}
//关闭
export const close = () => {
  window.api.close()
}
//固定
export const fixed = ref(0)
export const isfixed = ref(false)
export const fixe = () => {
  if (isfixed.value === false) {
    fixed.value = 1
    isfixed.value = true
    window.api.fixe()
  } else {
    fixed.value = 0
    isfixed.value = false
    window.api.fixe()
  }
}
