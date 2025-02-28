import { ref } from 'vue'
export const LocalVideoList = ref([])
export const isLocalVideo = ref()
export const localVideo = async () => {
  const result = await window.api.localVideo() // 传递路径给主进程
  if (result.error) {
    console.error(result.error)
    //  在这里处理错误，例如显示错误消息给用户
    alert(result.error)
    return
  }
  LocalVideoList.value = result.videoList // 正确提取 videoList
  if (LocalVideoList.value === '什么也没有') {
    console.log('视频数组', LocalVideoList.value)
    isLocalVideo.value = 0
  } else {
    console.log('视频数组', LocalVideoList.value)
    isLocalVideo.value = 1
  }
}
