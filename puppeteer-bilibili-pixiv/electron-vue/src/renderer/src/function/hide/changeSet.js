import { ref } from 'vue'
import { closeUserLogin, logoutFalse } from '../user'
import router from '../../router'
export const isHistory = ref(0)
export const chooseBack = () => {
  isHistory.value = 0
}
export const changeSet = async (index) => {
  switch (index) {
    case 0:
      isHistory.value = 1
      break
    case 1:
      await router.push('/UserHistory')
      break
    case 2:
      isHistory.value = 3
      break
    case 3:
      isHistory.value = 4
      break
    case 4:
      await router.push('/userLocalIndex')
      break
    case 5:
      await closeUserLogin()
      break
    default:
      break
  }
}
//导航
export const changeUserSet = async (index) => {
  switch (index) {
    case 0:
      await router.push('/user')
      break
    case 1:
      await router.push('/appSet')
      break
    case 2:
      await logoutFalse()
      break
  }
}
