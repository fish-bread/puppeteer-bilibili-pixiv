<script setup>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { computed, ref } from 'vue'
import { changeBackgroundImage } from '../../../axios/iframe'
import { isUserBackground } from '../../../function/user'

const previews = ref({})

const cropper = ref()
const input = ref()
const option = ref({
  autoCrop: true, // 是否默认生成截图框
  autoCropHeight: '660px', // 默认生成截图框宽度(默认值：容器的 80%, 可选值：0 ~ max), 真正裁剪出来的图片的宽度为 autoCropHeight * 1.25
  autoCropWidth: '1080px', // 默认生成截图框宽度(默认值：容器的 80%, 可选值：0 ~ max), 真正裁剪出来的图片的宽度为 autoWidth * 1.25
  canMove: true, // 上传图片是否可以移动
  canScale: true, // 图片是否允许滚轮缩放
  centerBox: true, // 截图框是否被限制在图片里面
  fixed: true, // 是否固定截图框的宽高比例
  fixedBox: true, // 是否固定截图框大小
  fixedNumber: [1080, 660], // 截图框的宽高比例([ 宽度 , 高度 ])
  img: '', // 裁剪图片的地址(可选值：url 地址, base64, blob)
  info: false, // 是否显示裁剪框的宽高信息
  infoTrue: true, // infoTrue为 true 时裁剪框显示的是预览图片的宽高信息,infoTrue为 false 时裁剪框显示的是裁剪框的宽高信息
  mode: 'contain', // 截图框可拖动时的方向(可选值：contain , cover, 100px, 100% auto)
  origin: true, // 上传的图片是否按照原始比例渲染
  outputSize: 1, // 裁剪生成图片的质量(可选值：0.1 ~ 1)
  outputType: 'png', // 裁剪生成图片的格式(可选值：png, jpeg, webp)
  outputQuality: '1'
})

// 实时预览
const realTime = (data) => {
  // console.log('realTime data =', data)
  previews.value = data
}

const downloadPreView = () => {
  let aLink = document.createElement('a')
  aLink.download = '预览图.png'

  cropper.value.getCropBlob((blob) => {
    aLink.href = window.URL.createObjectURL(blob)
    aLink.click()
  })
}

const uploadAvatar = (event) => {
  let file = event.target.files[0]

  if (!/\.(gif|jpg|jpeg|png|bmp)$/i.test(event.target.value)) {
    console.log('图片类型必须是.gif、jpeg、jpg、png、bmp中的一种')
    return false
  }

  //将图片格式传递出去
  const fileExtension = file.name.split('.').pop().toLowerCase()
  if (['png', 'jpg', 'jpeg', 'webp'].includes(fileExtension)) {
    option.value.outputType = fileExtension === 'jpg' ? 'jpeg' : fileExtension
  }

  let fileReader = new FileReader()
  fileReader.onload = (event) => {
    let data
    if (typeof event.target.result === 'object') {
      // 把 Array Buffer 转化为 blob
      data = window.URL.createObjectURL(new Blob([event.target.result]))
    } else {
      // 如果是 base64 ,不需要转换
      data = event.target.result
    }

    option.value.img = data

    // 创建临时 Image 对象获取图片原始宽高
    const img = new Image()
    img.src = data
    img.onload = () => {
      option.value.autoCropWidth = `${img.width}px`
      option.value.autoCropHeight = `${img.height}px`
    }
  }
  // 转化为blob
  fileReader.readAsArrayBuffer(file)
}

const handleUploadAvatar = () => {
  input.value.click()
}

const getPreviewStyle = computed(() => {
  return {
    width: previews.value.w + 'px',
    height: previews.value.h + 'px',
    overflow: 'hidden'
    // 'border-radius': '50%'
  }
})

const rotateLeft = () => {
  cropper.value.rotateLeft()
}

const rotateRight = () => {
  cropper.value.rotateRight()
}

const changeScale = (scaleSize) => {
  cropper.value.changeScale(scaleSize)
}
const updateAvatar = async () => {
  cropper.value.getCropBlob(async (blob) => {
    let avatar = new File([blob], `avatar.${option.value.outputType}`)
    //发送请求
    await changeBackgroundImage(avatar)
  })
}
</script>
<template>
  <div v-show="isUserBackground" class="wrapper">
    <div class="top">
      <button class="close-button" @click="isUserBackground = false">退出</button>
    </div>
    <div class="main">
      <div class="crop-container">
        <vue-cropper
          ref="cropper"
          class="crop"
          :auto-crop="option.autoCrop"
          :auto-crop-height="option.autoCropHeight"
          :auto-crop-width="option.autoCropWidth"
          :can-move="option.canMove"
          :can-scale="option.canScale"
          :center-box="option.centerBox"
          :fixed="option.fixed"
          :fixed-box="option.fixedBox"
          :fixed-number="option.fixedNumber"
          :img="option.img"
          :info="option.info"
          :info-true="option.infoTrue"
          :mode="option.mode"
          :origin="option.origin"
          :output-size="option.outputSize"
          :output-type="option.outputType"
          :rounded="true"
          @real-time="realTime"
        ></vue-cropper>

        <input
          v-show="false"
          id="input"
          ref="input"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadAvatar($event)"
        />

        <div class="action-buttons">
          <button @click="handleUploadAvatar">上传图片</button>
          <button @click="changeScale(1)">放大(向上滚动鼠标滑轮)</button>
          <button @click="changeScale(-1)">缩小(向下滚动鼠标滑轮)</button>
          <button @click="rotateLeft">向左旋转</button>
          <button @click="rotateRight">向右旋转</button>
          <button @click="downloadPreView">下载预览图</button>
          <button @click="updateAvatar">确定修改</button>
        </div>
      </div>

      <div class="preview-container">
        <div>
          <div class="preview-title">实时预览</div>
        </div>
        <div :style="getPreviewStyle">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" alt="" class="preview-img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top {
  padding-right: 250px;
  display: grid;
  justify-items: end;
  width: 100%;
  height: 100%;
}
.close-button {
  all: initial;
  width: 60px;
  height: 30px;
  transition: background-color 0.2s ease;
  display: grid;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
}
.close-button:hover {
  background-color: lightpink;
}
.wrapper {
  background-color: rgba(192, 192, 192, 0.5);
  display: grid;
  justify-content: start;
  justify-items: center;
  grid-template-rows: 30px auto;
  align-items: center;
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.main {
  display: flex;
  justify-content: space-around;
}

.crop {
  width: 925px;
  height: 500px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.preview-img {
  border: 5px solid black;
}

.preview-title {
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
