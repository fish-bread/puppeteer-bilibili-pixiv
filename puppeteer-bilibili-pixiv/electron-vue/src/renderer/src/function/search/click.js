import { ref } from 'vue'
import { attendanceTime, isPromptTime } from '../timeout/noticetime'
import { checkIn } from '../../axios/iframe'
import { userSearch } from './search'
//动画
export const rotating = ref(false) // 控制旋转动画
export const startRotating = () => {
  rotating.value = true
  promptImg.value.style.animationPlayState = 'running'
}

export const stopRotating = () => {
  rotating.value = false
  promptImg.value.style.animationPlayState = 'paused'
}
//动画
export const isPromptFunc = () => {
  isPrompt.value = true
}
//网址
export const searchWeb = ref([
  { id: 1, name: 'pixiv' },
  { id: 2, name: 'bilibili' },
  { id: 3, name: '网易云' }
])
export const searchWebIndex = ref(null)
//选择
export const outWeb = ref('')
export const isChoose = ref(false)
//点击函数
export const isDisabled = ref(true)
export const searchNet = (index) => {
  isChoose.value = true
  searchWebIndex.value = index
  outWeb.value = searchWeb.value[index].name
  userSearch.value = ''
  console.log(outWeb.value)
}
//提示函数
export const isPrompt = ref(false)
export const text = ref([
  { name: '正在签到' },
  { name: '签到成功' },
  { name: '签到失败' },
  { name: '正在查询' },
  { name: '查询成功' },
  { name: '查询失败' }
])
export const num = ref(0)
export const promptImg = ref()
//签到函数
export const attendanceName = ref('每日签到')
export const attendanceButton = ref()
export const isShow = ref(false)
export const isAttendance = ref(false)
export const checkOk = ref(false)
export const changeImg = (num) => {
  switch (num) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 0
    case 4:
      return 1
    case 5:
      return 2
  }
}
//签到
export const attendance = async () => {
  //签到请求
  if (checkOk.value === false) {
    //旋转提示
    num.value = 0
    isPromptFunc()
    startRotating()
    await checkIn()
  } else {
    if (isShow.value === true) {
      isShow.value = false
    } else {
      //签到内容
      isShow.value = true
      attendanceTime()
    }
  }
}
export const checkOut = (isCheck, totalDays) => {
  isAttendance.value = isCheck
  //判断是否签到
  if (isAttendance.value === true) {
    attendanceName.value = `已签到${totalDays}天`
    attendanceButton.value.style.backgroundColor = 'lightpink'
    num.value = 1
    stopRotating()
    isPromptTime()
    //签到成功
    checkOk.value = true
  }
}
