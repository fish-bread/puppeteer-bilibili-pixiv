<!--suppress HtmlDeprecatedAttribute, HtmlUnknownAttribute, CssUnusedSymbol -->
<script setup>
import {
  num,
  text,
  promptImg,
  changeImg,
  isPrompt,
  stopRotating,
  rotating
} from '../../../function/search/click'
import { onMounted, computed } from 'vue'
import { promptWidth, promptHeight } from '../../../function/Window/window'
onMounted(() => {
  stopRotating()
})
const currentSvg = computed(() => {
  return changeImg(num.value) // 注意这里调用 changeImg 函数并传入 num.value
})
</script>

<template>
  <transition>
    <div v-show="isPrompt" class="prompt">
      <div class="prompt-text">{{ text[num].name }}</div>
      <div ref="promptImg" class="prompt-img" :class="{ rotating: rotating }">
        <!--正在签到-->
        <svg
          v-show="currentSvg === 0"
          t="1737268033617"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3075"
          width="20"
          height="20"
        >
          <path
            d="M941.728 137.152C941.728 122.304 932.576 109.152 919.456 103.424 905.728 97.728 889.728 100.576 879.456 111.424L805.152 185.152C724.576 109.152 615.456 64 502.88 64 261.152 64 64 261.152 64 502.88 64 744.576 261.152 941.728 502.88 941.728 633.728 941.728 757.152 884 840.576 783.424 846.304 776 846.304 765.152 839.456 758.88L761.152 680C757.152 676.576 752 674.88 746.88 674.88 741.728 675.424 736.576 677.728 733.728 681.728 677.728 754.304 593.728 795.424 502.88 795.424 341.728 795.424 210.304 664 210.304 502.88 210.304 341.728 341.728 210.304 502.88 210.304 577.728 210.304 648.576 238.88 702.304 288.576L623.456 367.424C612.576 377.728 609.728 393.728 615.456 406.88 621.152 420.576 634.304 429.728 649.152 429.728L905.152 429.728C925.152 429.728 941.728 413.152 941.728 393.152L941.728 137.152Z"
            p-id="3076"
          ></path>
        </svg>
        <!--签到成功-->
        <svg
          v-show="currentSvg === 1"
          t="1737268223572"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3429"
          width="20"
          height="20"
        >
          <path
            d="M479.287 761.117c-28.762 28.039-75.489 28.039-104.251 0l-234.739-229.703c-28.762-28.039-28.762-74.052 0-102.087s75.489-28.039 104.251 0l182.615 178.658 351.927-344.736c28.762-28.039 75.489-28.039 104.251 0s28.762 74.052 0 102.087l-404.048 395.781z"
            fill="#272636"
            p-id="3430"
          ></path>
        </svg>
        <!--签到失败-->
        <svg
          v-show="currentSvg === 2"
          t="1737268504469"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3639"
          width="20"
          height="20"
        >
          <path
            d="M886.528 908.032c-28.096 28.096-73.856 28.096-102.016 0L138.304 261.824c-28.096-28.16-28.16-73.856 0-102.016 28.032-28.16 73.792-28.16 102.08 0l646.144 646.144C914.624 834.24 914.752 879.872 886.528 908.032L886.528 908.032zM885.76 261.504 239.616 907.648c-28.224 28.224-73.92 28.224-102.08 0-28.16-28.096-28.16-73.728 0.064-102.016L783.744 159.552c28.224-28.16 73.984-28.16 102.016-0.064C913.984 187.648 913.856 233.344 885.76 261.504L885.76 261.504z"
            fill="#7F7F7F"
            p-id="3640"
          ></path>
        </svg>
      </div>
    </div>
  </transition>
</template>

<style scoped>
path {
  fill: currentColor;
}
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
img {
  width: 20px;
  height: 20px;
}
.prompt {
  width: 100px;
  height: 30px;
  background-color: lightpink;
  position: absolute;
  top: v-bind(promptHeight + 'px');
  left: v-bind(promptWidth + 'px');
  display: grid;
  grid-template-columns: auto 30px;
  align-items: center;
  border-radius: 3px;
  z-index: 5;
}
.prompt-text {
  box-sizing: border-box;
  padding: 0 0 0 5px;
}
.prompt-img {
  width: 30px;
  height: 30px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.prompt-img.rotating {
  animation: rotate 1s linear infinite; /* 添加 infinite 使其持续旋转 */
}
@keyframes rotate {
  from {
    transform: rotate(0deg); /* 动画起始状态 */
  }
  to {
    transform: rotate(360deg); /* 动画结束状态 */
  }
}
</style>
