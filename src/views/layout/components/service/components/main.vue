<template>
  <section class="flex-1 flex-col justify-between">
    <div>
      <userInforHeader />
      <messageInterface />
    </div>
    <sendMessage />
  </section>
</template>

<script setup>
import userInforHeader from './common/userInforHeader.vue'
import messageInterface from './common/messageInterface.vue'
import sendMessage from './common/sendMessage.vue'
</script>

<style lang="scss" scoped>
.Popconfirm-enter-active,
.Popconfirm-leave-active {
  transition: all 0.3s ease-in-out;
}

.Popconfirm-enter-from,
.Popconfirm-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>
