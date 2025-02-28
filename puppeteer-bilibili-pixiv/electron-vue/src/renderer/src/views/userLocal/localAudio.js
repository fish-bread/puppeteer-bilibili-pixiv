import { ref } from 'vue'
export const LocalAudioList = ref([])
export const isLocalAudio = ref()
export const localAudio = async () => {
  const result = await window.api.localAudio() // 传递路径给主进程
  if (result.error) {
    console.error(result.error)
    //  在这里处理错误，例如显示错误消息给用户
    alert(result.error)
    return
  }
  LocalAudioList.value = result.videoList // 正确提取 videoList
  if (LocalAudioList.value === '什么也没有') {
    console.log('音频数组', LocalAudioList.value)
    isLocalAudio.value = 0
  } else {
    console.log('音频数组', LocalAudioList.value)
    isLocalAudio.value = 1
  }
}
