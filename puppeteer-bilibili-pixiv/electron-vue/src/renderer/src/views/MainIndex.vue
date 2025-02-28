<script setup>
import { onBeforeUnmount, onMounted, onUnmounted } from 'vue'
import HeaderIndex from './header/headerIndex.vue'
import BodyIndex from './body/bodyIndex.vue'
import { Data, firstCheckIn } from '../axios/iframe'
import { backgroundIndex } from '../function/Window/window'
import {
  noticeTimeId,
  isPromptTimeId,
  attendanceTimeId,
  isCopyTimeId
} from '../function/timeout/noticetime'
import BodyPrompt from './body/components/bodyPrompt.vue'
//加载用户
onBeforeUnmount(() => {
  clearTimeout(noticeTimeId)
  clearTimeout(isPromptTimeId)
  clearTimeout(attendanceTimeId)
  clearTimeout(isCopyTimeId)
})
//获取窗口宽高
import { updateWindowSize } from '../function/Window/window'
import PageNet from './pageNet/pageNet.vue'
onMounted(async () => {
  await window.api.firstSavePath()
  await Data()
  await firstCheckIn()
  await updateWindowSize()
  window.addEventListener('resize', updateWindowSize) // 监听窗口大小变化
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize) // 移除监听器
})
</script>

<template>
  <div ref="backgroundIndex" class="background">
    <!--头部控制组件-->
    <header-index></header-index>
    <!--浏览器链接-->
    <page-net></page-net>
    <!--主体-->
    <body-index></body-index>
    <!--提示-->
    <body-prompt></body-prompt>
  </div>
</template>

<style scoped>
.background {
  transition:
    background-color 0.3s linear,
    color 0.3s linear;
  position: relative; /* 为了定位伪元素 */
}
</style>
