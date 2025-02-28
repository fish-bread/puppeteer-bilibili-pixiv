<script setup>
import PageNet from '../pageNet/pageNet.vue'
import HeaderIndex from '../header/headerIndex.vue'
import {
  backgroundIndex,
  leftHeight,
  okHeight,
  promptHeight,
  promptWidth,
  windowHeight,
  windowWidth
} from '../../function/Window/window'
import router from '../../router'
import { computed, onMounted, onUnmounted } from 'vue'
import { Data } from '../../axios/iframe'
import { user, userSetClick } from '../../function/user'
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
  user.userAppSet = await window.api.firstSavePath()
  console.log(user.userAppSet)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize) // 移除监听器
})
const userAppSetRows = computed(() => {
  return `repeat(${user.userAppSet.length}, 30px)`
})
</script>

<template>
  <div ref="backgroundIndex" class="background">
    <header-index></header-index>
    <page-net></page-net>
    <div class="user-history-all">
      <!--标题-->
      <div class="user-all-text">
        <div class="user-text">用户应用设置</div>
        <button class="router-Back" @click="router.back()">返回</button>
      </div>
      <!--应用设置-->
      <div class="user-app-set" :style="{ 'grid-template-rows': userAppSetRows }">
        <div v-for="(item, index) in user.userAppSet" :key="index" class="user-app-set-item">
          <div>{{ item.text }}下载路径:</div>
          <div class="history-Recording">{{ item.inName }}</div>
          <button class="user-set-click" @click="userSetClick(index)">修改</button>
        </div>
      </div>
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
.router-Back:hover,
.user-set-click:hover {
  background-color: rgb(200, 200, 200);
}
.user-app-set {
  box-sizing: border-box;
  padding: 20px 0 0 0;
  display: grid;
  grid-row-gap: 10px;
  overflow: auto;
  overflow-x: hidden;
}
.user-app-set-item {
  display: grid;
  grid-template-columns: 100px auto 50px;
  align-items: center;
  justify-content: start;
}
.history-Recording {
  all: unset;
  margin-left: 10px;
  height: 30px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  line-height: 20px;
  transition: background-color 0.2s ease;
  overflow-y: hidden;
  white-space: nowrap;
}
.user-set-click {
  all: unset;
  height: 30px;
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  cursor: pointer;
  background-color: transparent;
  color: currentColor;
  transition: background-color 0.2s ease;
  text-align: center;
}
</style>
