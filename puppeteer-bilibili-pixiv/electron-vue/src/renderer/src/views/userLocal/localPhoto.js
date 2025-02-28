import { ref } from 'vue'
export const LocalPhotoList = ref([])
export const isLocalPhoto = ref()
export const localPhoto = async () => {
  const result = await window.api.localPhoto() // 传递路径给主进程
  if (result.error) {
    console.error(result.error)
    //  在这里处理错误，例如显示错误消息给用户
    alert(result.error)
    return
  }
  LocalPhotoList.value = result.videoList // 正确提取 videoList
  if (LocalPhotoList.value === '什么也没有') {
    console.log('图片数组', LocalPhotoList.value)
    isLocalPhoto.value = 0
  } else {
    console.log('图片数组', LocalPhotoList.value)
    isLocalPhoto.value = 1
  }
}
