// stores/counter.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('user', () => {
  //用户信息
  const user = ref([
    { id: 0, name: '昵称', inName: '', last: '修改' },
    { id: 1, name: '密码', inName: '', last: '修改' },
    { id: 2, name: `账号  ID`, inName: '', last: '注销账号' },
    { id: 3, name: '账号状态', inName: '', last: '' },
    { id: 4, name: '头像', inName: '', last: '' },
    { id: 5, name: '背景样式', inName: '', last: '' },
    { id: 6, name: '下载路径', inName: '', last: '' }
  ])
  const userSet = ref([
    { id: 0, name: '昵称', inName: '' },
    { id: 1, name: '密码', inName: '' }
  ])
  const userCookie = ref([
    { id: 0, name: 'b站', inName: '', play: 'bilibiliCookie' },
    { id: 1, name: 'p站', inName: '', play: 'pixivCookie' },
    { id: 2, name: '网易', inName: '', play: '网易云Cookie' }
  ])
  const userAppSet = ref([
    { id: 0, inName: '', text: '视频' },
    { id: 1, inName: '', text: '图片' },
    { id: 2, inName: '', text: '音频' }
  ])
  const userHistory = ref([])

  return { user, userAppSet, userHistory, userCookie, userSet }
})
