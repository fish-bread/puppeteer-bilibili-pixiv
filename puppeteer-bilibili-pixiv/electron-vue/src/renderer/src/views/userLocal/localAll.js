// noinspection CssInvalidHtmlTagReference

import { ref } from 'vue'

export const localListRef = ref([
  { id: 0, name: '视频' },
  { id: 1, name: '音频' },
  { id: 2, name: '图片' }
])
export const selectedButtonId = ref(localListRef.value[0]?.id || 0)
export const videoButtonId = ref(null)
export const audioButtonId = ref(null)
export const photoButtonId = ref(null)
// 新增响应式变量
export const currentVideoSrc = ref('')
export const currentAudioSrc = ref('')
export const currentPhotoSrc = ref('')
export const setVideo = (video, index) => {
  videoButtonId.value = index
  currentVideoSrc.value = video
}
export const setAudio = (audio, index) => {
  audioButtonId.value = index
  currentAudioSrc.value = audio
}

export const setPhoto = (photo, index) => {
  photoButtonId.value = index
  currentPhotoSrc.value = photo
}
