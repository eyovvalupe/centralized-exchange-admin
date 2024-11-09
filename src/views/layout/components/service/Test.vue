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
const openReceiveMsgNotifi1 = computed(() => useCommon.openReceiveMsgNotifi1)
const openReceiveMsgNotifi2 = computed(() => useCommon.openReceiveMsgNotifi2)
const openReceiveMsgNotifi3 = computed(() => useCommon.openReceiveMsgNotifi3)
const openReceiveMsgNotifi4 = computed(() => useCommon.openReceiveMsgNotifi4)

const click1 = () => {
  if (!openReceiveMsgNotifi1.value) {
    useCommon.toggleNotification1(true)
    useCommon.setAlreadyRender1()
    useCommon.setDepositMsgPosition(numOfOpen())
    console.log(numOfOpen())
  }
}
const click2 = () => {
  if (!openReceiveMsgNotifi2.value) {
    useCommon.toggleNotification2(true)
    useCommon.setAlreadyRender2()
    useCommon.setVerifyMsgPosition(numOfOpen())
    console.log(numOfOpen())
  }
}
const click3 = () => {
  if (!openReceiveMsgNotifi3.value) {
    useCommon.toggleNotification3(true)
    useCommon.setAlreadyRender3()
    useCommon.setServiceMsgPosition(numOfOpen())
    console.log(numOfOpen())
  }
}
const click4 = () => {
  if (!openReceiveMsgNotifi4.value) {
    useCommon.toggleNotification4(true)
    useCommon.setAlreadyRender4()
    useCommon.setWithdrawMsgPosition(numOfOpen())
    console.log(numOfOpen())
  }
}

const numOfOpen = () => {
  let i = -1
  if (openReceiveMsgNotifi1.value) i++
  if (openReceiveMsgNotifi2.value) i++
  if (openReceiveMsgNotifi3.value) i++
  if (openReceiveMsgNotifi4.value) i++
  return i
}
</script>
