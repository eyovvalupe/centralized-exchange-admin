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
const depositMsgPosition = computed(() => useCommon.depositMsgPosition)
const verifyMsgPosition = computed(() => useCommon.verifyMsgPosition)
const serviceMsgPosition = computed(() => useCommon.serviceMsgPosition)
const withdrawMsgPosition = computed(() => useCommon.withdrawMsgPosition)

const click1 = () => {
  if (!openReceiveMsgNotifi1.value) {
    useCommon.toggleNotification1(true)
    useCommon.setAlreadyRender1()
    useCommon.setDepositMsgPosition(numOfOpen())
  } else {
    if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > depositMsgPosition.value)
      useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
    if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > depositMsgPosition.value)
      useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
    if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > depositMsgPosition.value)
      useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
    useCommon.setDepositMsgPosition(numOfOpen())
    useCommon.setLatestMsg(1)
  }
  useCommon.setDepositMsgLasttime(Date.now())
}
const click2 = () => {
  if (!openReceiveMsgNotifi2.value) {
    useCommon.toggleNotification2(true)
    useCommon.setAlreadyRender2()
    useCommon.setVerifyMsgPosition(numOfOpen())
  } else {
    if (openReceiveMsgNotifi1.value && depositMsgPosition.value > verifyMsgPosition.value)
      useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
    if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > verifyMsgPosition.value)
      useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
    if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > verifyMsgPosition.value)
      useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
    useCommon.setVerifyMsgPosition(numOfOpen())
    useCommon.setLatestMsg(2)
  }
  useCommon.setVerifyMsgLasttime(Date.now())
}
const click3 = () => {
  if (!openReceiveMsgNotifi3.value) {
    useCommon.toggleNotification3(true)
    useCommon.setAlreadyRender3()
    useCommon.setServiceMsgPosition(numOfOpen())
  } else {
    if (openReceiveMsgNotifi1.value && depositMsgPosition.value > serviceMsgPosition.value)
      useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
    if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > serviceMsgPosition.value)
      useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
    if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > serviceMsgPosition.value)
      useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
    useCommon.setServiceMsgPosition(numOfOpen())
    useCommon.setLatestMsg(3)
  }
  useCommon.setServiceMsgLasttime(Date.now())
}
const click4 = () => {
  if (!openReceiveMsgNotifi4.value) {
    useCommon.toggleNotification4(true)
    useCommon.setAlreadyRender4()
    useCommon.setWithdrawMsgPosition(numOfOpen())
  } else {
    if (openReceiveMsgNotifi1.value && depositMsgPosition.value > withdrawMsgPosition.value)
      useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
    if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > withdrawMsgPosition.value)
      useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
    if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > withdrawMsgPosition.value)
      useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
    useCommon.setWithdrawMsgPosition(numOfOpen())
    useCommon.setLatestMsg(4)
  }
  useCommon.setWithdrawMsgLasttime(Date.now())
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
