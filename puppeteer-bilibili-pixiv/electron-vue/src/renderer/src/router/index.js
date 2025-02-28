import { createRouter, createWebHashHistory } from 'vue-router'
import MainIndex from '../views/MainIndex.vue'
import loginIndex from '../views/login/LoginIndex.vue'
import UserIndex from '../views/user/userIndex.vue'
import UserHistory from '../views/userhistory/userHistory.vue'
import AppSet from '../views/appSet/appSet.vue'
import userLocalIndex from '../views/userLocal/localIndex.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // 使用 Hash 模式
  routes: [
    {
      path: '/Login',
      component: loginIndex
    },
    {
      path: '/Home',
      component: MainIndex
    },
    {
      path: '/user',
      component: UserIndex
    },
    {
      path: '/userHistory',
      component: UserHistory
    },
    {
      path: '/appSet',
      component: AppSet
    },
    {
      path: '/userLocalIndex',
      component: userLocalIndex
    },
    {
      path: '/:pathMatch(.*)*', // 注意这里，使用通配符,用于设计其他`路由导向
      redirect: '/Login'
    }
  ]
})
export default router
