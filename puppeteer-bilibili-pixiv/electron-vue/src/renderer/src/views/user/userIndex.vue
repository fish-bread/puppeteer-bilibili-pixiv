<!--suppress ALL -->
<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import {
  backgroundIndex,
  leftHeight,
  okHeight,
  placeholderColor,
  promptHeight,
  promptWidth,
  windowHeight,
  windowWidth
} from '../../function/Window/window'
import HeaderIndex from '../header/headerIndex.vue'
import PageNet from '../pageNet/pageNet.vue'
import { Data, uploadCookie } from '../../axios/iframe'
import router from '../../router'
import {
  user,
  hoverImg,
  enterHover,
  leaveHover,
  changeUser,
  UploadHeadImage
} from '../../function/user'
import TipsDialog from '../body/components/TipsDialog.vue'
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
  //修改用户
  user.userSet[0].inName = user.user[0].inName
  user.userSet[1].inName = user.user[1].inName
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize) // 移除监听器
})
const userRows = computed(() => {
  return `repeat(${user.userSet.length + 1}, 34px)`
})
const placeholderStyle = computed(() => {
  return {
    '--placeholder-color': placeholderColor.value
  }
})
</script>

<template>
  <div ref="backgroundIndex" class="background">
    <header-index></header-index>
    <page-net></page-net>
    <!--用户信息-->
    <div class="user-all">
      <!--用户头像-->
      <tips-dialog></tips-dialog>
      <!--标题-->
      <div class="user-all-text">
        <div class="user-text">编辑个人信息</div>
        <button class="router-Back" @click="router.back()">返回</button>
      </div>
      <!--修改设置-->
      <div class="change-all">
        <!--遍历修改-->
        <div class="change-all-left">
          <!--用户基础-->
          <div class="change-all-left-top" :style="{ 'grid-template-rows': userRows }">
            <div v-for="(item, index) in user.userSet" :key="index" class="change-user">
              <!--遍历用户-->
              <div>{{ item.name }}&nbsp;:</div>
              <div class="user-input">
                <input v-model="item.inName" />
              </div>
              <button class="form-out" @click="changeUser(index)">修改</button>
            </div>
            <!--uid-->
            <div class="user-UID">UID&nbsp;&nbsp;:&nbsp;&nbsp; {{ user.user[2].inName }}</div>
          </div>
          <!--用户cookie-->
          <div class="change-all-left-top" style="grid-template-rows: 30px 30px 30px">
            <div v-for="(item, index) in user.userCookie" :key="index" class="change-user">
              <div>{{ item.name }}&nbsp;:</div>
              <div class="user-input">
                <input v-model="item.inName" :style="placeholderStyle" :placeholder="item.play" />
              </div>
              <button class="form-out" @click="uploadCookie(item.name, item.inName)">修改</button>
            </div>
          </div>
        </div>
        <!--头像-->
        <div class="change-all-right">
          <div class="user-img" @mouseenter="enterHover" @mouseleave="leaveHover">
            <img :src="user.user[4].inName" alt="" />
          </div>
          <!--修改头像-->
          <div
            v-show="hoverImg"
            class="hover-img"
            @mouseenter="enterHover"
            @mouseleave="leaveHover"
            @click="UploadHeadImage"
          >
            <div class="hover-headshot">修改图片</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  padding-left: 5px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  outline: none;
  border: 2px solid rgb(204, 204, 204);
  transition: border 0.3s ease;
  color: currentColor;
  background-color: transparent;
  font-size: 15px;
  font-weight: bold;
}
input::placeholder {
  /*字体设计*/
  color: var(--placeholder-color);
  font-weight: bold;
  font-size: 16px;
  transition: color 0.3s ease;
}
input:focus-within {
  border: 2px solid lightpink;
}
input:hover {
  border: 2px solid lightpink;
}
.background {
  transition:
    background-color 0.3s linear,
    color 0.3s linear;
  position: relative; /* 为了定位伪元素 */
}
img {
  width: 110px;
  height: 110px;
}
.user-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;
}
.hover-img {
  position: absolute;
  z-index: 5;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  cursor: pointer;
  align-items: center;
  justify-items: center;
}
.hover-headshot {
  width: 110px;
  height: 110px;
  background: rgba(204, 204, 204, 0.5);
  display: grid;
  align-items: center;
  justify-items: center;
}
.user-all {
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
.change-all {
  padding-top: 20px;
  padding-left: 100px;
  box-sizing: border-box;
  display: grid;
  height: v-bind(leftHeight - 40 +'px');
  grid-template-columns: 600px 370px;
}
.change-all-left {
  display: grid;
  grid-row-gap: 40px;
  grid-template-rows: 142px auto;
}
.change-all-left-top {
  display: grid;
  grid-row-gap: 20px;
  height: 142px;
}
.change-all-right {
  display: grid;
  justify-items: center;
}
.change-user {
  width: 100%;
  padding: 2px 20px 2px 5px;
  box-sizing: border-box;
  height: 34px;
  line-height: 30px;
  display: grid;
  grid-template-columns: 50px auto 45px;
}
.user-input {
  display: grid;
  align-items: center;
}
.user-UID {
  padding: 2px 20px 2px 5px;
  box-sizing: border-box;
  height: 34px;
  line-height: 30px;
  font-size: 15px;
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
.form-out {
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  font-size: 16px;
  background-color: transparent;
  color: currentColor;
  transition: background-color 0.2s ease;
  width: 40px;
  height: 30px;
  line-height: 30px;
}
.form-out:hover {
  background-color: rgb(200, 200, 200);
}
</style>
