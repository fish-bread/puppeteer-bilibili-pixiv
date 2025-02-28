<script setup>
import { leftHeight, okHeight, backgroundColor } from '../../../function/Window/window'
import { changeSet, isHistory, chooseBack, changeUserSet } from '../../../function/hide/changeSet'
import { ref, computed, onMounted } from 'vue'
import { user } from '../../../function/user'
import router from '../../../router'
//测试
const items = ref([
  { id: 1, content: 'Item 1' },
  { id: 2, content: 'Item 2' },
  { id: 3, content: 'Item 3' },
  { id: 4, content: 'Item 4' }
  // ... more items
])
//主页
const set = ref([
  { id: 0, content: '主题' },
  { id: 1, content: '搜索历史' },
  { id: 2, content: '用户设置' },
  { id: 3, content: '快捷链接' },
  { id: 4, content: '本地资源' },
  { id: 5, content: '退出登录' }
])
//背景颜色
const background = ref([
  { id: 0, content: '浅色' },
  { id: 1, content: '深色' },
  { id: 2, content: '自定义背景(未完善)' }
])
//用户设置
const userSet = ref([
  { id: 0, content: '用户信息' },
  { id: 1, content: '应用设置' },
  { id: 2, content: '注销登录' }
])
//快捷链接
const net = ref([
  { id: 0, content: '抖音', url: 'https://www.douyin.com/' },
  { id: 1, content: 'b站', url: 'https://www.bilibili.com/' }
])
const netRows = computed(() => {
  return `repeat(${net.value.length}, 30px)`
})
const gridRows = computed(() => {
  return `repeat(${items.value.length}, 30px)`
})
const setRows = computed(() => {
  return `repeat(${set.value.length}, 30px)`
})
const backgroundRows = computed(() => {
  return `repeat(${background.value.length}, 30px)`
})
const openExternalLink = async (url) => {
  await window.api.shellNetwork(url)
  console.log('链接', url)
}
onMounted(() => {})
const ok = async () => {
  await router.push('/user')
}
</script>

<template>
  <!--左侧用户-->
  <div class="body-left">
    <!--用户-->
    <div class="body-user">
      <!--头像-->
      <div class="user-img" @click="ok">
        <img :src="user.user[4].inName" alt="" />
      </div>
      <!--名字-->
      <div class="user-text">{{ user.user[0].inName }}</div>
    </div>
    <!--返回选择-->
    <button v-show="isHistory !== 0" class="choose-back" @click="chooseBack">返回</button>
    <!--切换内容-->
    <div v-show="isHistory === 0" class="choose-content" :style="{ 'grid-template-rows': setRows }">
      <button
        v-for="(item, index) in set"
        :key="index"
        class="history-Recording"
        @click="changeSet(index)"
      >
        {{ item.content }}
      </button>
    </div>
    <!--主题-->
    <div v-show="isHistory === 1" class="body-history">
      <div class="history-text">主题</div>
      <!--主题调整-->
      <div class="history-all" :style="{ 'grid-template-rows': backgroundRows }">
        <button
          v-for="(item, index) in background"
          :key="index"
          class="history-Recording"
          @click="backgroundColor(index)"
        >
          {{ item.content }}
        </button>
      </div>
    </div>
    <!--搜索历史-->
    <!--div v-show="isHistory === 2" class="body-history">
      <div class="history-text">历史搜索</div>
      <历史记录-->
    <!--div class="history-all" :style="{ 'grid-template-rows': gridRows }">
        <button v-for="(item, index) in items" :key="index" class="history-Recording">
          {{ item.content }}
        </button>
      </div>
    </div-->
    <!--用户设置-->
    <div v-show="isHistory === 3" class="body-history">
      <div class="history-text">用户设置</div>
      <!--用户设置-->
      <div class="history-all" :style="{ 'grid-template-rows': gridRows }">
        <button
          v-for="(item, index) in userSet"
          :key="index"
          class="history-Recording"
          @click="changeUserSet(index)"
        >
          {{ item.content }}
        </button>
      </div>
    </div>
    <!--快捷链接-->
    <div v-show="isHistory === 4" class="body-history">
      <div class="history-text">快捷链接</div>
      <div class="history-all" :style="{ 'grid-template-rows': netRows }">
        <button
          v-for="(item, index) in net"
          :key="index"
          class="history-Recording"
          @click="openExternalLink(item.url)"
        >
          <a href="#">
            {{ item.content }}
          </a>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: currentColor;
}
img {
  width: 40px;
  height: 40px;
}
.body-left {
  box-sizing: border-box;
  padding-left: 10px;
  width: 100%;
  height: v-bind(leftHeight + 'px'); /* 动态绑定高度 */
  display: grid;
  grid-template-rows: 80px v-bind(okHeight + 50 + 'px');
  grid-row-gap: 10px;
  justify-items: center;
}
.body-user {
  display: grid;
  grid-template-rows: 50px auto;
  justify-items: center;
  align-items: center;
}
.user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.3s ease;
}
.user-img:hover {
  transform: scale(1.2);
}
.user-text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap;
  text-align: center;
}
.body-history {
  height: 100%;
  box-sizing: border-box;
  width: 220px;
  position: relative;
  display: grid;
  grid-template-rows: 30px auto;
  grid-row-gap: 5px;
}
.history-text {
  line-height: 30px;
  box-sizing: border-box;
}
.history-all {
  display: grid;
  grid-row-gap: 10px;
  height: v-bind(okHeight + 'px');
  overflow-y: auto;
  position: relative;
}
.history-all::-webkit-scrollbar {
  display: none;
}
.history-Recording {
  all: unset;
  margin-left: 10px;
  width: 200px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  line-height: 20px;
  transition: background-color 0.2s ease;
}
.history-Recording:hover {
  background-color: rgb(190, 190, 190);
}
.body-history::after,
.choose-content::after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  left: 10px;
  width: 200px;
  height: 2px;
  background-color: lightpink;
}
.choose-content {
  width: 100%;
  display: grid;
  grid-row-gap: 10px;
  position: relative;
}
.choose-back {
  all: unset;
  position: absolute;
  top: 20px;
  left: 25px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.choose-back:hover {
  background-color: rgb(190, 190, 190);
}
</style>
