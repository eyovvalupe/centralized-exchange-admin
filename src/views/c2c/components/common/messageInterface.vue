<template>
  <div class="main">
    <div v-show="loading" class="loading w-full h-full flex flex-col items-center justify-center">
      <p>
        <el-icon class="is-loading" :size="30">
          <Loading />
        </el-icon>
      </p>
      <p> 请稍候...</p>
    </div>
    <main class="scroll-box" @scroll="handleScroll"
      ref="scrollChatContainer">
      <p class="w-full flex items-center justify-center"
        v-if="!useServiceC2C.messageList.length">
        <span>没有更多消息了...</span>
      </p>
      <ul v-else>
        <li v-for="item in useServiceC2C.messageList" :key="item.id" class="flex w-auto mb-[15px] "
          :class="item.direction === 'send' ? '' : 'justify-end'">
          <!-- <div>
            <span class="avatar-txt" v-if="item.direction == 'send'"> {{ (item.username || '匿').substring(0, 1)
              }}</span>
          </div> -->
          <div>
            <span class="flex" :class="item.direction === 'send' ? '' : 'justify-end'">
              <template v-if="item.type === 'img'">
                <div class="img-loading" v-if="item.fileName">
                  <el-icon size="60" color="#bbb"><icon-picture /></el-icon>
                  <div class="img-loading-txt">图片加载中...</div>
                  <!-- <div class="img-loading-txt">{{item.fileName}}</div> -->
                </div>
                <el-image v-else lazy :preview-src-list="[item.content]" :src="item.content"
                  class="imgMessage">
                  <template #placeholder>
                    <div class="image-slot">
                      <el-icon><icon-picture /></el-icon>
                    </div>
                  </template>
                  <template #error>
                    <div class="image-slot">
                      <el-icon><icon-picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
              <p v-else :class="item.direction"
                class="msg-con">
                <span>{{  item.content }}</span>
              </p>
            </span>
            <p :class="`txt-${item.direction}`">
              {{ dayjs(item.time).format('HH:mm:ss') }}
            </p>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useServiceStoreC2C } from '/@/store'
import { onMounted, nextTick, ref, watch } from 'vue'
import { apiMsgRead } from '/@/api/modules/c2cOrder'
import { dayjs } from 'element-plus'
const useServiceC2C = useServiceStoreC2C()
const loading = ref(false)
onUpdated(() => {
  scrollToBottom();
});

const scrollChatContainer = ref(null);
const scrollToBottom = () => {
  scrollChatContainer.value.scrollTop = scrollChatContainer.value.scrollHeight;
};
const handleScroll = () => {
  const container = scrollChatContainer.value;
  if (container.scrollTop + container.clientHeight === container.scrollHeight) {
    apiMsgRead({ order_no: useServiceC2C.orderNo })
  }
};
onMounted(() => {
   setTimeout(() => {
    scrollToBottom();
   }, 100);
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.519);
    z-index: 10;
  }
}

.image-slot {
  cursor: pointer;
  font-size: 50px;
  color: #ccc;
}
.img-loading{
 text-align: center;
 background: #f5f5f5;
 padding: 5px 10px;
 border-radius: 10px;
 color: #bbb;
}

.scroll-box {
  background: #fff;
  height: 450px;

  &.select-box {
    height: 420px;
  }

  overflow-y: auto;
  padding: 10px 5px;

}

.del-tools {
  background: #f5f5f5;
}

.scroll-box::-webkit-scrollbar {
  width: 6px;
}

.scroll-box::-webkit-scrollbar-thumb {
  background-color: rgba(218, 214, 214, 0.795);
  border-radius: 3px;
}

.txt-receive {
  text-align: right;
}

.msg-con {
  min-height: 25px;
  min-width: 40px;
  position: relative;
  padding: 5px 10px;
  background: #f5f5f5;
}

.receive {
  background: #165dff;
  color: #fff;
  border-radius: 10px 0 10px 10px;

}

.send {
  background: #EAEAEA;
  color: #333;
  border-radius: 0 10px 10px 10px;

}
</style>