<script setup>
import BodyRight from './components/bodyRight.vue'
import BodyCenter from './components/bodyCenter.vue'
import BodyLeft from './components/bodyLeft.vue'
import { leftHeight } from '../../function/Window/window'
import TipsBackground from './components/TipsBackground.vue'
</script>

<template>
  <!--页面-->
  <div class="body-all">
    <!--背景-->
    <tips-background></tips-background>
    <!--左侧-->
    <body-left></body-left>
    <!--主体-->
    <body-center></body-center>
    <!--右侧-->
    <body-right></body-right>
  </div>
</template>

<style scoped>
.body-all {
  position: relative;
  height: v-bind(leftHeight + 'px');
  display: grid;
  grid-template-columns: 230px auto 230px;
  justify-items: center;
}
</style>
