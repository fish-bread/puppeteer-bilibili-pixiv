<!--suppress HtmlUnknownTag, CssInvalidHtmlTagReference -->
<script setup>
import { onMounted, onUnmounted, nextTick, computed, onUpdated } from 'vue'
import HeaderIndex from '../header/headerIndex.vue'
import PageNet from '../pageNet/pageNet.vue'
import { backgroundIndex } from '../../function/Window/window'
import { leftHeight, windowWidth, updateWindowSize } from '../../function/Window/window'
import { Data } from '../../axios/iframe'
import { isLocalVideo, localVideo, LocalVideoList } from './LocalVideo'
import { isLocalAudio, localAudio, LocalAudioList } from './localAudio'
import { isLocalPhoto, localPhoto, LocalPhotoList } from './LocalPhoto'
import router from '../../router'
//视频
import 'vidstack/bundle'
import { SPANISH } from './i18r'
import {
  localListRef,
  selectedButtonId,
  setVideo,
  setAudio,
  setPhoto,
  videoButtonId,
  audioButtonId,
  photoButtonId,
  currentVideoSrc,
  currentAudioSrc,
  currentPhotoSrc
} from './localAll'
onMounted(async () => {
  await Data()
  await updateWindowSize()
  window.addEventListener('resize', updateWindowSize) // 监听窗口大小变化
  await localVideo()
  await localAudio()
  await localPhoto()
  // 等待 DOM 更新
  await nextTick()
  const layoutVideo = document.querySelector('media-video-layout')
  const layoutAudio = document.querySelector('media-audio-layout')
  layoutVideo.translations = SPANISH
  layoutAudio.translations = SPANISH
})
onUpdated(async () => {
  console.log(selectedButtonId.value)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize) // 移除监听器
})
const videoRows = computed(() => {
  return `repeat(${LocalVideoList.value.length}, 30px)`
})
const audioRows = computed(() => {
  return `repeat(${LocalAudioList.value.length}, 30px)`
})
const photoRows = computed(() => {
  return `repeat(${LocalPhotoList.value.length}, 30px)`
})
</script>

<template>
  <div ref="backgroundIndex" class="background">
    <header-index></header-index>
    <page-net></page-net>
    <div class="user-history-all">
      <!--标题-->
      <div class="user-all-text">
        <div class="user-text">用户本地资源</div>
        <button class="router-Back" @click="router.back()">返回</button>
      </div>
      <!--用户本地资源-->
      <div class="user-video">
        <!--左侧-->
        <!--视频-->
        <div v-show="selectedButtonId === 0 && isLocalVideo === 1" class="user-video-inner">
          <media-player :title="currentVideoSrc.name" :src="currentVideoSrc.path" view-type="video">
            <media-provider></media-provider>
            <media-video-layout></media-video-layout>
          </media-player>
        </div>
        <div v-if="selectedButtonId === 0 && isLocalVideo === 0">什么都没有</div>
        <!--音频-->
        <div v-show="selectedButtonId === 1 && isLocalAudio === 1" class="user-audio-inner">
          <media-player :title="currentAudioSrc.name" :src="currentAudioSrc.path" view-type="audio">
            <media-provider></media-provider>
            <media-audio-layout></media-audio-layout>
          </media-player>
        </div>
        <div v-if="selectedButtonId === 1 && isLocalAudio === 0">什么都没有</div>
        <!--图片-->
        <div v-if="selectedButtonId === 2 && isLocalPhoto === 1" class="user-video-inner">
          <div class="user-img-inner">
            <img id="photo" :src="currentPhotoSrc.path" :title="currentPhotoSrc.name" alt="" />
          </div>
        </div>
        <div v-if="selectedButtonId === 2 && isLocalPhoto === 0">什么都没有</div>
        <!--右侧-->
        <ul>
          <div class="user-local-list">
            <button
              v-for="(button, index) in localListRef"
              :key="index"
              class="router-Back"
              :class="{ selected: selectedButtonId === button.id }"
              @click="selectedButtonId = button.id"
            >
              {{ button.name }}
            </button>
          </div>
          <!--视频数组-->
          <li
            v-if="selectedButtonId === 0"
            class="user-video-li"
            :style="{ 'grid-template-rows': videoRows }"
          >
            <button
              v-for="(video, index) in LocalVideoList"
              :key="index"
              :title="video.name"
              class="user-video-li-name"
              :class="{ selected: videoButtonId === index }"
              @click="setVideo(video, index)"
            >
              {{ video.name }}
            </button>
          </li>
          <!--音频数组-->
          <li
            v-if="selectedButtonId === 1"
            class="user-video-li"
            :style="{ 'grid-template-rows': audioRows }"
          >
            <button
              v-for="(audio, index) in LocalAudioList"
              :key="index"
              :title="audio.name"
              class="user-video-li-name"
              :class="{ selected: audioButtonId === index }"
              @click="setAudio(audio, index)"
            >
              {{ audio.name }}
            </button>
          </li>
          <!--图片数组-->
          <li
            v-if="selectedButtonId === 2"
            class="user-video-li"
            :style="{ 'grid-template-rows': photoRows }"
          >
            <button
              v-for="(photo, index) in LocalPhotoList"
              :key="index"
              :title="photo.name"
              class="user-video-li-name"
              :class="{ selected: photoButtonId === index }"
              @click="setPhoto(photo, index)"
            >
              {{ photo.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul {
  width: 100%;
  height: 100%;
  all: unset;
  display: grid;
  grid-template-rows: 30px 1fr;
  align-items: start;
}
li {
  all: unset;
  height: v-bind(leftHeight - 70 + 'px');
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 5px;
  overflow-y: auto;
}
.background {
  transition:
    background-color 0.3s linear,
    color 0.3s linear;
  position: relative;
}
.user-img-inner {
  display: grid;
  align-items: start;
  justify-items: center;
  width: 100%;
  height: v-bind(leftHeight - 70 + 'px');
  overflow: hidden;
}
.user-img-inner img {
  all: unset;
  display: block;
  object-fit: contain;
  max-width: 60%;
  max-height: 60%;
}
.user-video-li-name {
  width: 300px;
  all: unset;
  display: grid;
  line-height: 30px;
  background-color: transparent;
  color: currentColor;
  transition: background-color 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 0 0 5px;
  border-radius: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.user-video-li-name:hover {
  background-color: lightpink;
}
.user-video-li-name.selected {
  background-color: lightpink !important;
}
.user-video-inner {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  display: grid;
  justify-items: center;
  align-items: start;
}
.user-audio-inner {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  display: grid;
  justify-items: center;
  align-items: center;
}
.user-local-list {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  justify-items: center;
  align-items: center;
}
.user-video {
  all: unset;
  display: grid;
  grid-template-columns: 1fr 300px;
  width: v-bind(windowWidth + 'px');
}
.user-history-all {
  display: grid;
  grid-template-rows: 40px auto;
  box-sizing: border-box;
  height: v-bind(leftHeight + 'px');
}
.user-all-text {
  box-sizing: border-box;
  padding-left: 10px;
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
.router-Back.selected {
  background-color: lightpink !important;
}
</style>
