import { ref } from 'vue'
import { num, isPromptFunc, startRotating, isDisabled } from './click'
import { downloadAxios, puppeteerAxios } from '../../axios/iframe'
import { debounce } from 'lodash'
//下载
export const resource = ref(0)
export const size = ref()
export const downloadIn = ref(0)
//下载第几个
export const videoLength = ref(0)
//其他
export const bodySearch = ref()
export const userSearch = ref()
export const isSearch = ref(-1)
export const isSearchOk = ref(false)
//提示词
export const placeholder = ref([
  { id: 0, name: '请先选择你想爬取的网站' },
  { id: 1, name: '请输入pid或图片网页链接' },
  { id: 2, name: '请输入bv号或视频网页链接' },
  { id: 3, name: '请输入音频id或音频网址' }
])
//视频集数
export const videoRef = ref([])
export const placeholderFunc = (index) => {
  if (index === null) {
    index = -1
  }
  switch (index) {
    case -1:
      return placeholder.value[0].name
    case 0:
      return placeholder.value[1].name
    case 1:
      return placeholder.value[2].name
    case 2:
      return placeholder.value[3].name
  }
}
//进度
export const progressNum = ref(0) // 已传输数据量，也使用 ref
export const progressWidth = ref('0%') // 进度条宽度，使用百分比
// 开始传输的函数，例如点击按钮时触发
export const search = debounce(async () => {
  isDisabled.value = true
  //提示
  num.value = 3
  isPromptFunc()
  startRotating()
  //请求
  console.log('发送请求')
  await puppeteerAxios()
}, 300)
//确认下载
export const download = async () => {
  isSearch.value = 4
  await downloadAxios(videoRef.value)
}
//多视频下载
export const userChooseVideoDownload = async () => {
  console.log('确认后的集合', userChoose.value)
  isSearch.value = 4
  await downloadAxios(userChoose.value)
}
//取消下载
export const closeDownload = async () => {
  isDisabled.value = true
  isSearch.value = -1
}
//选择视频
// 使用Set存储激活状态的索引
export const activeIndices = ref(new Set())
export const userChoose = ref([])
export const userChooseVideo = async (id, item) => {
  if (activeIndices.value.has(id)) {
    activeIndices.value.delete(id)
    userChoose.value = userChoose.value.filter((i) => i.id !== id)
  } else {
    activeIndices.value.add(id)
    userChoose.value.push(item)
  }
  console.log('选择id:前', activeIndices.value)
  console.log('选择数组:前', userChoose.value)
}
