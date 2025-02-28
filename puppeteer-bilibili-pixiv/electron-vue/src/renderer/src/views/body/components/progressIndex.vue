<script setup>
import { isSearchOk, progressWidth } from '../../../function/search/search'
</script>

<template>
  <div v-show="isSearchOk" class="search-progress-body">
    <!--进度条外侧-->
    <div class="search-body-progress">
      <!--进度-->
      <div class="search-progress" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>

<style scoped>
.search-progress-body {
  display: grid;
}
.search-body-progress {
  border-radius: 15px;
  width: 500px;
  height: 10px;
  box-sizing: border-box;
  border: 2px solid #ccc;
}
.search-progress {
  border-radius: 15px;
  width: 0;
  height: 6px;
  transition: width 0.5s linear;
  background-color: lightpink;
}
</style>
