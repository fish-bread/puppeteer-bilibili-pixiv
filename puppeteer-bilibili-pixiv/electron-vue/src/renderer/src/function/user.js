import { ref } from 'vue'
import { changeUserName, changeUserPassword, deleteUser, updateUserHistory } from '../axios/iframe'
import { debounce } from 'lodash'
//pinia
import pinia from '../stores/index'
import { useCounterStore } from '../stores/counter'
export const user = useCounterStore(pinia)
export const file = ref()
//聚焦图片
export const hoverImg = ref(false)
export const enterHover = () => {
  hoverImg.value = true
}
export const leaveHover = () => {
  hoverImg.value = false
}
//用户
export const changeUser = debounce(async (index) => {
  switch (index) {
    case 0:
      //更改名称
      if (user.userSet[0].inName.length > 16 || user.userSet[0].inName.length <= 0) {
        user.userSet[0].inName = user.userSet[0].inName.slice(0, 16)
        console.log('执行大于')
      } else {
        await changeUserName()
        console.log('修改名字成功')
      }
      break
    case 1:
      //更改密码
      if (user.userSet[1].inName.length > 16 || user.userSet[1].inName.length <= 0) {
        user.userSet[1].inName = user.userSet[1].inName.slice(0, 16)
        console.log('执行大于')
      } else {
        await changeUserPassword()
        console.log('修改密码成功')
      }
      break
  }
}, 1000)
//注销
export const logoutFalse = async () => {
  console.log('注销1')
  await deleteUser()
}
//退出登录
export const closeUserLogin = async () => {
  await window.api.sendLoginWindow()
}
//上传图片最新办法
export const isUserHeadshot = ref(false)
export const isUserBackground = ref(false)
export const UploadHeadImage = async () => {
  isUserHeadshot.value = true
}
//用户文件地址设置
export const userSetClick = async (index) => {
  switch (index) {
    case 0:
      user.userAppSet = await window.api.savePath(index)
      console.log('文件地址', user.userAppSet)
      break
    case 1:
      user.userAppSet = await window.api.savePath(index)
      console.log('文件地址', user.userAppSet)
      break
    case 2:
      user.userAppSet = await window.api.savePath(index)
      console.log('文件地址', user.userAppSet)
      break
  }
}
//更新用户历史
export const history = ref()
export const deleteUserHistory = async (userHistory_id) => {
  await updateUserHistory(userHistory_id)
}
