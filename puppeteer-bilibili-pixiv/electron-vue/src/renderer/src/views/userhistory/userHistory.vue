<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import HeaderIndex from '../header/headerIndex.vue'
import PageNet from '../pageNet/pageNet.vue'
import { backgroundIndex } from '../../function/Window/window'
import {
  leftHeight,
  okHeight,
  promptHeight,
  promptWidth,
  windowHeight,
  windowWidth
} from '../../function/Window/window'
import { Data, userHistoryAxios } from '../../axios/iframe'
import router from '../../router'
import { user, deleteUserHistory, history } from '../../function/user'
async function updateWindowSize() {
  //窗体宽度,窗体高度
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  //提示宽度,提示高度
  promptHeight.value = window.innerHeight - 100
  promptWidth.value = window.innerWidth - 100
  //左侧高度
  leftHeight.value = window.innerHeight - 60
  //列表高度
  okHeight.value = leftHeight.value - 140
}
onMounted(async () => {
  await Data()
  await updateWindowSize()
  window.addEventListener('resize', updateWindowSize) // 监听窗口大小变化
  await userHistoryAxios()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize) // 移除监听器
})

const historyRows = computed(() => {
  return `repeat(${user.userHistory.length}, 30px)`
})
</script>

<template>
  <div ref="backgroundIndex" class="background">
    <header-index></header-index>
    <page-net></page-net>
    <div class="user-history-all">
      <!--标题-->
      <div class="user-all-text">
        <div class="user-text">用户搜索历史</div>
        <button class="router-Back" @click="router.back()">返回</button>
      </div>
      <!--用户历史-->
      <div
        v-show="history === true"
        class="user-history-search"
        :style="{ 'grid-template-rows': historyRows }"
      >
        <div v-for="(item, index) in user.userHistory" :key="index" class="user-history-item">
          <div class="history-Recording" :title="item.title">{{ item.title }}</div>
          <div class="router-Back" @click="deleteUserHistory(item.id)">删除</div>
        </div>
      </div>
      <div v-show="history === false">什么都没有</div>
    </div>
  </div>
</template>

<style scoped>
.background {
  transition:
    background-color 0.3s linear,
    color 0.3s linear;
  position: relative; /* 为了定位伪元素 */
}
.user-history-all {
  display: grid;
  grid-template-rows: 40px auto;
  padding-left: 10px;
  box-sizing: border-box;
  height: v-bind(leftHeight + 'px');
}
.user-history-item {
  display: grid;
  grid-template-columns: auto 50px;
  align-items: center;
  justify-items: center;
  justify-content: start;
}
.user-history-search::-webkit-scrollbar {
  display: none;
}
.user-history-search {
  box-sizing: border-box;
  padding: 20px 0 0 0;
  display: grid;
  grid-row-gap: 10px;
  overflow: auto;
  overflow-x: hidden;
}
.user-all-text {
  font-size: 30px;
  line-height: 40px;
  display: grid;
  grid-template-columns: 180px 60px;
  grid-column-gap: 20px;
  align-items: center;
}
.router-Back {
  width: 40px;
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  background-color: transparent;
  color: currentColor;
  transition: background-color 0.2s ease;
}
.router-Back:hover {
  background-color: rgb(200, 200, 200);
}
.history-Recording {
  all: unset;
  margin-left: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  line-height: 20px;
  transition: background-color 0.2s ease;
  overflow-y: hidden;
  white-space: nowrap;
}
.history-Recording::-webkit-scrollbar {
  display: none;
}
.history-Recording:hover {
  background-color: rgb(190, 190, 190);
}
</style>
