<template>
  <router-view v-slot="{ Component }">
    <el-scrollbar :height="height">
      <!-- 页面表格加载方式 -->
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
      <!-- <component :is="Component" /> -->
    </el-scrollbar>
  </router-view>
</template>

<script setup>
import { ref } from 'vue'
import {wsConnect} from '/@/utils/socket'
import { useSocketStore } from '/@/store'
const socketStore = useSocketStore()
const ws =wsConnect('/admin',() => {
  socketStore.setWS(ws);
});
ws.on('realtime', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('contractList', data);
  }
})
ws.on('stockorder', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('stockOrderList', data);
  }
})
ws.on('futuresorder', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('futureOrderList', data);
  }
})
ws.on('aiquantorder', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('aiOrderList', data);
  }
})
ws.on('c2corder', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('c2cOrderList', data);
  }
})
ws.on('futures_control_list', ({ data, code }) => {
  if (code == 200) {
    socketStore.setDataList('futureList', data);
  }
})
const height = ref('calc( 100vh - 90px)')
defineOptions({
  name: 'AppMain'
})
</script>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

.el-scrollbar__view {
  height: 100%;
}
</style>
