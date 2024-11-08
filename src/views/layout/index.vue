<template>
  <div class="relative">
    <NavBar />
    <AppMain />
    <ReceiveMessageAlert :numobj="messageNumObj['deposit']" :isOpen="openReceiveMsgNotifi1" :type="'deposit'"/>
    <ReceiveMessageAlert :numobj="messageNumObj['kyc']" :isOpen="openReceiveMsgNotifi2" :type="'verify'"/>
    <ReceiveMessageAlert :numobj="messageNumObj['support']" :isOpen="openReceiveMsgNotifi3" :type="'service'"/>
    <ReceiveMessageAlert :numobj="messageNumObj['withdraw']" :isOpen="openReceiveMsgNotifi4" :type="'withdraw'"/>

  </div>
</template>

<script setup>
import ReceiveMessageAlert from '../../components/ReceiveMessageAlert.vue';
import AppMain from '/@/views/layout/components/AppMain.vue'
import NavBar from '/@/views/layout/components/navbar'
import { useServiceStore, useCommonStore } from '/@/store';

const useService = useServiceStore()
const useCommon = useCommonStore()
const messageNumObj = computed(() => useService.messageNumObj)
const openReceiveMsgNotifi1 = computed(() => useCommon.openReceiveMsgNotifi1)
const openReceiveMsgNotifi2 = computed(() => useCommon.openReceiveMsgNotifi2)
const openReceiveMsgNotifi3 = computed(() => useCommon.openReceiveMsgNotifi3)
const openReceiveMsgNotifi4 = computed(() => useCommon.openReceiveMsgNotifi4)


</script>
