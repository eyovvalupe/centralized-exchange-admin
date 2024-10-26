<template>
  <div class="relative h-full flex w-full">
    <ServiceSider />
    <ServiceMain />
  </div>
</template>

<script setup>
import { ServiceChat } from '../service/components/common/ServiceChat'
import ServiceSider from './components/sider.vue'
import ServiceMain from './components/main.vue'
import { useUserStore } from '/@/store'
const userStore = useUserStore()
const hasToken = userStore.token
import { watch } from 'vue';
</script>

<style lang="scss" scoped>
.messageBox-enter-active,
.messageBox-leave-active {
  transition: all 0.3s ease-in-out;
}

.messageBox-enter-from,
.messageBox-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>