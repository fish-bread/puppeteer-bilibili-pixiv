<!--suppress HtmlUnknownAttribute -->
<script setup>
import { isCopy, reloadPage, netImg } from '../../function/Window/window'
import { ref, onMounted } from 'vue'
import { isCopyTime } from '../../function/timeout/noticetime'
const href = ref()
onMounted(() => {
  href.value = window.location.href
  netImg.value.style.animationPlayState = 'paused'
})
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(href.value)
    isCopy.value = true
    isCopyTime()
  } catch (err) {
    console.error('复制失败:', err)
    // 可选：提供错误处理，例如显示一个错误消息
    alert('复制失败，请重试。')
  }
}
</script>

<template>
  <div class="page-net">
    <!--加载按钮-->
    <div ref="netImg" class="net-img" title="刷新" @click="reloadPage">
      <svg
        t="1737268033617"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3075"
        width="17"
        height="17"
      >
        <path
          d="M941.728 137.152C941.728 122.304 932.576 109.152 919.456 103.424 905.728 97.728 889.728 100.576 879.456 111.424L805.152 185.152C724.576 109.152 615.456 64 502.88 64 261.152 64 64 261.152 64 502.88 64 744.576 261.152 941.728 502.88 941.728 633.728 941.728 757.152 884 840.576 783.424 846.304 776 846.304 765.152 839.456 758.88L761.152 680C757.152 676.576 752 674.88 746.88 674.88 741.728 675.424 736.576 677.728 733.728 681.728 677.728 754.304 593.728 795.424 502.88 795.424 341.728 795.424 210.304 664 210.304 502.88 210.304 341.728 341.728 210.304 502.88 210.304 577.728 210.304 648.576 238.88 702.304 288.576L623.456 367.424C612.576 377.728 609.728 393.728 615.456 406.88 621.152 420.576 634.304 429.728 649.152 429.728L905.152 429.728C925.152 429.728 941.728 413.152 941.728 393.152L941.728 137.152Z"
          p-id="3076"
        ></path>
      </svg>
    </div>
    <!--链接-->
    <div class="net-link" title="链接" @click="copyToClipboard">{{ href }}</div>
    <div v-show="isCopy" class="ok">已复制</div>
  </div>
</template>

<style scoped>
path {
  fill: currentColor;
}
.ok {
  position: absolute;
  left: 80px;
  font-size: 14px;
  z-index: 5;
  box-sizing: border-box;
  padding: 2px;
  border-radius: 5px;
  height: 25px;
  line-height: 20px;
  background: lightpink;
  transform: translateY(-25px);
  transition: transform 1s ease;
}
img {
  width: 17px;
  height: 17px;
}
.net-img {
  margin-left: 5px;
  width: 25px;
  height: 25px;
  display: grid;
  align-items: center;
  justify-items: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  cursor: pointer;
  animation: rotate 1s linear infinite backwards;
}
@keyframes rotate {
  from {
    transform: rotate(0deg); /* 动画起始状态 */
  }
  to {
    transform: rotate(360deg); /* 动画结束状态 */
  }
}
.net-img:hover {
  background: lightpink;
}
.net-link {
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  line-height: 20px;
  height: 20px;
  width: fit-content;
  font-size: 13px;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap;
  text-align: center;
}
.net-link:hover {
  background: lightpink;
}
.page-net {
  height: 30px;
  line-height: 30px;
  display: grid;
  align-items: center;
  grid-template-columns: 30px auto;
  position: relative;
}
</style>
