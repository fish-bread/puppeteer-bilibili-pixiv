<script setup>
import { onUnmounted } from 'vue'
import HeaderButton from './components/headerButton.vue'
import OtherWork from './components/otherWork.vue'
onUnmounted(() => {})
</script>

<template>
  <div ref="header" class="header">
    <!--占位-->
    <other-work></other-work>
    <!--应用控制-->
    <header-button></header-button>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  height: 30px;
  display: grid;
  grid-template-columns: auto 120px;
  justify-items: center;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  position: relative;
}
img {
  width: 20px;
  height: 20px;
}
</style>
