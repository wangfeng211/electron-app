<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Versions from './components/Versions.vue'

const platform = ref('')
const counter = ref(0)
platform.value = window.api.platform
const func = async () => {
  const res = await (window as Window).api.ping()
  console.log(`app.vue --- ${res}`)
}

const openDialog = () => {
  window.api.openSaveDialog()
}
onMounted(async () => {
  func()
  const num = await window.api.onUpdateCounter()
  console.log(`---App num:${num}`)
  // (platform.value = window.api.platform)
})
</script>

<template>
  <h1>当前的平台是 {{ platform }}</h1>
  <h2>{{ counter }}</h2>
  <Versions></Versions>

  <button @click="openDialog">选择文件</button>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
