<template>
  <div class="relative" style="overflow: hidden;">
    <NavBar />
    <AppMain />
    <ReceiveMessageAlert :numobj="messageNumObj['deposit']" :type="'deposit'" :isOpen="openReceiveMsgNotifi1" v-if="isRender1"/>
    <ReceiveMessageAlert :numobj="messageNumObj['kyc']" :type="'verify'" :isOpen="openReceiveMsgNotifi2" v-if="isRender2"/>
    <ReceiveMessageAlert :numobj="messageNumObj['support']" :type="'service'" :isOpen="openReceiveMsgNotifi3" v-if="isRender3"/>
    <ReceiveMessageAlert :numobj="messageNumObj['withdraw']" :type="'withdraw'" :isOpen="openReceiveMsgNotifi4" v-if="isRender4"/>

  </div>
</template>

<script setup>
import ReceiveMessageAlert from '../../components/ReceiveMessageAlert.vue';
import AppMain from '/@/views/layout/components/AppMain.vue'
import NavBar from '/@/views/layout/components/navbar'
import { useServiceStore, useCommonStore } from '/@/store';
import { watch } from 'vue';

const useService = useServiceStore()
const useCommon = useCommonStore()
const messageNumObj = computed(() => useService.messageNumObj)
const receivedServiceMsg = computed(() => useService.receivedServiceMsg)
const openReceiveMsgNotifi1 = computed(() => useCommon.openReceiveMsgNotifi1)
const openReceiveMsgNotifi2 = computed(() => useCommon.openReceiveMsgNotifi2)
const openReceiveMsgNotifi3 = computed(() => useCommon.openReceiveMsgNotifi3)
const openReceiveMsgNotifi4 = computed(() => useCommon.openReceiveMsgNotifi4)
const isRender1 = computed(() => useCommon.isRender1)
const isRender2 = computed(() => useCommon.isRender2)
const isRender3 = computed(() => useCommon.isRender3)
const isRender4 = computed(() => useCommon.isRender4)

</script>
