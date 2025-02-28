<script setup>
import {
  attendance,
  attendanceName,
  attendanceButton,
  isShow
} from '../../../function/search/click'
import { leftHeight } from '../../../function/Window/window'
</script>

<template>
  <!--每日签到-->
  <div class="body-right">
    <!--签到按钮-->
    <button ref="attendanceButton" class="right-sign" @click="attendance">
      {{ attendanceName }}
    </button>
    <!--签到内容-->
    <transition>
      <div v-show="isShow" class="right-text">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;祝您快乐每一天</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.5s ease,
    transform 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(230px);
}
img {
  width: 20px;
  height: 20px;
}
.body-right {
  position: relative;
  width: 230px;
  height: v-bind(leftHeight + 'px');
  display: grid;
  grid-template-rows: 30px auto;
  grid-row-gap: 10px;
  justify-items: end;
  box-sizing: border-box;
  border-radius: 5px;
}
.right-sign {
  all: unset;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.right-sign:hover {
  background-color: rgb(190, 190, 190);
}
.right-text {
  position: relative;
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
  width: 230px;
  height: 400px;
  background-color: lightpink;
  border-radius: 5px;
}
</style>
