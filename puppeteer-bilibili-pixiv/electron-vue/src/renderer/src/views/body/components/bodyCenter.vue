<!--suppress CssUnresolvedCustomProperty, HtmlDeprecatedAttribute, HtmlUnknownAttribute, HtmlUnknownAttribute -->
<script setup>
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'
import { updateTime, intervalId, currentTime } from '../../../function/timeout/localTime'
import { user, file } from '../../../function/user'
import {
  placeholderFunc,
  search,
  userSearch,
  download,
  closeDownload,
  isSearch,
  resource,
  size,
  downloadIn,
  videoRef,
  userChooseVideo,
  activeIndices,
  userChooseVideoDownload,
  bodySearch,
  videoLength
} from '../../../function/search/search'
import {
  searchWeb,
  searchNet,
  searchWebIndex,
  outWeb,
  isDisabled
} from '../../../function/search/click'
import ProgressIndex from './progressIndex.vue'
import { placeholderColor } from '../../../function/Window/window'

const ApproximateTime = ref([
  { id: 1, name: '上午好' },
  { id: 2, name: '中午好' },
  { id: 3, name: '下午好' },
  { id: 4, name: '晚上好' }
])
// 组件挂载时
onMounted(() => {
  updateTime() // 初始化时间
  intervalId.value = setInterval(updateTime, 1000) // 每秒更新一次
})
// 组件卸载前
onBeforeUnmount(() => {
  clearInterval(intervalId.value) // 清除计时器，防止内存泄漏
})
//计算属性
// 使用 computed 计算属性根据当前时间动态获取问候语索引
const number = computed(() => {
  const hour = new Date().getHours() // 获取当前小时
  if (hour >= 6 && hour < 12) {
    // 上午 6:00 - 11:59
    return 0 // 上午好
  } else if (hour >= 12 && hour < 14) {
    // 中午 12:00 - 13:59
    return 1 // 中午好
  } else if (hour >= 14 && hour < 18) {
    // 下午 14:00 - 17:59
    return 2 // 下午好
  } else {
    // 其他时间段 (包括晚上)
    return 3 // 晚上好
  }
})
const placeholderStyle = computed(() => {
  return {
    '--placeholder-color': placeholderColor.value
  }
})
</script>

<template>
  <div ref="bodySearch" class="body-search">
    <!--欢迎主件-->
    <div class="welcome">
      <div class="text">
        欢迎回来,{{ user.user[0].inName }},{{ ApproximateTime[number].name }},今天过得如何?
      </div>
      <div class="welcome-time">现在时间:&nbsp;{{ currentTime }}</div>
    </div>
    <!--指定网站-->
    <div class="choose-web-all">
      <div class="web-head">查询网站:</div>
      <div class="choose-web">
        <button
          v-for="(item, index) in searchWeb"
          :key="index"
          :disabled="isDisabled === false"
          :title="item.name"
          class="search-text"
          :class="{ active: searchWebIndex === index }"
          @click="searchNet(index)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    <!--搜索主件-->
    <div class="search-input">
      <input
        v-model="userSearch"
        :style="placeholderStyle"
        :placeholder="placeholderFunc(searchWebIndex)"
        @keydown.enter="search"
      />
      <div class="search-img">
        <button
          class="ok"
          style="width: 30px; height: 30px"
          title="开始搜索"
          :disabled="isDisabled === false"
          @click="search"
        >
          <svg
            t="1737270002300"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4488"
            width="25"
            height="25"
          >
            <path
              d="M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0"
              p-id="4489"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <!--视频或图片大小以及确认用户是否下载至本地-->
    <div v-show="isSearch === -1"></div>
    <div v-show="isSearch === 0" class="search-video-all">
      <div style="line-height: 30px" class="choose-Download-all">
        <div>寻找到{{ resource }}个{{ file }},请先选择您想下载的{{ file }}(默认1080p)</div>
        <button class="choose-button" @click="closeDownload">取消</button>
        <button class="choose-button" @click="userChooseVideoDownload">确认</button>
      </div>
      <div class="search-video-body">
        <button
          v-for="(item, index) in videoRef"
          :key="index"
          class="search-video"
          :title="item.name"
          :class="{ active: activeIndices.has(item.id) }"
          @click="userChooseVideo(item.id, item)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    <div v-show="isSearch === 1" class="choose-Download-all">
      <div>寻找到{{ resource }}个{{ file }},是否下载?</div>
      <button class="choose-button" @click="closeDownload">取消</button>
      <button class="choose-button" @click="download">确认</button>
    </div>
    <div v-show="isSearch === 2" class="choose-download-install">
      <div>正在下载,当前已下载&nbsp;{{ downloadIn }}MB&nbsp;/&nbsp;{{ size }}MB</div>
      <!--进度条-->
      <progress-index></progress-index>
    </div>
    <div v-show="isSearch === 3">
      第{{ videoLength + 1 }}个{{ file }}下载已完成,正在等待第{{ videoLength + 2 }}个视频下载,请稍后
    </div>
    <div v-show="isSearch === 4">服务器正在爬取资源,请稍后...({{ file }}越大,等待时间越长)</div>
    <div v-show="isSearch === 5">所有{{ file }}均下载完成</div>
    <div v-show="outWeb === 'pixiv'" class="annotation">
      (注:由于p站反爬防范强,为防止ip被封,请勿在一段时间内多次请求,还请谅解)
    </div>
    <div v-show="outWeb === 'bilibili'" class="annotation">
      (注:由于b站视频为音频与视频分开,导致服务器须先合并在一起再传输,传输速度较慢,还请谅解)
    </div>
    <div v-show="outWeb === '网易云'" class="annotation">(注:正在破解中,请勿查询,还请谅解)</div>
  </div>
</template>

<style scoped>
.search-video-all {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 30px 190px;
}
.search-video-body {
  display: grid;
  width: 500px;
  height: 190px;
  grid-template-columns: repeat(5, 92px);
  grid-template-rows: repeat(5, 30px);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.search-video {
  all: unset;
  box-sizing: border-box;
  padding: 0 0 0 5px;
  height: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}
.search-video:hover {
  background-color: rgb(190, 190, 190);
}
.search-video.active {
  background-color: lightpink;
}
path {
  fill: currentColor;
}
img {
  margin-left: 2px;
  width: 25px;
  height: 25px;
  border-radius: 5px;
}
input {
  caret-color: lightpink;
  box-sizing: border-box;
  margin: 0;
  outline: none;
  width: auto;
  height: 39px;
  font-size: 16px;
  font-weight: bold;
  padding: 0 0 0 10px;
  border: none;
  background-color: transparent;
  color: currentColor;
}
input::placeholder {
  /*字体设计*/
  color: var(--placeholder-color);
  font-weight: bold;
  font-size: 16px;
  transition: color 0.3s ease;
}
.body-search {
  margin-top: 80px;
  width: 500px;
  height: 385px;
  display: grid;
  align-items: start;
  justify-items: center;
  grid-template-rows: 45px 30px 45px 220px;
  grid-row-gap: 15px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.annotation {
  position: absolute;
  top: 150px;
  font-size: 12px;
  font-weight: bold;
}
.search-input {
  display: grid;
  grid-template-columns: auto 40px;
  box-sizing: border-box;
  height: 45px;
  width: 500px;
  border: 3px solid rgb(204, 204, 204);
  transition: border 0.3s ease;
  position: relative;
}
.search-input:focus-within {
  border: 3px solid lightpink;
}
.search-input:hover {
  border: 3px solid lightpink;
}
.search-img {
  width: 40px;
  height: 40px;
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
}
.search-img::after {
  content: '';
  width: 3px;
  height: 25px;
  display: block;
  position: absolute;
  top: 7px;
  left: 0;
  z-index: 5;
  background-color: rgb(204, 204, 204);
}
.ok {
  all: unset;
  margin-left: 3px;
  display: grid;
  justify-items: center;
  align-items: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  cursor: pointer;
}
.ok:hover {
  background-color: lightpink;
}
.search-text,
.choose-button {
  all: unset;
  display: grid;
  align-items: center;
  justify-items: center;
  height: 30px;
  width: 50px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.search-text:hover {
  background-color: rgb(190, 190, 190);
}
.search-text.active {
  background-color: lightpink;
}
.choose-web-all {
  width: 500px;
  display: grid;
  align-items: center;
  grid-template-columns: 90px auto;
}
.choose-web {
  position: relative;
  width: 400px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 80px 80px 80px 80px 80px;
  grid-template-rows: 30px;
  grid-row-gap: 10px;
  box-sizing: border-box;
}
.choose-web::-webkit-scrollbar {
  display: none;
}
.choose-Download-all {
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 400px 50px 50px;
}
.choose-button:hover {
  background-color: lightpink;
}
.welcome-time {
  display: grid;
  justify-items: center;
}
</style>
