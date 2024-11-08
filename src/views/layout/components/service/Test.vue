<template>
  <div>
    <div class="w-[40px] h-[40px] bg-[red]" @click="click1">button1</div>
    <div class="w-[40px] h-[40px] bg-[blue]" @click="click2">button2</div>
    <div class="w-[40px] h-[40px] bg-[green]" @click="click3">button3</div>
    <div class="w-[40px] h-[40px] bg-[purple]" @click="click4">button4</div>
  </div>
</template>
<script setup>
import { useCommonStore } from '/@/store'

const useCommon = useCommonStore()

const click1 = () => {
  useCommon.toggleNotification1(true)
  useCommon.setAlreadyRender1()
}
const click2 = () => {
  useCommon.toggleNotification2(true)
  useCommon.setAlreadyRender2()
}
const click3 = () => {
  useCommon.toggleNotification3(true)
  useCommon.setAlreadyRender3()
}
const click4 = () => {
  useCommon.toggleNotification4(true)
  useCommon.setAlreadyRender4()
}
</script>
